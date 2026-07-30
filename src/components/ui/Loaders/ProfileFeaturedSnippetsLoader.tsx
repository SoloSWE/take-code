export const ProfileFeaturedSnippetsLoader = () => {
	return (
		<>
			<div className='flex gap-4'>
				<div className='w-45 h-12 bg-gray-400 animate-pulse rounded-3xl'></div>
			</div>
			<div className='w-full flex flex-col gap-4 mt-5'>
				<div className='w-full bg-gray-400 animate-pulse rounded-2xl px-4 py-11'></div>
				<div className='w-full bg-gray-400 animate-pulse rounded-2xl px-4 py-11'></div>
				<div className='w-full bg-gray-400 animate-pulse rounded-2xl px-4 py-11'></div>
			</div>
		</>
	);
};