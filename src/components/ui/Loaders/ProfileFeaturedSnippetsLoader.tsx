export const ProfileFeaturedSnippetsLoader = () => {
	return (
		<div className='flex flex-col h-full w-full justify-between gap-4'>
			{/* Заголовок */}
			<div className='flex items-center gap-3 shrink-0'>
				<div className='w-10 h-10 sm:w-11 sm:h-11 bg-gray-800 animate-pulse rounded-xl sm:rounded-2xl shrink-0' />
				<div className='w-40 sm:w-56 h-7 sm:h-8 bg-gray-800 animate-pulse rounded-xl' />
			</div>

			{/* Карточки скелетона */}
			<div className='flex-1 flex flex-col gap-3 sm:gap-3.5 mt-2 overflow-hidden'>
				{[...Array(2)].map((_, index) => (
					<div
						key={index}
						className='w-full bg-gray-800/80 animate-pulse rounded-xl sm:rounded-2xl p-4 flex flex-col justify-between gap-3 min-h-[120px]'
					>
						<div className='flex justify-between items-center gap-2'>
							<div className='w-20 h-5 bg-gray-700/80 rounded-lg' />
							<div className='w-12 h-5 bg-gray-700/80 rounded-lg' />
						</div>
						<div className='space-y-2'>
							<div className='w-3/4 h-5 bg-gray-700/80 rounded-md' />
							<div className='w-1/2 h-4 bg-gray-700/80 rounded-md' />
						</div>
						<div className='pt-2 border-t border-gray-700/40 flex justify-between items-center'>
							<div className='w-16 h-4 bg-gray-700/80 rounded-md' />
							<div className='w-20 h-4 bg-gray-700/80 rounded-md' />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};