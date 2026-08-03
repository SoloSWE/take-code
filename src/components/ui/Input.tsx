import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

type InputProps = {
	width?: number;
	height?: number;
	value: string;
	onChange: (val: string) => void;
	iconColor?: string;
	rounded?: number;
	placeholder?: string;
	placeholderColor?: string;
	otherClass?: string;
};

export const Input = ({
	width = 510,
	height = 50,
	value,
	onChange,
	iconColor = '#64748b',
	rounded = 16,
	placeholder,
	placeholderColor,
	otherClass,
}: InputProps) => {
	const isActive = value?.length > 0;

	return (
		<div className='flex items-center justify-center relative w-full max-w-full'>
			<input
				className={cn(
					'w-full bg-[#090f22] border border-[#22293d] text-white text-sm sm:text-base pl-10 sm:pl-11 pr-10 sm:pr-11 focus:outline-none focus:ring-1 focus:ring-[#38BDF8] focus:border-[#38BDF8] transition-all',
					otherClass,
				)}
				style={{
					maxWidth: `${width}px`,
					height: `${height}px`,
					borderRadius: `${rounded}px`,
					...((placeholderColor
						? { '--placeholder-color': placeholderColor }
						: {}) as React.CSSProperties),
				}}
				onChange={e => onChange(e.target.value)}
				type='text'
				value={value}
				placeholder={placeholder || 'Search...'}
			/>

			<div className='absolute left-3.5 sm:left-4 flex items-center justify-center pointer-events-none'>
				<Search
					style={{ color: iconColor }}
					className='w-4 h-4 sm:w-4.5 sm:h-4.5'
				/>
			</div>

			<div className='absolute right-3.5 sm:right-4 flex items-center justify-center'>
				<X
					className={cn(
						'text-[#64748b] cursor-pointer hover:text-white transition-colors w-4 h-4 sm:w-4.5 sm:h-4.5',
						isActive ? 'visible opacity-100' : 'invisible opacity-0',
					)}
					onClick={() => onChange('')}
				/>
			</div>
		</div>
	);
};