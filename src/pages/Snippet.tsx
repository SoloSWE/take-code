import { useEffect, useState } from 'react';

import { Link, useLocation, useParams } from 'react-router-dom';

import { Check, Copy, CornerDownRight, MessageSquareCode, Star, Trash2, X } from 'lucide-react';

import { cn } from '../utils/cn';
import { supabase } from '../utils/supabase';

import { Button } from '../components/ui/Button';
import { CodeBlock } from '../components/ui/CodeBlock';
import type { dependencyT } from '../components/features/Showcase';
import { SnippetPageSkeleton } from '../components/ui/Skeletons/SnippetPageSkeleton';

interface snippetCard {
	id: string;
	user_id: string;
	language_id: string;
	framework_id?: string;
	title: string;
	description: string;
	code_filename: string;
	code: string;
	tags: string[];
	stars_count: number;
	snippet_stars?: { user_id: string }[];
	is_starred_by_user?: boolean;
	copied_count: number;
	dependencies?: { dependencies: dependencyT }[];
	languages?: {
		name: string;
		icon: string;
		background: string;
		color: string;
		borderColor: string;
	} | null;
	frameworks?: {
		name: string;
	} | null;
	profiles?: {
		tag: string;
		avatar_url: string;
	} | null;
	created_at: string;
}

interface commentT {
	id: string;
	user_id: string;
	snippet_id: string;
	content: string;
	parent_id: string | null;
	profiles: {
		tag: string;
		avatar_url: string;
	};
	created_at: string | null;
}

export const Snippet = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();

	const [snippet, setSnippet] = useState<snippetCard | null>(null);
	const [comments, setComments] = useState<commentT[]>([]);
	const [replyTo, setReplyTo] = useState<commentT | null>(null);

	const [loading, setLoading] = useState<boolean>(false);

	const [copied, setCopied] = useState<boolean>(false);
	const [copiedDependencyId, setCopiedDependencyId] = useState<string | null>(
		null,
	);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	const [commentText, setCommentText] = useState<string>('');

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname])

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setCurrentUserId(data.user?.id ?? null);
		});
	}, []);

	useEffect(() => {
		async function fetchComments() {
			try {
				const { data } = await supabase
					.from('snippet_comments')
					.select('*, profiles:user_id(tag, avatar_url)')
					.eq('snippet_id', id);
				if (data) setComments(data);
			} catch (error) {
				console.log(error);
			}
		}

		fetchComments();
	}, [id]);

	useEffect(() => {
		if (!id) return;

		async function fetchSnippet() {
			setLoading(true);
			try {
				// Получаем текущего юзера для проверки его лайка
				const {
					data: { user },
				} = await supabase.auth.getUser();

				// Делаем один связный запрос (включая frameworks)
				const { data, error } = await supabase
					.from('snippets')
					.select(
						`
                        *,
                        languages(name, color, background, borderColor, icon),
                        frameworks(name),
                        profiles:user_id(tag, avatar_url),
                        snippets_stars(user_id),
                        dependencies:snippet_dependencies(
                            dependencies(id, name, install_command, color, bg, border_color)
                        )
                    `,
					)
					.eq('id', id)
					.single();

				if (error) throw error;

				if (data) {
					// Вычисляем, поставил ли текущий юзер лайк
					const isStarred = user
						? data.snippets_stars?.some(
								(star: { user_id: string }) => star.user_id === user.id,
							)
						: false;

					setSnippet({
						...data,
						is_starred_by_user: !!isStarred,
					});
				}
			} catch (error) {
				console.error('Ошибка при загрузке сниппета:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchSnippet();
	}, [id]);

	const addComment = async (text: string, parentId: string | null = null) => {
		if (!text.trim()) return;

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert('Авторизуйтесь, чтобы оставлять комментарии!');
			return;
		}

		if (!snippet?.id) return;

		const commentData = {
			snippet_id: snippet.id,
			user_id: user.id,
			content: text.trim(),
			parent_id: parentId,
		};

		try {
			const { data, error } = await supabase
				.from('snippet_comments')
				.insert([commentData])
				.select(
					`
					id,
					user_id,
					snippet_id,
					content,
					parent_id,
					created_at,
					profiles:user_id(tag, avatar_url)
				`,
				)
				.single();

			if (error) throw error;

			if (data) {
				setComments(prev => [...prev, data as unknown as commentT]);
				setCommentText('');
				setReplyTo(null); // Сбрасываем выбранный ответ после успешной отправки
			}
		} catch (error) {
			console.error('Ошибка при отправке комментария:', error);
		}
	};

	const deleteComment = async (commentId: string) => {
		if (!confirm('Вы уверены, что хотите удалить комментарий?')) return;

		try {
			const { error } = await supabase
				.from('snippet_comments')
				.delete()
				.eq('id', commentId);

			if (error) throw error;

			// Удаляем сам комментарий и все ответы на него (если это был родительский)
			setComments(prev =>
				prev.filter(
					comment =>
						comment.id !== commentId && comment.parent_id !== commentId,
				),
			);
		} catch (error) {
			console.error('Ошибка при удалении комментария:', error);
		}
	};

	const copyCode = (code: string) => {
		navigator.clipboard.writeText(code ?? '').then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const copyDependencieFunc = (dependencieID: string) => {
		const currentDependencie = snippet?.dependencies?.find(
			dep => dep.dependencies.id === dependencieID,
		);

		if (!currentDependencie) return;

		navigator.clipboard
			.writeText(currentDependencie.dependencies.install_command ?? '')
			.then(() => {
				setCopiedDependencyId(dependencieID);
				setTimeout(() => setCopiedDependencyId(null), 2000);
			});
	};

	const handleToggleStar = async (
		snippetId: string | null,
		isStarred: boolean,
	) => {
		if (!snippetId) return;

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert('Пожалуйста, авторизуйтесь, чтобы ставить лайки!');
			return;
		}

		// 1. Оптимистичный апдейт интерфейса
		setSnippet(prev => {
			if (!prev) return null;
			return {
				...prev,
				is_starred_by_user: !isStarred,
				stars_count: isStarred
					? Math.max(0, prev.stars_count - 1)
					: prev.stars_count + 1,
			};
		});

		// 2. Синхронизация с Supabase
		if (isStarred) {
			const { error } = await supabase
				.from('snippets_stars')
				.delete()
				.eq('snippet_id', snippetId)
				.eq('user_id', user.id);

			if (error) console.error('Ошибка при удалении лайка:', error);
		} else {
			const { error } = await supabase
				.from('snippets_stars')
				.upsert(
					{ snippet_id: snippetId, user_id: user.id },
					{ onConflict: 'user_id, snippet_id' },
				);

			if (error) console.error('Ошибка при добавлении лайка:', error);
		}
	};

	const formattedDate = snippet?.created_at
		? new Date(snippet?.created_at).toLocaleDateString()
		: '';

	const rootComments = comments.filter(comment => !comment.parent_id);

	const renderCommentCard = (comment: commentT, isChild = false) => (
		<div
			key={comment.id}
			className={cn(
				'w-full h-auto bg-[#0e1424] border border-[#212839] px-5 py-4 rounded-3xl flex flex-col justify-between gap-3 group',
				isChild && 'bg-[#090e1a] border-[#181f2f]',
			)}
		>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<img
						className='w-9 h-9 rounded-full object-cover'
						src={comment?.profiles?.avatar_url}
						alt='avatar'
					/>
					<Link to={`/user/${comment?.user_id}`}>
						<span className='text-[#a1abb8] transition-colors hover:text-[#F8FAFC] font-bold'>
							@{comment?.profiles?.tag}
						</span>
					</Link>
				</div>

				<div className='flex items-center gap-3'>
					<span className='text-[#a1abb8] font-semibold text-[14px]'>
						{comment.created_at
							? new Date(comment.created_at).toDateString()
							: ''}
					</span>

					{/* Показываем корзину только если комментарий принадлежит текущему пользователю */}
					{currentUserId === comment.user_id && (
						<button
							onClick={() => deleteComment(comment.id)}
							className='text-slate-500 hover:text-red-400 transition-colors cursor-pointer p-1'
							title='Удалить комментарий'
						>
							<Trash2 size={16} />
						</button>
					)}
				</div>
			</div>

			<p className='text-[#a2acb9] font-medium text-[15px] leading-relaxed'>
				{comment.content}
			</p>

			{!isChild && (
				<div className='flex justify-end'>
					<button
						onClick={() => setReplyTo(comment)}
						className='flex items-center gap-1.5 text-sm text-[#67e8f9] font-semibold hover:underline cursor-pointer'
					>
						<CornerDownRight size={16} />
						Reply
					</button>
				</div>
			)}
		</div>
	);

	if (loading || !snippet) {
		return <SnippetPageSkeleton />;
	}

	return (
		<div className='w-full py-6 px-10'>
			<section className='flex justify-between items-start gap-8'>
				<aside className='flex flex-1 flex-col min-w-0'>
					<div className='flex items-center justify-between gap-4'>
						<div className='flex items-center gap-5'>
							<span className='text-[#67e8f9] font-semibold'>{`${snippet?.languages?.name} / ${snippet?.frameworks?.name}`}</span>
							<div className='flex items-center gap-2'>
								<img
									className='w-8 h-8 rounded-full object-cover'
									src={snippet?.profiles?.avatar_url}
									alt='img'
								/>
								<Link to={`/user/${snippet?.user_id}`}>
									<span className='text-[#a1abb8] font-semibold text-[15px] transition-colors hover:text-white'>{`@${snippet?.profiles?.tag} ${formattedDate}`}</span>
								</Link>
							</div>
						</div>
					</div>
					<div className='w-full flex flex-col mt-3'>
						<h2 className='text-4xl text-white font-bold'>{snippet?.title}</h2>
						<p className='text-[#94A3B8] text-left font-normal text-lg mt-2 max-w-2xl'>
							{snippet?.description}
						</p>
					</div>
					<div className='mt-6 w-full'>
						<div className='w-full h-auto bg-[#0f172a] rounded-3xl border border-[#1e2639] overflow-hidden'>
							<div className='flex items-center justify-between w-full px-5 py-4 border-b border-[#1e2639]'>
								<div className='flex items-center gap-4'>
									<ul className='flex items-center justify-center gap-2 max-sm:hidden'>
										<li className='w-3.5 h-3.5 bg-[#F87171] rounded-full'></li>
										<li className='w-3.5 h-3.5 bg-[#FBBF24] rounded-full'></li>
										<li className='w-3.5 h-3.5 bg-[#34D399] rounded-full'></li>
									</ul>
									<p className='text-white text-lg font-mono max-md:text-[16px] max-sm:text-sm'>
										{snippet?.code_filename ?? ''}
									</p>
								</div>
								<div className='flex gap-3'>
									<button
										onClick={() =>
											handleToggleStar(
												snippet?.id ?? null,
												!!snippet?.is_starred_by_user,
											)
										}
										className='flex items-center gap-1.5 font-semibold px-4 py-2 bg-[#0f172a] border border-[#222b3e] rounded-2xl text-slate-300 hover:text-white transition-colors cursor-pointer'
									>
										<Star
											className={
												snippet?.is_starred_by_user
													? 'text-[#e3d07f] fill-[#e3d07f]'
													: 'text-[#cbd5e1]'
											}
											size={20}
										/>
										<span>{snippet?.stars_count}</span>
									</button>
									<Button
										onClick={() => copyCode(snippet?.code ?? '')}
										copiedStatus={copied}
									/>
								</div>
							</div>
							<CodeBlock
								code={snippet?.code ?? ''}
								language={snippet?.languages?.name ?? ''}
							/>
						</div>
					</div>
				</aside>
				<aside className='w-96 shrink-0 flex flex-col gap-5'>
					<div className='p-5 bg-[#0f172a] border border-[#1e2639] rounded-3xl text-white'>
						<div className='flex items-center justify-between'>
							<h3 className='font-black text-xl'>Dependencies</h3>
							<p className='text-[#67E8F9] font-bold'>{`${snippet?.dependencies?.length || 0} packages`}</p>
						</div>
						<ul className='flex flex-col gap-3 mt-4'>
							{snippet?.dependencies?.map(dep => (
								<li
									key={dep.dependencies.id}
									className='rounded-2xl px-4 py-3 border'
									style={{
										background: dep.dependencies.bg,
										borderColor: dep.dependencies.border_color,
									}}
								>
									<div className='flex items-center justify-between'>
										<div>
											<h4
												className='font-mono font-bold'
												style={{ color: dep.dependencies.color }}
											>
												{dep.dependencies.name}
											</h4>
											<p className='font-mono font-medium text-[#94A3B8] text-sm'>
												{dep.dependencies.install_command}
											</p>
										</div>
										<button
											className='flex items-center justify-center gap-2 w-auto h-auto rounded-3xl bg-[#34d3992e] border border-[#34d39952] text-[#A7F3D0] transition-colors duration-200 ease-in-out hover:bg-[#45ffbb2e] hover:border-[#28e09d52] hover:text-[#9bf9cd] cursor-pointer px-3 py-2'
											onClick={() => copyDependencieFunc(dep.dependencies.id)}
										>
											{copiedDependencyId === dep.dependencies.id ? (
												<Check color='#34D399' size={20} />
											) : (
												<Copy color='#34D399' size={18} />
											)}
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
					<div className='p-5 bg-[#0f172a] border border-[#1e2639] rounded-3xl text-white'>
						<h3 className='font-black text-xl'>Readme</h3>
						<p className='text-[#94A3B8] mt-3'>
							Lorem ipsum dolor sit, amet consectetur adipisicing elit.
						</p>
					</div>
					<div className='p-5 bg-[#0f172a] border border-[#1e2639] rounded-3xl text-white'>
						<h3 className='font-black text-xl'>Searchable tags</h3>
						<ul className='flex flex-wrap gap-2 mt-4'>
							{snippet?.tags?.map((tag, index) => (
								<li
									key={index}
									className='flex items-center justify-center rounded-3xl font-bold text-sm px-4 py-1.5 bg-[#151c29] border border-[#242d3a] text-[#CBD5E1]'
								>
									{tag}
								</li>
							))}
						</ul>
					</div>
				</aside>
			</section>

			{/* СЕКЦИЯ КОММЕНТАРИЕВ */}
			<section className='mt-12 w-full'>
				<div>
					<h3 className='text-2xl text-white font-black'>Discussion</h3>
					<p className='text-[#94A3B8] text-left font-medium mt-1'>
						Optimizations, edge cases, and implementation notes from the
						TakeCode community.
					</p>
				</div>

				<div className='w-full mt-6 flex flex-col gap-6'>
					{/* Список всех тредов */}
					<div className='flex flex-col gap-4'>
						{comments.length === 0 ? (
							<div className='w-full py-12 px-6 bg-[#0e1424]/40 border border-[#212839]/60 rounded-3xl flex flex-col items-center justify-center text-center'>
								<div className='p-3 bg-[#1e293b]/50 border border-[#2a364f] rounded-2xl mb-3 text-[#67e8f9]'>
									<MessageSquareCode size={28} />
								</div>
								<h4 className='text-lg font-bold text-white mb-1'>
									No comments yet
								</h4>
								<p className='text-[#94A3B8] text-sm max-w-sm font-medium'>
									Be the first to share feedback, edge cases, or optimizations
									for this snippet!
								</p>
							</div>
						) : (
							rootComments.map(parentComment => {
								const childComments = comments.filter(
									child => child.parent_id === parentComment.id,
								);

								return (
									<div key={parentComment.id} className='flex flex-col gap-3'>
										{/* Главный комментарий */}
										{renderCommentCard(parentComment, false)}

										{/* Вложенные ответы (со сдвигом влево/линией) */}
										{childComments.length > 0 && (
											<div className='ml-8 pl-4 border-l-2 border-[#212839] flex flex-col gap-3'>
												{childComments.map(child =>
													renderCommentCard(child, true),
												)}
											</div>
										)}
									</div>
								);
							})
						)}
					</div>

					{/* Индикатор того, что пользователь отвечает на конкретный комментарий */}
					{replyTo && (
						<div className='flex items-center justify-between bg-[#0e172a] border border-[#1e293b] px-4 py-2.5 rounded-2xl text-sm text-[#94a3b8] animate-in fade-in duration-200'>
							<span>
								Replying to{' '}
								<strong className='text-[#67e8f9]'>
									@{replyTo.profiles.tag}
								</strong>
							</span>
							<button
								onClick={() => setReplyTo(null)}
								className='flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs'
							>
								<X size={16} /> Cancel
							</button>
						</div>
					)}

					{/* Поле ввода комментария */}
					<div className='flex items-center justify-between w-full bg-[#040818] border border-[#08293a] rounded-2xl px-4 py-3 gap-3'>
						<input
							type='text'
							value={commentText}
							onChange={e => setCommentText(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter')
									addComment(commentText, replyTo?.id ?? null);
							}}
							className='w-full text-[16px] text-white font-medium outline-none placeholder:text-[#727e92] bg-transparent'
							placeholder={
								replyTo
									? `Reply to @${replyTo.profiles.tag}...`
									: 'Share an optimization, bug, or implementation note…'
							}
						/>
						<button
							onClick={() => addComment(commentText, replyTo?.id ?? null)}
							className='w-20 h-10 shrink-0 rounded-xl bg-linear-to-br from-[#38BDF8] to-[#34D399] font-black cursor-pointer text-black active:scale-95 hover:opacity-90 transition-all'
						>
							Post
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};