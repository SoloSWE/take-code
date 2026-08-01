import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { UsersIcon } from 'lucide-react';


export const TrendingActivites = () => {
	const [totalAuthors, setTotalAuthors] = useState<number>(0);
	const [totalCopies, setTotalCopies] = useState<number>(0);

	useEffect(() => {
		const fetchTotals = async () => {
			try {
				const [{ count: authorsCount }, { data: copiesCount }] = await Promise.all([
					supabase.from('profiles').select('*', { count: 'exact' }),
					supabase.from('snippets').select('*, copied_count', { count: 'exact' }),
				]);

				setTotalAuthors(authorsCount || 0);
				setTotalCopies(copiesCount?.reduce((acc, snippet) => acc + (snippet.copied_count || 0), 0) || 0);
			} catch (error) {
				console.error('Error fetching total authors:', error);
				console.error('Error fetching total copies:', error);
			}
		};

		fetchTotals();
	}, []);

	return (
		<section className='w-full max-w-7xl mx-auto px-4 py-5 mb-20'>
			<div className='flex gap-4 w-full h-auto bg-[#101a2e] border border-[#222c41] rounded-4xl px-4.5 py-4.5 max-[965px]:flex-col'>
				<div className='w-1/2 h-auto bg-[#0b1225] border border-[#1c2538] rounded-3xl flex flex-col gap-4 px-8 py-8 max-[965px]:w-full'>
					<span className='flex items-center justify-center gap-2 max-w-60 h-auto rounded-3xl bg-[#34d3992e] border border-[#34d39952] text-[#A7F3D0] font-bold text-lg px-4 py-1 max-[460px]:py-2 max-[321px]:text-[15px]'>
						<UsersIcon className='max-[321px]:hidden' color='#34D399' size={20} />
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
							<p className='font-bold text-[#38bdf8] text-3xl'>{totalAuthors.toLocaleString()}</p>
							<span className='text-[#94a3b8] text-[17px]'>authors</span>
						</div>
						<div>
							<p className='font-bold text-[#34d399] text-3xl'>{totalCopies.toLocaleString()}</p>
							<span className='text-[#94a3b8] text-[17px]'>copies</span>
						</div>
					</div>
				</div>
				<div className='w-1/2 h-auto bg-[#070d1e] border border-[#192031] rounded-4xl px-8 py-8 max-[965px]:w-full'>
					<h4 className='text-white font-bold text-2xl'>Trending this week</h4>
					<div className='flex flex-col gap-3'>
						<div className='flex items-center justify-between w-full h-auto px-3.5 py-3.5 mt-4 bg-[#111626] border border-[#1e2535] rounded-3xl'>
							<div className='flex items-center gap-3'>
								<div className='flex items-center justify-center w-12 h-12 rounded-3xl bg-linear-to-br from-[#38bdf8] to-[#6366f1] max-[321px]:hidden'>
									<span className='text-white text-xl font-bold'>S</span>
								</div>
								<div>
									<h4 className='text-white font-bold text-xl max-md:text-[16px]'>Solo SWE</h4>
									<p className='text-[#94a3aa] font-medium max-md:text-[15px] max-sm:hidden'>
										Work smarter, not harder
									</p>
								</div>
							</div>
							<span className='text-xl text-[#a7f3d0] font-bold max-sm:text-[16px]'>+328</span>
						</div>

						<div className='flex items-center justify-between w-full h-auto px-3.5 py-3.5 mt-2 bg-[#111626] border border-[#1e2535] rounded-3xl'>
							<div className='flex items-center gap-3'>
								<div className='flex items-center justify-center w-12 h-12 rounded-3xl bg-linear-to-br from-[#38bdf8] to-[#6366f1] max-[321px]:hidden'>
									<span className='text-white text-xl font-bold'>S</span>
								</div>
								<div>
									<h4 className='text-white font-bold text-xl max-md:text-[16px]'>TS Love</h4>
									<p className='text-[#94a3aa] font-medium max-md:text-[15px] max-sm:hidden'>TypeScript love</p>
								</div>
							</div>
							<span className='text-xl text-[#a7f3d0] font-bold max-sm:text-[16px]'>+217</span>
						</div>

						<div className='flex items-center justify-between w-full h-auto px-3.5 py-3.5 mt-2 bg-[#111626] border border-[#1e2535] rounded-3xl'>
							<div className='flex items-center gap-3'>
								<div className='flex items-center justify-center w-12 h-12 rounded-3xl bg-linear-to-br from-[#38bdf8] to-[#6366f1] max-[321px]:hidden'>
									<span className='text-white text-xl font-bold'>S</span>
								</div>
								<div>
									<h4 className='text-white font-bold text-xl max-md:text-[16px]'>JS Love</h4>
									<p className='text-[#94a3aa] font-medium max-md:text-[15px] max-sm:hidden'>JavaScript love</p>
								</div>
							</div>
							<span className='text-xl text-[#a7f3d0] font-bold max-sm:text-[16px]'>+155</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};