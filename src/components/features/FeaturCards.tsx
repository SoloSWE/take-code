import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Code2, Star, Verified, Zap } from 'lucide-react';

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const cardVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: 'easeOut',
		},
	},
};

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

export const FeaturCards = () => {
	return (
		<motion.div
			className='flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 w-full'
			variants={containerVariants}
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true, margin: '-50px' }}
		>
			{/* ЛЕВАЯ КАРТОЧКА */}
			<motion.div
				className='w-full lg:w-1/3 flex flex-col bg-linear-to-b from-[#111c31f5] to-[#0b1220f5] rounded-3xl border border-[#94a3b83e] p-5 sm:p-6 transition-colors duration-300 ease-in-out hover:border-[#9fafc53e] hover:ring-1 hover:ring-[#9fafc53e]'
				variants={cardVariants}
			>
				<div>
					<div className='flex items-center justify-center w-12 h-12 sm:w-15 sm:h-15 bg-[#38bff825] border border-[#38bff87a] rounded-2xl'>
						<Code2 className='w-6 h-6 sm:w-7 sm:h-7' color='#38BDF8' />
					</div>
					<div className='mt-6 sm:mt-8'>
						<ul className='flex flex-wrap items-center gap-2'>
							{supportedLanguages.map(language => (
								<li
									key={language.id}
									className='px-2.5 py-1 sm:px-3 sm:py-1.5 border rounded-3xl flex items-center justify-center gap-2'
									style={{
										backgroundColor: language.bg,
										borderColor: language.borderColor,
									}}
								>
									<p
										className='text-xs sm:text-sm font-bold'
										style={{ color: language.color }}
									>
										{language.name}
									</p>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className='mt-6'>
					<h3 className='text-white font-bold text-xl sm:text-2xl lg:text-3xl'>
						Multi-language by default
					</h3>
					<p className='text-[#94A3B8] font-normal text-sm sm:text-base lg:text-lg mt-2 leading-relaxed'>
						Discover snippets across frontend, backend, infra, data, and systems
						code—without forcing language silos.
					</p>
				</div>
			</motion.div>

			{/* ПРАВАЯ КОЛОНКА */}
			<div className='w-full lg:w-2/3 flex flex-col justify-between gap-4 sm:gap-6'>
				{/* Верхний ряд */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1'>
					{/* Verified patterns */}
					<motion.div
						variants={cardVariants}
						className='bg-[#111c31f5] rounded-3xl border border-[#94a3b83e] p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 ease-in-out hover:border-[#42454e] hover:ring-1 hover:ring-[#42454e]'
					>
						<div className='flex items-center justify-center w-12 h-12 sm:w-15 sm:h-15 bg-[#142e3b] border border-[#1b5250] rounded-2xl'>
							<Verified className='w-6 h-6 sm:w-7 sm:h-7' color='#34d399' />
						</div>
						<div className='mt-6'>
							<h3 className='text-white font-bold text-lg sm:text-xl lg:text-2xl'>
								Verified patterns
							</h3>
							<p className='text-[#94A3B8] font-normal text-sm sm:text-base lg:text-lg mt-2 leading-relaxed'>
								Human-reviewed snippets highlight dependencies, edge cases, and
								safe defaults.
							</p>
						</div>
					</motion.div>

					{/* Copy in one tap */}
					<motion.div
						variants={cardVariants}
						className='bg-[#111c31f5] rounded-3xl border border-[#94a3b83e] p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 ease-in-out hover:border-[#42454e] hover:ring-1 hover:ring-[#42454e]'
					>
						<div className='flex items-center justify-center w-12 h-12 sm:w-15 sm:h-15 bg-[#152b44] border border-[#1c4c6b] rounded-2xl'>
							<Zap className='w-6 h-6 sm:w-7 sm:h-7' color='#38bdf8' />
						</div>
						<div className='mt-6'>
							<h3 className='text-white font-bold text-lg sm:text-xl lg:text-2xl'>
								Copy in one tap
							</h3>
							<p className='text-[#94A3B8] font-normal text-sm sm:text-base lg:text-lg mt-2 leading-relaxed'>
								Clear copy buttons, formatted code, and metadata make reuse feel
								instant.
							</p>
						</div>
					</motion.div>
				</div>

				{/* Нижняя широкая карточка */}
				<motion.div
					variants={cardVariants}
					className='bg-linear-to-b from-[#38bdf821] to-[#34d3991a] rounded-3xl border border-[#94a3b83e] p-5 sm:p-6 flex flex-col justify-between transition-colors duration-300 ease-in-out hover:border-[#42454e] hover:ring-1 hover:ring-[#42454e]'
				>
					<div className='flex items-center justify-between'>
						<div className='flex items-center justify-center w-12 h-12 sm:w-15 sm:h-15 bg-[#253d52] border border-[#475b6e] rounded-2xl'>
							<Star className='w-6 h-6 sm:w-7 sm:h-7' color='#fde68a' />
						</div>
						<p className='text-[#d9f99d] font-bold text-sm sm:text-base lg:text-lg'>
							98% useful
						</p>
					</div>
					<div className='mt-6'>
						<h3 className='text-white font-bold text-xl sm:text-2xl lg:text-3xl'>
							Community signal, not vanity metrics
						</h3>
						<p className='text-[#94A3B8] font-normal text-sm sm:text-base lg:text-lg mt-2 leading-relaxed'>
							Upvotes, saves, and implementation notes help the best snippets
							rise before you paste them into production.
						</p>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};