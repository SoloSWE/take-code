import * as React from 'react';

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizontalIcon,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { PaginationButton } from '../../../components/ui/Pagination/PaginationButton';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
	return (
		<nav
			role='navigation'
			aria-label='pagination'
			data-slot='pagination'
			// Заменили mx-auto (центр) на w-full flex justify-start (выравнивание слева)
			className={cn('flex w-full justify-start', className)}
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<'ul'>) {
	return (
		<ul
			data-slot='pagination-content'
			// Аккуратные отступы между кнопками
			className={cn('flex items-center gap-2', className)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
	return <li data-slot='pagination-item' {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<React.ComponentProps<typeof PaginationButton>, 'size'> &
	React.ComponentProps<'a'>;

function PaginationLink({
	className,
	isActive,
	size = 'icon',
	...props
}: PaginationLinkProps) {
	return (
		<PaginationButton
			variant={isActive ? 'outline' : 'ghost'}
			size={size}
			className={cn(
				// Базовые стили под твой интерфейс:
				// Обычная кнопка — тёмный фон, серый текст, плавная подсветка при наведении
				// Активная кнопка — ярко-голубая граница #38BDF8, светящийся текст и глубокий тёмный фон
				'border text-sm font-medium transition-all rounded-xl cursor-pointer select-none',
				isActive
					? 'bg-[#0c1321] border-[#38BDF8] text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.15)] font-bold'
					: 'bg-[#0c1321] border-[#252d3c] text-[#94A3B8] hover:border-[#343a4c] hover:text-white hover:bg-[#121b2d]',
				className,
			)}
			nativeButton={false}
			render={
				<a
					aria-current={isActive ? 'page' : undefined}
					data-slot='pagination-link'
					data-active={isActive}
					{...props}
				/>
			}
		/>
	);
}

function PaginationPrevious({
	className,
	text = 'Previous',
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink
			aria-label='Go to previous page'
			className={cn('px-3.5 py-2 h-auto gap-1.5', className)}
			{...props}
		>
			<ChevronLeftIcon
				className='w-4 h-4 text-[#38BDF8]'
				data-icon='inline-start'
			/>
			<span className='hidden sm:block'>{text}</span>
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	text = 'Next',
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink
			aria-label='Go to next page'
			className={cn('px-3.5 py-2 h-auto gap-1.5', className)}
			{...props}
		>
			<span className='hidden sm:block'>{text}</span>
			<ChevronRightIcon
				className='w-4 h-4 text-[#38BDF8]'
				data-icon='inline-end'
			/>
		</PaginationLink>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<'span'>) {
	return (
		<span
			aria-hidden
			data-slot='pagination-ellipsis'
			className={cn(
				'flex size-9 items-center justify-center text-[#64748B]',
				className,
			)}
			{...props}
		>
			<MoreHorizontalIcon className='w-4 h-4' />
			<span className='sr-only'>More pages</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
