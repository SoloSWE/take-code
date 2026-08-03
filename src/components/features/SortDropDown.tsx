import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Props = {
	filtersList: string[];
	selectedFilter: string;
	setSelectedFilter: (filter: string) => void;
};

export const SortDropdown = ({
	filtersList,
	selectedFilter,
	setSelectedFilter,
}: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (item: string) => {
		setSelectedFilter(item);
		setIsOpen(false);
	};

	return (
		<div
			ref={dropdownRef}
			className='relative w-full sm:w-56 md:w-64 font-sans select-none'
		>
			<div
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'flex items-center justify-between w-full h-10 sm:h-11 bg-[#060b1b] border px-3.5 sm:px-4 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold text-[#94A3B8] transition-all duration-200 active:scale-98',
					isOpen
						? 'border-[#38BDF8] text-white shadow-[0px_0px_15px_0px_#38bff820]'
						: 'border-[#22293d] hover:border-[#343a4c]',
				)}
			>
				<span className='truncate'>{selectedFilter}</span>
				<ChevronDown
					className={cn(
						'w-4 h-4 text-[#64748b] shrink-0 transition-transform duration-200',
						isOpen && 'transform rotate-180 text-[#38BDF8]',
					)}
				/>
			</div>

			{isOpen && (
				<ul className='absolute left-0 right-0 mt-2 bg-[#060b1b] border border-[#22293d] rounded-xl py-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-60 overflow-y-auto custom-scrollbar'>
					{filtersList.map((item, index) => {
						const isSelected = item === selectedFilter;
						return (
							<li
								key={index}
								onClick={() => handleSelect(item)}
								className={cn(
									'px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition-colors duration-150 truncate',
									isSelected
										? 'bg-[#121726] text-[#38BDF8] font-semibold'
										: 'text-[#94A3B8] hover:bg-[#121726] hover:text-white',
								)}
							>
								{item}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};