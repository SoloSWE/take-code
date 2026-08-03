import { Code2, Star, Verified, Zap } from 'lucide-react';

export const Features = () => {
	const supportedLanguages = [
		{
			id: 1,
			name: 'JavaScript',
			color: '#BAE6FD',
			bg: '#38bff824',
			borderColor: '#38bff842',
		},
		{
			id: 2,
			name: 'Python',
			color: '#A7F3D0',
			bg: '#34d3992e',
			borderColor: '#34d39952',
		},
		{
			id: 3,
			name: 'Rust',
			color: '#FDE68A',
			bg: '#282a2c',
			borderColor: '#4e442a',
		},
		{
			id: 4,
			name: '+42 More',
			color: '#cbd5e1',
			bg: '#1a2437',
			borderColor: '#313b4e',
		},
	];

	return (
		<section className='mt-35 flex items-center justify-center flex-col'>
			<h2 className='text-white font-extrabold text-6xl text-center'>
				Find battle-tested code <br /> without the noise.
			</h2>

			<p className='text-[#94A3B8] text-center font-normal text-lg mt-2.5'>
				TakeCode keeps reusable snippets organized, verified, and instantly{' '}
				<br />
				copyable so teams can skip boilerplate and focus on shipping.
			</p>

			{/* <div className='grid grid-cols-3 grid-rows-2 gap-4 m-15 max-xl:grid-cols-1 max-xl:grid-rows-4'>
				
				<div className='row-span-2 w-auto h-auto bg-linear-to-b from-[#111c31f5] to-[#0b1220f5] rounded-3xl border border-[#94a3b83e] px-6 py-6 max-xl:h-auto max-xl:col-span-2 max-xl:col-start-1 max-xl:row-span-1 max-xl:row-start-1 max-md:col-span-3'>
					<div className='max-xl:flex items-center justify-between'>
						<div className='flex items-center justify-center w-15 h-15 bg-[#38bff825] border border-[#38bff87a] rounded-2xl max-xl:w-13 max-xl:h-13'>
							<Code2 className='scale-130 max-xl:scale-110' color='#38BDF8' />
						</div>
						<div className='mt-8 max-xl:-mt-4'>
							<ul className='flex flex-wrap items-center gap-2'>
								{supportedLanguages.map(language => (
									<li
										key={language.id}
										className='w-auto h-auto px-3 py-1.5 border rounded-3xl flex items-center justify-center gap-2 max-xl:-mt-2'
										style={{
											backgroundColor: `${language.bg}`,
											borderColor: `${language.borderColor}`,
										}}
									>
										<p
											className='text-[16px] font-bold max-xl:text-sm'
											style={{
												color: `${language.color}`,
											}}
										>
											{language.name}
										</p>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div>
						<h3 className='text-white font-bold text-3xl mt-6 max-xl:text-2xl'>
							Multi-language by default
						</h3>
						<p className='text-[#94A3B8] font-normal text-xl mt-2 max-xl:text-[16px]'>
							Discover snippets across frontend, backend, infra, data, and
							systems code—without forcing language silos.
						</p>
					</div>
				</div>
				<div className='rounded-3xl border border-[#94a3b83e] bg-[#111c31f5] px-6 py-6 max-lg:row-start-3'>
					<div className='flex items-center justify-center w-15 h-15 bg-[#142e3b] border border-[#1b5250] rounded-2xl'>
						<Verified size={30} color='#34d399' />
					</div>
					<div>
						<h3 className='text-white font-bold text-2xl mt-4 max-xl:text-xl'>
							Verified patterns
						</h3>
						<p className='text-[#94A3B8] font-normal text-xl mt-2 max-xl:text-[18px]'>
							Human-reviewed snippets highlight dependencies, edge cases, and
							safe defaults.
						</p>
					</div>
				</div>
				<div className='rounded-3xl border border-[#94a3b83e] bg-[#111c31f5] px-6 py-6 max-xl:row-start-2'>
					<div className='flex items-center justify-center w-15 h-15 bg-[#152b44] border border-[#1c4c6b] rounded-2xl'>
						<Zap size={30} color='#38bdf8' />
					</div>
					<div>
						<h3 className='text-white font-bold text-2xl mt-4 max-xl:text-xl'>
							Copy in one tap
						</h3>
						<p className='text-[#94A3B8] font-normal text-xl mt-2 max-xl:text-[18px]'>
							Clear copy buttons, formatted code, and metadata make reuse feel
							instant.
						</p>
					</div>
				</div>
				<div className='col-span-2 col-start-2 bg-linear-to-br from-[#38bdf821] to-[#34d3991a] rounded-3xl border border-[#94a3b83e] px-6 py-6 max-xl:col-span-2 max-xl:col-start-1 max-xl:row-start-4 max-xl:h-auto'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center justify-center w-15 h-15 bg-[#253d52] border border-[#475b6e] rounded-2xl max-xl:w-13 max-xl:h-13'>
							<Star className='scale-130 max-xl:scale-110' color='#fde68a' />
						</div>
						<p className='text-[#d9f99d] font-bold text-xl max-xl:text-[16px]'>
							98% useful
						</p>
					</div>
					<div>
						<h3 className='text-white font-bold text-3xl mt-4 max-xl:text-2xl'>
							Community signal, not vanity metrics
						</h3>
						<p className='text-[#94A3B8] font-normal text-[18px] mt-2 max-xl:text-[16px]'>
							Upvotes, saves, and implementation notes help the best snippets
							rise before you paste them into production.
						</p>
					</div>
				</div>
			</div> */}

			{/* 1. Главный контейнер (items-stretch заставляет левую и правую часть быть одной высоты) */}
			<div className='flex flex-col lg:flex-row items-stretch gap-6 mt-15   mx-10'>
				{/* ЛЕВАЯ КАРТОЧКА (Растягивается на всю высоту соседа) */}
				<div className='w-full lg:w-1/3 flex flex-col bg-linear-to-b from-[#111c31f5] to-[#0b1220f5] rounded-3xl border border-[#94a3b83e] px-6 py-6 transition-all duration-300 ease-in-out hover:border-[#42454e] hover:ring-[#42454e]'>
					{/* Твой контент (иконка, языки, текст) */}
					<div className='flex items-center justify-center w-15 h-15 bg-[#38bff825] border border-[#38bff87a] rounded-2xl max-xl:w-13 max-xl:h-13'>
						<Code2 className='scale-130 max-xl:scale-110' color='#38BDF8' />
					</div>
					<div className='mt-8'>
						<ul className='flex flex-wrap items-center gap-2'>
							{supportedLanguages.map(language => (
								<li
									key={language.id}
									className='w-auto h-auto px-3 py-1.5 border rounded-3xl flex items-center justify-center gap-2'
									style={{
										backgroundColor: `${language.bg}`,
										borderColor: `${language.borderColor}`,
									}}
								>
									<p
										className='text-[16px] font-bold max-xl:text-sm'
										style={{
											color: `${language.color}`,
										}}
									>
										{language.name}
									</p>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className='text-white font-bold text-3xl mt-6 max-xl:text-2xl'>
							Multi-language by default
						</h3>
						<p className='text-[#94A3B8] font-normal text-xl mt-2 max-xl:text-[16px]'>
							Discover snippets across frontend, backend, infra, data, and
							systems code—without forcing language silos.
						</p>
					</div>
				</div>

				{/* ПРАВАЯ КОЛОНКА (justify-between расталкивает ряды по краям) */}
				<div className='w-full lg:w-2/3 flex flex-col justify-between gap-6'>
					{/* Верхний ряд ( grid-cols-1 sm:grid-cols-2 ) */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1'>
						{/* Verified patterns (flex-1 заставит их быть ровными) */}
						<div className='bg-[#111c31f5] rounded-3xl border border-[#94a3b83e] px-6 py-6 flex flex-col justify-between flex-1 transition-all duration-300 ease-in-out hover:border-[#42454e] hover:ring-[#42454e]'>
							{/* Контент */}
							<div className='flex items-center justify-center w-15 h-15 bg-[#142e3b] border border-[#1b5250] rounded-2xl'>
								<Verified size={30} color='#34d399' />
							</div>
							<div>
								<h3 className='text-white font-bold text-2xl mt-4 max-xl:text-xl'>
									Verified patterns
								</h3>
								<p className='text-[#94A3B8] font-normal text-xl mt-2 max-xl:text-[18px]'>
									Human-reviewed snippets highlight dependencies, edge cases,
									and safe defaults.
								</p>
							</div>
						</div>

						{/* Copy in one tap */}
						<div className='bg-[#111c31f5] rounded-3xl border border-[#94a3b83e] px-6 py-6 flex flex-col justify-between flex-1 transition-all duration-300 ease-in-out hover:border-[#42454e] hover:ring-[#42454e]'>
							{/* Контент */}
							<div className='flex items-center justify-center w-15 h-15 bg-[#152b44] border border-[#1c4c6b] rounded-2xl'>
								<Zap size={30} color='#38bdf8' />
							</div>
							<div>
								<h3 className='text-white font-bold text-2xl mt-4 max-xl:text-xl'>
									Copy in one tap
								</h3>
								<p className='text-[#94A3B8] font-normal text-xl mt-2 max-xl:text-[18px]'>
									Clear copy buttons, formatted code, and metadata make reuse
									feel instant.
								</p>
							</div>
						</div>
					</div>

					{/* Нижняя длинная карточка (Community signal) */}
					<div className='bg-linear-to-br from-[#38bdf821] to-[#34d3991a] rounded-3xl border border-[#94a3b83e] px-6 py-6 flex flex-col justify-between transition-all duration-300 ease-in-out hover:border-[#42454e] hover:ring-[#42454e]'>
						{/* Контент */}
						<div className='flex items-center justify-between'>
							<div className='flex items-center justify-center w-15 h-15 bg-[#253d52] border border-[#475b6e] rounded-2xl max-xl:w-13 max-xl:h-13'>
								<Star className='scale-130 max-xl:scale-110' color='#fde68a' />
							</div>
							<p className='text-[#d9f99d] font-bold text-xl max-xl:text-[16px]'>
								98% useful
							</p>
						</div>
						<div>
							<h3 className='text-white font-bold text-3xl mt-4 max-xl:text-2xl'>
								Community signal, not vanity metrics
							</h3>
							<p className='text-[#94A3B8] font-normal text-[18px] mt-2 max-xl:text-[16px]'>
								Upvotes, saves, and implementation notes help the best snippets
								rise before you paste them into production.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
