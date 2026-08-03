import { useEffect, useState } from 'react';

import type { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

import { Bookmark, Code2 } from 'lucide-react';

import { ProfileAbout } from '../components/features/ProfileAbout';
import { ProfileSettings } from '../components/features/ProfileSettings';
import { ProfileFeaturedSnippets } from '../components/features/ProfileFeaturedSnippets';
import type { snippetCard } from '../components/features/Showcase';

import { ProflieAboutLoader } from '../components/ui/Loaders/ProflieAboutLoader';
import { ProfileFeaturedSnippetsLoader } from '../components/ui/Loaders/ProfileFeaturedSnippetsLoader';
import { cn } from '../utils/cn';
import { UserSnippetsList } from '../components/features/UserSnippetsList';
import { Link } from 'react-router-dom';
import { UserBookmarkedSnippetsList } from '../components/features/UserBookmarkedSnippetsList';

export interface SocialMedia {
	id: number;
	name: string;
	link: string;
}

export interface UserProfile {
	id: string;
	avatar_url: string;
	username: string;
	display_name: string;
	about: string;
	speciality: string;
	tag: string;
	social_medias: SocialMedia[];
}

export const Profile = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [featuredSnippets, setFeaturedSnippets] = useState<
		snippetCard[] | null
	>(null);
	const [snippetsCount, setSnippetsCount] = useState<number>(0);
	const [snippetsCountCopy, setSnippetsCountCopy] = useState<number>(0);
	const [bookmarkedSnippetsCount, setBookmarkedSnippetsCount] =
		useState<number>(0);

	const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
	const [selectedCategory, setSelectedCategory] =
		useState<string>('My Snippets');

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user || null);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		if (user?.id) {
			async function fetchUser() {
				setLoading(true);
				try {
					const { data } = await supabase
						.from('profiles')
						.select('*')
						.eq('id', user?.id);

					if (data) {
						setUserProfile(data[0]);
					}
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			}
			fetchUser();
		}
	}, [user?.id]);

	useEffect(() => {
		if (!user?.id) return;

		async function fetchFeaturedSnippets() {
			setLoading(true);
			try {
				const [featuredSnippetsRes, snippetsCountRes, bookmarkedSnippetsRes] =
					await Promise.all([
						supabase
							.from('snippets')
							.select('*, profiles(avatar_url, tag, username)')
							.order('stars_count', { ascending: false })
							.eq('user_id', user?.id)
							.limit(2),
						supabase
							.from('snippets')
							.select('*, copied_count')
							.eq('user_id', user?.id),
						supabase
							.from('bookmarks')
							.select('*', { count: 'exact' })
							.eq('user_id', user?.id),
					]);

				setFeaturedSnippets(featuredSnippetsRes.data || []);
				setSnippetsCount(snippetsCountRes.data?.length || 0);
				setBookmarkedSnippetsCount(bookmarkedSnippetsRes.count || 0);
				setSnippetsCountCopy(
					snippetsCountRes.data?.reduce(
						(acc, snippet) => acc + (snippet.copied_count || 0),
						0,
					) || 0,
				);
			} catch (error) {
				console.error('Error fetching featured snippets:', error);
				console.error('Error fetching snippet copies:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchFeaturedSnippets();
	}, [user?.id]);

	const handleSelectedCategory = (category: string) => {
		setSelectedCategory(category);
	};

	return (
		<section className='w-full max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-10'>
			{/* Верхний блок: Профиль и Популярные сниппеты */}
			<div className='flex flex-col lg:flex-row gap-4 w-full bg-[#0c1321] border border-[#252d3c] rounded-3xl sm:rounded-4xl p-3 sm:p-4.5'>
				{/* Левая колонка (Профиль) */}
				<div className='w-full lg:w-1/2 bg-[#080e1d] border border-[#19202f] rounded-2xl sm:rounded-3xl flex flex-col gap-5 p-5 sm:p-7 lg:p-9 hover:border-[#252e44] transition-colors'>
					{loading ? (
						<ProflieAboutLoader />
					) : (
						<ProfileAbout
							userProfile={userProfile}
							onOpenSettings={() => setIsSettingsOpen(true)}
							totalCreatedSnippets={snippetsCount}
							snippetsCountCopy={snippetsCountCopy}
						/>
					)}
				</div>

				{/* Правая колонка (Featured Snippets) */}
				<div className='w-full lg:w-1/2 flex flex-col'>
					<div className='w-full h-full min-h-75 sm:min-h-90 bg-[#080e1d] border border-[#19202f] rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 hover:border-[#252e44] transition-colors overflow-hidden'>
						{loading ? (
							<ProfileFeaturedSnippetsLoader />
						) : (
							<ProfileFeaturedSnippets featuredSnippets={featuredSnippets} />
						)}
					</div>
				</div>
			</div>

			{/* Панель навигации по категориям и действие */}
			<div className='bg-[#090f22] border border-[#20273b] mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl p-3 sm:p-4'>
				<div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4'>
					{/* Табы */}
					<div className='flex w-full sm:w-auto'>
						<ul className='flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto'>
							<li
								onClick={() => handleSelectedCategory('My Snippets')}
								className={cn(
									'flex-1 sm:flex-initial flex items-center justify-center sm:justify-start bg-[#13182b] border border-[#20273a] px-3.5 sm:px-4 py-2.5 sm:py-3 gap-2.5 sm:gap-3 text-[#94a3b8] text-sm sm:text-base rounded-xl sm:rounded-2xl cursor-pointer transition-colors whitespace-nowrap',
									selectedCategory === 'My Snippets' &&
										'bg-[#252d3c] text-white',
								)}
							>
								<Code2 className='w-4 h-4 sm:w-5 sm:h-5' />
								My Snippets
							</li>
							<li
								onClick={() => handleSelectedCategory('Saved / Bookmarks')}
								className={cn(
									'flex-1 sm:flex-initial flex items-center justify-center sm:justify-start bg-[#13182b] border border-[#20273a] px-3.5 sm:px-4 py-2.5 sm:py-3 gap-2.5 sm:gap-3 text-[#94a3b8] text-sm sm:text-base rounded-xl sm:rounded-2xl cursor-pointer transition-colors whitespace-nowrap',
									selectedCategory === 'Saved / Bookmarks' &&
										'bg-[#252d3c] text-white',
								)}
							>
								<Bookmark className='w-4 h-4 sm:w-5 sm:h-5' />
								Saved / Bookmarks
							</li>
						</ul>
					</div>

					{/* Счетчик и Кнопка */}
					<div className='flex flex-row items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t border-[#20273b] sm:border-t-0'>
						<p className='text-[#64748b] font-mono text-xs sm:text-sm md:text-base whitespace-nowrap'>
							{selectedCategory === 'My Snippets'
								? snippetsCount
								: bookmarkedSnippetsCount}{' '}
							published
						</p>
						<Link
							to={'/createSnippet'}
							className='w-auto sm:w-auto flex-1 sm:flex-initial'
						>
							<button className='w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-linear-to-br from-[#38BDF8] to-[#34D399] font-bold cursor-pointer text-[#13182b] active:scale-98 transition-transform text-sm sm:text-base whitespace-nowrap'>
								New Snippet
							</button>
						</Link>
					</div>
				</div>
			</div>

			{/* Список сниппетов */}
			<div className='mt-4 sm:mt-6'>
				{selectedCategory === 'My Snippets' ? (
					<UserSnippetsList />
				) : (
					<UserBookmarkedSnippetsList />
				)}
			</div>

			{/* Модальное окно настроек */}
			{isSettingsOpen && (
				<ProfileSettings onClose={() => setIsSettingsOpen(false)} user={user} />
			)}
		</section>
	);
};