import { CommentSkeleton } from './CommentSkeleton';

export const SnippetPageSkeleton = () => {
	return (
		<div className='w-full mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-10 animate-pulse'>
			{/* Верхний макет: Код + Боковая панель */}
			<section className='flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-8'>
				{/* Левая часть (Хедер, Заголовок, Блок кода) */}
				<aside className='flex flex-1 flex-col min-w-0 w-full'>
					{/* Хедер страницы */}
					<div className='flex items-center gap-3 sm:gap-5 flex-wrap'>
						<div className='h-5 w-28 sm:w-32 bg-[#1e293b] rounded-md' />
						<div className='flex items-center gap-2'>
							<div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1e293b]' />
							<div className='h-4 w-32 sm:w-40 bg-[#1e293b] rounded-md' />
						</div>
					</div>

					{/* Заголовок и описание */}
					<div className='w-full flex flex-col mt-3 gap-3'>
						<div className='h-8 sm:h-9 w-3/4 sm:w-2/3 bg-[#1e293b] rounded-lg' />
						<div className='h-5 w-full max-w-xl bg-[#1e293b] rounded-md' />
					</div>

					{/* Блок кода */}
					<div className='mt-6 w-full'>
						<div className='w-full h-80 sm:h-96 bg-[#0f172a] rounded-2xl sm:rounded-3xl border border-[#1e2639] p-4 sm:p-5 flex flex-col gap-4'>
							<div className='flex justify-between items-center border-b border-[#1e2639] pb-4'>
								<div className='h-5 w-28 sm:w-36 bg-[#1e293b] rounded-md' />
								<div className='flex gap-2'>
									<div className='h-8 sm:h-9 w-16 sm:w-20 bg-[#1e293b] rounded-xl sm:rounded-2xl' />
									<div className='h-8 sm:h-9 w-16 sm:w-20 bg-[#1e293b] rounded-xl sm:rounded-2xl' />
								</div>
							</div>
							<div className='w-full flex-1 bg-[#090d16] rounded-xl sm:rounded-2xl p-4 space-y-3 overflow-hidden'>
								<div className='h-4 w-1/3 bg-[#1e293b] rounded' />
								<div className='h-4 w-2/3 bg-[#1e293b] rounded' />
								<div className='h-4 w-1/2 bg-[#1e293b] rounded' />
								<div className='h-4 w-3/4 bg-[#1e293b] rounded' />
								<div className='h-4 w-1/4 bg-[#1e293b] rounded' />
								<div className='h-4 w-1/3 bg-[#1e293b] rounded' />
							</div>
						</div>
					</div>
				</aside>

				{/* Правая часть / Сайдбар */}
				<aside className='w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4 sm:gap-5'>
					{/* Dependencies Skeleton */}
					<div className='p-4 sm:p-5 bg-[#0f172a] border border-[#1e2639] rounded-2xl sm:rounded-3xl flex flex-col gap-4'>
						<div className='flex justify-between items-center'>
							<div className='h-6 w-28 bg-[#1e293b] rounded-md' />
							<div className='h-5 w-20 bg-[#1e293b] rounded-md' />
						</div>
						<div className='h-14 sm:h-16 w-full bg-[#151c29] rounded-2xl' />
						<div className='h-14 sm:h-16 w-full bg-[#151c29] rounded-2xl' />
					</div>

					{/* Readme Skeleton */}
					<div className='p-4 sm:p-5 bg-[#0f172a] border border-[#1e2639] rounded-2xl sm:rounded-3xl flex flex-col gap-3'>
						<div className='h-6 w-24 bg-[#1e293b] rounded-md' />
						<div className='h-4 w-full bg-[#1e293b] rounded-md' />
						<div className='h-4 w-4/5 bg-[#1e293b] rounded-md' />
					</div>

					{/* Tags Skeleton */}
					<div className='p-4 sm:p-5 bg-[#0f172a] border border-[#1e2639] rounded-2xl sm:rounded-3xl flex flex-col gap-3'>
						<div className='h-6 w-32 bg-[#1e293b] rounded-md' />
						<div className='flex flex-wrap gap-2'>
							<div className='h-7 sm:h-8 w-16 bg-[#1e293b] rounded-3xl' />
							<div className='h-7 sm:h-8 w-20 bg-[#1e293b] rounded-3xl' />
							<div className='h-7 sm:h-8 w-24 bg-[#1e293b] rounded-3xl' />
						</div>
					</div>
				</aside>
			</section>

			{/* Секция комментариев */}
			<section className='mt-8 sm:mt-12 w-full'>
				<div className='h-7 w-36 bg-[#1e293b] rounded-md mb-2' />
				<div className='h-4 w-3/4 max-w-md bg-[#1e293b] rounded-md mb-6' />
				<CommentSkeleton />
			</section>
		</div>
	);
};
