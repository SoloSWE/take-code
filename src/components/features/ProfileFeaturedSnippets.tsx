import { Copy, Star, TrendingUp } from 'lucide-react';
import type { snippetCard } from './Showcase';
import { Link } from 'react-router-dom';

type Props = {
	featuredSnippets: snippetCard[] | null;
};

export const ProfileFeaturedSnippets = ({ featuredSnippets }: Props) => {
	return (
		<div className='flex flex-col w-full gap-4 flex-1 h-full'>
			{/* Заголовок */}
			<div className='flex items-center gap-3 shrink-0'>
				<div className='p-2.5 bg-[#f8fafc05] border border-[#1e2533] rounded-2xl text-[#aeb5c0]'>
					<TrendingUp className='w-6 h-6 text-[#2dd4bf]' />
				</div>
				<h2 className='text-2xl lg:text-3xl text-white font-semibold'>
					Featured Snippets
				</h2>
			</div>

			{/* Контейнер списка с прокруткой */}
			<div className='overflow-y-auto pr-1 custom-scrollbar flex-1'>
				{featuredSnippets && featuredSnippets.length > 0 ? (
					<ul className='flex flex-col gap-3.5 h-full'>
						{featuredSnippets.map(snippet => (
							<li key={snippet.id} className='flex-1'>
								<Link
									to={`/snippet/${snippet.id}`}
									className='group relative flex flex-col justify-between h-full w-full bg-[#080d1a]/90 hover:bg-[#0c1427] border border-[#172033] hover:border-[#2dd4bf]/40 rounded-2xl p-4 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_0_rgba(45,212,191,0.12)] overflow-hidden'
								>
									{/* Мятный Glow */}
									<div className='absolute -right-12 -top-12 w-24 h-24 bg-[#2dd4bf]/10 rounded-full blur-2xl group-hover:bg-[#2dd4bf]/20 transition-all duration-500 pointer-events-none' />

									<div>
										{/* ВЕРХ: Язык/Теги + Звезда */}
										<div className='flex items-center justify-between gap-2 mb-2.5'>
											<div className='flex items-center gap-1.5 overflow-hidden min-w-0'>
												{snippet.languages && (
													<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#111927] text-[#38bdf8] border border-[#1e293b] group-hover:border-[#38bdf8]/30 transition-colors shrink-0'>
														{snippet.languages.name}
													</span>
												)}

												{snippet.tags && snippet.tags.length > 0 && (
													<span className='text-[#64748b] font-mono text-xs truncate max-w-[70px]'>
														{snippet.tags[0]}
													</span>
												)}
											</div>

											<div className='flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-[#0e1726] border border-[#172033] text-slate-200 transition-colors shrink-0'>
												<span>{snippet.stars_count}</span>
												<Star
													size={12}
													className='text-[#facc15] fill-[#facc15]'
												/>
											</div>
										</div>

										{/* ЦЕНТР: Заголовок и Описание */}
										<div className='mb-3'>
											<h3 className='text-white font-bold text-base group-hover:text-[#2dd4bf] transition-colors line-clamp-1 break-words'>
												{snippet.title}
											</h3>
											{snippet.description && (
												<p className='text-[#94a3b8] text-xs mt-1 line-clamp-2 leading-relaxed font-normal break-words'>
													{snippet.description}
												</p>
											)}
										</div>
									</div>

									{/* НИЗ: Автор и Копии */}
									<div className='flex items-center justify-between pt-2.5 border-t border-[#131c2e] text-xs text-[#64748b] gap-2 mt-auto'>
										{snippet.profiles ? (
											<span className='text-[#94a3b8] text-xs font-medium group-hover:text-slate-300 transition-colors truncate'>
												@{snippet.profiles.tag}
											</span>
										) : (
											<span className='text-[#64748b] text-xs shrink-0'>
												TakeCode
											</span>
										)}

										<div className='flex items-center gap-1 text-[#64748b] text-xs group-hover:text-[#94a3b8] transition-colors shrink-0'>
											<Copy size={12} />
											<span>{snippet.copied_count || 0} copies</span>
										</div>
									</div>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<div className='flex items-center justify-center h-full text-[#64748b] text-sm'>
						No featured snippets available.
					</div>
				)}
			</div>
		</div>
	);
};