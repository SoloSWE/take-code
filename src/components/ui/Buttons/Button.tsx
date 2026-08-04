import { Check, Copy } from 'lucide-react';

type ButtonProps = {
	copiedStatus: boolean;
	onClick: (e: React.MouseEvent) => void;
};

export const Button = ({ copiedStatus, onClick }: ButtonProps) => {
	return (
		<button
			className='flex items-center justify-center gap-1.5 sm:gap-2 w-auto h-auto rounded-2xl sm:rounded-3xl bg-[#34d3992e] border border-[#34d39952] text-[#A7F3D0] transition-all duration-200 ease-in-out hover:bg-[#45ffbb2e] hover:border-[#28e09d52] hover:text-[#9bf9cd] active:scale-95 font-bold text-xs sm:text-sm lg:text-base cursor-pointer px-3 py-1.5 sm:px-4 sm:py-1.5 shrink-0'
			onClick={onClick}
		>
			{copiedStatus ? (
				<Check className='w-4 h-4 sm:w-5 sm:h-5 text-[#34D399]' />
			) : (
				<Copy className='w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#34D399]' />
			)}
			<span className='hidden sm:inline'>
				{copiedStatus ? 'Taked!' : 'Take Code'}
			</span>
		</button>
	);
};