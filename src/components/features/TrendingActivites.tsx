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

							const snippetsCount = snippets.length; // Кол-во сниппетов
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

					// 2. СОРТИРОВКА: от большего количества сниппетов к меньшему (b - a)
					formattedAuthors.sort((a, b) => b.snippetsCount - a.snippetsCount);

					// Берём ТОП-3 (или ТОП-5, по вашему желанию)
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
		<section className='w-full   mx-auto px-4 py-5 mb-20'>
			<div className='flex gap-4 w-full h-auto bg-[#101a2e] border border-[#222c41] rounded-4xl px-4.5 py-4.5 max-[965px]:flex-col'>
				<div className='w-1/2 h-auto bg-[#0b1225] border border-[#1c2538] rounded-3xl flex flex-col gap-4 px-8 py-8 max-[965px]:w-full'>
					<span className='flex items-center justify-center gap-2 max-w-60 h-auto rounded-3xl bg-[#34d3992e] border border-[#34d39952] text-[#A7F3D0] font-bold text-lg px-4 py-1 max-[460px]:py-2 max-[321px]:text-[15px]'>
						<UsersIcon
							className='max-[321px]:hidden'
							color='#34D399'
							size={20}
						/>
						Built by developers
					</span>

					<div className='mt-4'>
						<h2 className='text-white font-semibold text-5xl text-left max-md:text-4xl'>
							A living library that gets <br /> sharper every day.
						</h2>

						<p className='text-[#94A3B8] text-left font-normal text-lg mt-4 max-w-2xl max-md:text-[16px]'>
							Follow trusted authors, save implementation notes, and watch
							high-signal snippets trend across the TakeCode community.
						</p>
					</div>

					<div className='flex items-center gap-5 mt-4 max-md:mt-2'>
						<div>
							<p className='font-bold text-[#38bdf8] text-3xl'>
								{authors.length.toLocaleString()}
							</p>
							<span className='text-[#94a3b8] text-[17px]'>top authors</span>
						</div>
						<div>
							<p className='font-bold text-[#34d399] text-3xl'>
								{totalCopies.toLocaleString()}
							</p>
							<span className='text-[#94a3b8] text-[17px]'>copies</span>
						</div>
					</div>
				</div>

				<div className='w-1/2 h-auto bg-[#070d1e] border border-[#192031] rounded-4xl px-8 py-8 max-[965px]:w-full'>
					<h4 className='text-white font-bold text-2xl'>Most Active Authors</h4>

					{loading ? (
						<div className='mt-4 space-y-3'>
							<div className='w-full h-18 bg-[#111626] rounded-3xl animate-pulse' />
							<div className='w-full h-18 bg-[#111626] rounded-3xl animate-pulse' />
						</div>
					) : (
						<ul className='flex flex-col gap-3 mt-2'>
							{authors.map(author => (
								<li
									key={author.id}
									className='flex items-center justify-between w-full h-auto px-3.5 py-3.5 bg-[#111626] border border-[#1e2535] rounded-3xl'
								>
									<div className='flex items-center gap-3'>
										<img
											className='w-12 h-12 rounded-3xl object-cover'
											src={author.avatar_url || '/default-avatar.png'}
											alt={author.display_name}
										/>
										<div>
											<h4 className='text-white font-bold text-xl max-md:text-[16px]'>
												{author.display_name}
											</h4>
											<p className='text-[#94a3aa] font-medium max-md:text-[15px] max-sm:hidden'>
												{author.speciality || 'Developer'}
											</p>
										</div>
									</div>

									{/* Выводим количество сниппетов */}
									<div className='flex flex-col items-end'>
										<span className='text-xl text-[#38bdf8] font-bold max-sm:text-[16px]'>
											{author.snippetsCount}{' '}
											{author.snippetsCount === 1 ? 'snippet' : 'snippets'}
										</span>
										<span className='text-sm text-[#64748b] font-medium'>
											{author.totalCopies} copies
										</span>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</section>
	);
};
