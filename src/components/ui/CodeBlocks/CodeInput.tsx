import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { CodeLoader } from '../Loaders/CodeLoader';

type CodeInputProps = {
	code: string;
	language: string;
};

export const CodeInput = ({ code, language }: CodeInputProps) => {
	const [codeHTML, setCodeHTML] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function hightLightCode() {
			setIsLoading(true);
			try {
				const html = await codeToHtml(code, {
					lang: language ? language.toLowerCase() : 'plaintext',
					theme: 'one-dark-pro',
				});
				setCodeHTML(html);
			} catch (error) {
				console.error('Ошибка подсветки кода:', error);
			} finally {
				setIsLoading(false);
			}
		}

		hightLightCode();
	}, [code, language]);

	return (
		<div className='flex justify-start items-center px-3 py-2.5 sm:px-4 sm:py-3 bg-[#020617b6] rounded-xl border border-[#222b3e] text-xs sm:text-sm font-mono overflow-x-auto w-full [&_pre]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0!'>
			{isLoading ? (
				<div className='w-full flex justify-center py-2'>
					<CodeLoader />
				</div>
			) : (
				<div
					className='w-full max-h-24 sm:max-h-32 overflow-y-auto font-jetbrains line-clamp-3 sm:line-clamp-4 leading-relaxed'
					dangerouslySetInnerHTML={{ __html: codeHTML }}
				/>
			)}
		</div>
	);
};