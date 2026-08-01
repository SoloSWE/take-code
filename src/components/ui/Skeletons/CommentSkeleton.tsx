export const CommentSkeleton = () => {
	return (
		<div className='w-full flex flex-col gap-4 animate-pulse'>
			{/* Карточка главного комментария */}
			<div className='w-full h-auto bg-[#0e1424]/60 border border-[#212839]/60 p-4 sm:px-5 sm:py-4 rounded-2xl sm:rounded-3xl flex flex-col gap-3'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						{/* Аватарка */}
						<div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e293b]' />
						{/* Никнейм */}
						<div className='h-4 w-24 bg-[#1e293b] rounded-md' />
					</div>
					{/* Дата */}
					<div className='h-3 w-16 sm:w-20 bg-[#1e293b] rounded-md' />
				</div>
				{/* Текст комментария */}
				<div className='space-y-2 mt-1'>
					<div className='h-3.5 w-3/4 bg-[#1e293b] rounded-md' />
					<div className='h-3.5 w-1/2 bg-[#1e293b] rounded-md' />
				</div>
			</div>

			{/* Вложенный ответ со сдвигом */}
			<div className='ml-3 sm:ml-8 pl-3 sm:pl-4 border-l-2 border-[#212839]/60'>
				<div className='w-full h-auto bg-[#090e1a]/60 border border-[#181f2f]/60 p-4 sm:px-5 sm:py-4 rounded-2xl sm:rounded-3xl flex flex-col gap-3'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e293b]' />
							<div className='h-4 w-20 bg-[#1e293b] rounded-md' />
						</div>
						<div className='h-3 w-16 bg-[#1e293b] rounded-md' />
					</div>
					<div className='h-3.5 w-2/3 bg-[#1e293b] rounded-md mt-1' />
				</div>
			</div>

			{/* Еще один главный комментарий */}
			<div className='w-full h-auto bg-[#0e1424]/60 border border-[#212839]/60 p-4 sm:px-5 sm:py-4 rounded-2xl sm:rounded-3xl flex flex-col gap-3'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e293b]' />
						<div className='h-4 w-28 bg-[#1e293b] rounded-md' />
					</div>
					<div className='h-3 w-20 bg-[#1e293b] rounded-md' />
				</div>
				<div className='h-3.5 w-4/5 bg-[#1e293b] rounded-md mt-1' />
			</div>
		</div>
	);
};
