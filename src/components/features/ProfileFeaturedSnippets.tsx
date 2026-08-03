import { Copy, Star, TrendingUp } from 'lucide-react';
import type { snippetCard } from './Showcase';
import { Link } from 'react-router-dom';

type Props = {
	featuredSnippets: snippetCard[] | null;
};

export const ProfileFeaturedSnippets = ({ featuredSnippets }: Props) => {
	return (
		<div className='flex flex-col h-full w-full justify-between gap-3 sm:gap-4'>
			{/* Заголовок */}
			<div className='flex items-center gap-2.5 sm:gap-3 shrink-0'>
				<div className='p-2 sm:p-2.5 bg-[#f8fafc05] border border-[#1e2533] rounded-xl sm:rounded-2xl text-[#aeb5c0]'>
					<TrendingUp className='w-5 h-5 sm:w-6 sm:h-6 text-[#2dd4bf]' />
				</div>
				<h2 className='text-xl sm:text-2xl lg:text-3xl text-white font-semibold truncate'>
					Featured Snippets
				</h2>
			</div>

			{/* Зажатый по высоте список с авто-скроллом */}
			<div className='flex-1 h-full overflow-y-auto pr-1 custom-scrollbar min-h-0'>
				<ul className='flex flex-col gap-3 sm:gap-3.5'>
					{featuredSnippets && featuredSnippets.length > 0 ? (
						featuredSnippets.map(snippet => (
							<li key={snippet.id}>
								<Link
									to={`/snippet/${snippet.id}`}
									className='group relative block w-full bg-[#080d1a]/90 hover:bg-[#0c1427] border border-[#172033] hover:border-[#2dd4bf]/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_0_rgba(45,212,191,0.12)] overflow-hidden'
								>
									{/* Мятный Glow */}
									<div className='absolute -right-12 -top-12 w-24 h-24 bg-[#2dd4bf]/10 rounded-full blur-2xl group-hover:bg-[#2dd4bf]/20 transition-all duration-500 pointer-events-none' />

									{/* ВЕРХ: Язык/Теги + Закрашенная звезда */}
									<div className='flex items-center justify-between gap-2 mb-2.5'>
										<div className='flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden'>
											{snippet.languages && (
												<span className='inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#111927] text-[#38bdf8] border border-[#1e293b] group-hover:border-[#38bdf8]/30 transition-colors shrink-0'>
													{snippet.languages.name}
												</span>
											)}

											{snippet.tags && snippet.tags.length > 0 && (
												<div className='hidden xs:flex items-center gap-1.5 overflow-hidden text-xs'>
													{snippet.tags.slice(0, 2).map((tag, idx) => (
														<span
															key={idx}
															className='text-[#64748b] font-mono truncate'
														>
															{tag}
														</span>
													))}
												</div>
											)}
										</div>

										<div className='flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-2 sm:px-2.5 py-1 rounded-lg bg-[#0e1726] border border-[#172033] text-slate-200 transition-colors shrink-0'>
											<span>{snippet.stars_count}</span>
											<Star
												size={14}
												className='text-[#facc15] fill-[#facc15]'
											/>
										</div>
									</div>

									{/* ЦЕНТР: Заголовок и Описание */}
									<div className='mb-3'>
										<h3 className='text-white font-bold text-base sm:text-lg group-hover:text-[#2dd4bf] transition-colors line-clamp-1 break-words'>
											{snippet.title}
										</h3>
										{snippet.description && (
											<p className='text-[#94a3b8] text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed font-normal break-words'>
												{snippet.description}
											</p>
										)}
									</div>

									{/* НИЗ: Автор и Копии */}
									<div className='flex items-center justify-between pt-2.5 border-t border-[#131c2e] text-xs text-[#64748b] gap-2'>
										{snippet.profiles ? (
											<div className='flex items-center gap-1.5 min-w-0'>
												<span className='text-[#94a3b8] text-xs sm:text-sm font-medium group-hover:text-slate-300 transition-colors truncate'>
													@{snippet.profiles.tag}
												</span>
											</div>
										) : (
											<span className='text-[#64748b] text-xs sm:text-sm shrink-0'>
												TakeCode
											</span>
										)}

										<div className='flex items-center gap-1.5 text-[#64748b] text-xs sm:text-sm group-hover:text-[#94a3b8] transition-colors shrink-0'>
											<Copy size={13} />
											<span>{snippet.copied_count || 0} copies</span>
										</div>
									</div>
								</Link>
							</li>
						))
					) : (
						<p className='text-[#64748b] text-sm mt-4'>
							No featured snippets available.
						</p>
					)}
				</ul>
			</div>
		</div>
	);
};