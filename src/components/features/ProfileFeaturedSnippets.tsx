import { Star, TrendingUp } from "lucide-react";

export const ProfileFeaturedSnippets = () => {
	return (
		<div className='flex flex-col w-full max-w-5xl'>
			{/* Заголовок блока */}
			<div className='flex items-center gap-3'>
				<div className='p-2.5 bg-[#f8fafc05] border border-[#1e2533] rounded-2xl text-[#aeb5c0]'>
					<TrendingUp className='w-7 h-7 text-emerald-500' />
				</div>
				<h2 className='text-3xl text-white font-semibold'>Featured Snippets</h2>
			</div>
			<ul className='mt-5'>
				<li className='w-full h-full bg-[#0b1220] border border-[#242c3b] rounded-2xl px-5 py-5 flex items-center justify-between'>
					<h3 className='text-white font-bold text-xl'>Snippet Name</h3>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-1.5 text-[#cbd5e1] font-semibold'>
							<span>count</span>
							<Star
								className={'text-[#e3d07f] fill-[#e3d07f]'
								}
								size={20}
							/>
						</div>
					</div>
				</li>
			</ul>
		</div>
	);
};
