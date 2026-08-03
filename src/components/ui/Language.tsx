type languagesTProps = {
	language: string | undefined;
	icon?: string;
	background?: string | null;
	color?: string | null;
	borderColor?: string | null;
};

export const Language = ({
	language,
	icon,
	background,
	color,
	borderColor,
}: languagesTProps) => {
	return (
		<div
			className='flex items-center justify-center gap-1.5 sm:gap-2 w-auto h-auto rounded-2xl sm:rounded-3xl border font-bold text-xs sm:text-sm px-2.5 sm:px-3.5 py-0.5 sm:py-1 transition-colors duration-300 ease-in-out shrink-0'
			style={{
				backgroundColor: background || '#1b2335',
				borderColor: borderColor || '#2f374a',
				color: color || '#94a3b8',
			}}
		>
			{icon && (
				<img
					className='rounded-sm w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain'
					src={icon}
					alt={language || 'language icon'}
				/>
			)}
			<span>{language || 'plaintext'}</span>
		</div>
	);
};