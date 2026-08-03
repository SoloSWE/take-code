export const ProflieAboutLoader = () => {
	return (
		<div className='flex flex-col gap-4 sm:gap-5 w-full'>
			{/* Шапка */}
			<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
				<div className='w-20 h-20 sm:w-25 sm:h-25 shrink-0 bg-gray-800 animate-pulse rounded-2xl sm:rounded-3xl' />
				<div className='flex-1 w-full space-y-2'>
					<div className='w-32 sm:w-44 h-8 rounded-xl bg-gray-800 animate-pulse' />
					<div className='w-3/4 sm:w-64 h-5 rounded-xl bg-gray-800 animate-pulse' />
				</div>
			</div>

			{/* Описание */}
			<div className='space-y-2 mt-2'>
				<div className='w-full h-4 rounded-lg bg-gray-800 animate-pulse' />
				<div className='w-2/3 h-4 rounded-lg bg-gray-800 animate-pulse' />
			</div>

			{/* Соцсети */}
			<div className='flex items-center gap-2 sm:gap-3 flex-wrap mt-2'>
				{[...Array(3)].map((_, index) => (
					<div
						key={index}
						className='w-24 sm:w-28 h-8 rounded-2xl sm:rounded-3xl bg-gray-800 animate-pulse'
					/>
				))}
			</div>

			{/* Статистика */}
			<div className='w-full flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2'>
				<div className='w-full h-20 bg-gray-800 animate-pulse rounded-2xl p-4' />
				<div className='w-full h-20 bg-gray-800 animate-pulse rounded-2xl p-4' />
			</div>
		</div>
	);
};