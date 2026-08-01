export const SnippetSkeleton = () => {
	return (
		<div className='w-full h-80 bg-[#0b1220] border border-[#242c3b] rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between animate-pulse'>
			<div>
				{/* Шапка: Язык и Звезды */}
				<div className='flex items-center justify-between'>
					<div className='w-20 h-6 bg-[#1b2335] rounded-xl' />
					<div className='w-12 h-6 bg-[#1b2335] rounded-xl' />
				</div>

				{/* Заголовок и Описание */}
				<div className='mt-4 flex flex-col gap-2'>
					<div className='w-3/4 h-6 sm:h-7 bg-[#1b2335] rounded-lg' />
					<div className='w-full h-4 bg-[#1b2335] rounded-md mt-1' />
					<div className='w-2/3 h-4 bg-[#1b2335] rounded-md' />
				</div>
			</div>

			{/* Блок кода */}
			<div className='mt-3 w-full h-24 bg-[#141c2e] rounded-xl' />

			{/* Футер */}
			<div className='mt-2 pt-2 flex items-center justify-between'>
				<div className='w-24 h-6 bg-[#1b2335] rounded-lg' />
				<div className='w-20 h-8 bg-[#1b2335] rounded-xl' />
			</div>
		</div>
	);
};
