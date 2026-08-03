import { UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { UserProfile } from '../../pages/Profile';
import { supabase } from '../../utils/supabase';

type AuthorWithStats = UserProfile & {
	snippetsCount: number;
	totalCopies: number;
};

export const TrendingActivites = () => {
	const [authors, setAuthors] = useState<AuthorWithStats[]>([]);
	const [totalCopies, setTotalCopies] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchTotals = async () => {
			try {
				setLoading(true);

				// 1. Запрашиваем профили вместе со списками ID и copied_count их сниппетов
				const { data: profilesData, error: profilesError } = await supabase
					.from('profiles')
					.select('*, snippets(id, copied_count)');

				if (profilesError) throw profilesError;

				if (profilesData) {
					// Форматируем данные: считаем количество сниппетов и общие копии
					const formattedAuthors: AuthorWithStats[] = profilesData.map(
						author => {
							const snippets = Array.isArray(author.snippets)
								? author.snippets
								: [];

							const snippetsCount = snippets.length;
							const totalCopies = snippets.reduce(
								(sum: number, snip: { copied_count?: number }) =>
									sum + (snip.copied_count || 0),
								0,
							);

							return {
								...author,
								snippetsCount,
								totalCopies,
							};
						},
					);

					// 2. СОРТИРОВКА: от большего количества сниппетов к меньшему
					formattedAuthors.sort((a, b) => b.snippetsCount - a.snippetsCount);

					// Берём ТОП-3
					setAuthors(formattedAuthors.slice(0, 3));
				}

				// 3. Общее кол-во копий по всей платформе
				const { data: snippetsData } = await supabase
					.from('snippets')
					.select('copied_count');

				if (snippetsData) {
					const allCopiesSum = snippetsData.reduce(
						(sum, snippet) => sum + (snippet.copied_count || 0),
						0,
					);
					setTotalCopies(allCopiesSum);
				}
			} catch (error) {
				console.error('Error fetching statistics:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchTotals();
	}, []);

	return (
		<section className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 mb-12 sm:mb-16 lg:mb-20'>
			<div className='flex flex-col lg:flex-row gap-4 sm:gap-6 w-full h-auto bg-[#101a2e] border border-[#222c41] rounded-3xl sm:rounded-4xl p-3.5 sm:p-4.5'>
				{/* Левая карточка с описанием */}
				<div className='w-full lg:w-1/2 h-auto bg-[#0b1225] border border-[#1c2538] rounded-2xl sm:rounded-3xl flex flex-col justify-between gap-6 p-5 sm:p-8'>
					<div className='flex flex-col items-start gap-4'>
						<span className='flex items-center gap-2 max-w-max h-auto rounded-3xl bg-[#34d3992e] border border-[#34d39952] text-[#A7F3D0] font-bold text-sm sm:text-base lg:text-lg px-3.5 py-1 sm:px-4 sm:py-1.5'>
							<UsersIcon
								className='shrink-0 w-4 h-4 sm:w-5 sm:h-5'
								color='#34D399'
							/>
							<span>Built by developers</span>
						</span>

						<div className='mt-2'>
							<h2 className='text-white font-semibold text-3xl sm:text-4xl lg:text-5xl text-left leading-tight'>
								A living library that gets sharper every day.
							</h2>

							<p className='text-[#94A3B8] text-left font-normal text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 leading-relaxed'>
								Follow trusted authors, save implementation notes, and watch
								high-signal snippets trend across the TakeCode community.
							</p>
						</div>
					</div>

					{/* Статистика */}
					<div className='flex items-center gap-6 sm:gap-8 mt-2 pt-4 border-t border-[#1c2538]/60'>
						<div>
							<p className='font-bold text-[#38bdf8] text-2xl sm:text-3xl'>
								{authors.length.toLocaleString()}
							</p>
							<span className='text-[#94a3b8] text-xs sm:text-sm lg:text-base font-medium'>
								top authors
							</span>
						</div>
						<div>
							<p className='font-bold text-[#34d399] text-2xl sm:text-3xl'>
								{totalCopies.toLocaleString()}
							</p>
							<span className='text-[#94a3b8] text-xs sm:text-sm lg:text-base font-medium'>
								copies
							</span>
						</div>
					</div>
				</div>

				{/* Правая карточка со списком авторов */}
				<div className='w-full lg:w-1/2 h-auto bg-[#070d1e] border border-[#192031] rounded-2xl sm:rounded-3xl lg:rounded-4xl p-5 sm:p-8 flex flex-col justify-between'>
					<div>
						<h3 className='text-white font-bold text-xl sm:text-2xl'>
							Most Active Authors
						</h3>

						{loading ? (
							<div className='mt-4 space-y-3'>
								<div className='w-full h-16 sm:h-18 bg-[#111626] rounded-2xl sm:rounded-3xl animate-pulse' />
								<div className='w-full h-16 sm:h-18 bg-[#111626] rounded-2xl sm:rounded-3xl animate-pulse' />
								<div className='w-full h-16 sm:h-18 bg-[#111626] rounded-2xl sm:rounded-3xl animate-pulse' />
							</div>
						) : (
							<ul className='flex flex-col gap-3 mt-4'>
								{authors.map(author => (
									<li
										key={author.id}
										className='flex items-center justify-between gap-3 w-full p-3 sm:p-3.5 bg-[#111626] border border-[#1e2535] rounded-2xl sm:rounded-3xl hover:border-[#2a344a] transition-all'
									>
										<div className='flex items-center gap-3 min-w-0'>
											<img
												className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shrink-0'
												src={author.avatar_url || '/default-avatar.png'}
												alt={author.display_name}
											/>
											<div className='min-w-0 flex-1'>
												<h4 className='text-white font-bold text-sm sm:text-base lg:text-lg truncate'>
													{author.display_name}
												</h4>
												<p className='text-[#94a3aa] text-xs sm:text-sm font-medium truncate'>
													{author.speciality || 'Developer'}
												</p>
											</div>
										</div>

										<div className='flex flex-col items-end shrink-0'>
											<span className='text-sm sm:text-base lg:text-lg text-[#38bdf8] font-bold'>
												{author.snippetsCount}{' '}
												<span className='hidden sm:inline'>
													{author.snippetsCount === 1 ? 'snippet' : 'snippets'}
												</span>
											</span>
											<span className='text-xs sm:text-sm text-[#64748b] font-medium'>
												{author.totalCopies} copies
											</span>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};