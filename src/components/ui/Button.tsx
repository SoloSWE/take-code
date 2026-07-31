import { Check, Copy } from 'lucide-react';
import { useLocation } from 'react-router-dom';

type ButtonProps = {
	copiedStatus: boolean;
	onClick: () => void;
};

export const Button = ({ copiedStatus, onClick }: ButtonProps) => {
	const location = useLocation()
	
	return (
		<button
			className='flex items-center justify-center gap-2 w-auto h-auto rounded-3xl bg-[#34d3992e] border border-[#34d39952] text-[#A7F3D0] transition-colors duration-200 ease-in-out hover:bg-[#45ffbb2e] hover:border-[#28e09d52] hover:text-[#9bf9cd] font-bold text-lg cursor-pointer px-4 py-1 max-[460px]:py-2'
			disabled={location.pathname === '/'}
			onClick={onClick}
		>
			{copiedStatus ? (
				<Check color='#34D399' size={20} />
			) : (
				<Copy color='#34D399' size={18} />
			)}
			<div className='text-[16px] max-[460px]:hidden'>
				{copiedStatus ? 'Taked!' : 'Take Code'}
			</div>
		</button>
	);
};