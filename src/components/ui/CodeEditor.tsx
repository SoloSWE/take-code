import { useEffect, useState, useRef } from 'react';
import { codeToHtml } from 'shiki';

type CodeEditorProps = {
	code: string;
	onChange: (newCode: string) => void;
	language: string;
	filename?: string;
};

export const CodeEditor = ({
	code,
	onChange,
	language,
	filename,
}: CodeEditorProps) => {
	const [codeHTML, setCodeHTML] = useState<string>('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const preRef = useRef<HTMLDivElement>(null);

	// Подсветка Shiki в реальном времени
	useEffect(() => {
		let isMounted = true;

		async function highlight() {
			if (!code) {
				setCodeHTML('');
				return;
			}
			try {
				const html = await codeToHtml(code, {
					lang: language.toLowerCase() || 'typescript',
					theme: 'one-dark-pro',
				});
				if (isMounted) setCodeHTML(html);
			} catch (error) {
				if (isMounted) {
					const safeCode = code
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;');
					setCodeHTML(`<pre><code>${safeCode}</code></pre>`);
				}
				console.log(error);
			}
		}

		highlight();
		return () => {
			isMounted = false;
		};
	}, [code, language]);

	// Синхронизация скролла
	const handleScroll = () => {
		if (textareaRef.current && preRef.current) {
			preRef.current.scrollTop = textareaRef.current.scrollTop;
			preRef.current.scrollLeft = textareaRef.current.scrollLeft;
		}
	};

	// Генерация номеров строк
	const lines = code ? code.split('\n') : [''];
	const lineCount = Math.max(lines.length, 8);
	const lineNumbers = Array.from({ length: lineCount }, (_, i) =>
		String(i + 1).padStart(2, '0'),
	);

	return (
		<div className='bg-[#080c14] border border-[#1b2333] rounded-2xl overflow-hidden focus-within:border-[#2dd4bf]/70 transition-all shadow-2xl w-full'>
			{/* Шапка редактора */}
			<div className='bg-[#0c1326] px-3.5 sm:px-4 py-3 sm:py-4 border-b border-[#1b2333] flex items-center justify-between select-none gap-2'>
				<div className='flex items-center gap-2 sm:gap-3 min-w-0'>
					{/* Кнопки управления окноm */}
					<div className='flex items-center gap-1.5 shrink-0'>
						<span className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block' />
						<span className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block' />
						<span className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block' />
					</div>

					<span className='text-xs sm:text-base font-mono text-slate-200 font-semibold tracking-wide truncate ml-1'>
						{filename || 'use-session-guard.ts'}
					</span>
				</div>

				{/* Бейдж языка */}
				<span className='px-2 sm:px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-black bg-[#161f30] text-[#2dd4bf] border border-[#222f47] uppercase tracking-wider shrink-0'>
					{language || 'code'}
				</span>
			</div>

			{/* Поле ввода + Shiki подсветка */}
			<div className='relative flex min-h-72 sm:min-h-80 font-mono text-xs sm:text-sm leading-relaxed overflow-hidden'>
				{/* Номера строк */}
				<div className='select-none py-4 px-2.5 sm:px-3.5 text-right bg-[#050b1c] border-r border-[#1b2333] text-slate-600 font-mono flex flex-col space-y-px min-w-9 sm:min-w-12 shrink-0 z-10'>
					{lineNumbers.map((num, i) => (
						<span key={i} className='leading-relaxed'>
							{num}
						</span>
					))}
				</div>

				{/* Обертка редактора с синхронным скроллом */}
				<div className='relative flex-1 bg-[#050b1c] overflow-hidden'>
					{/* 1. Нижний слой: Подсвеченный HTML */}
					<div
						ref={preRef}
						className='absolute inset-0 p-3.5 sm:p-4 pointer-events-none font-mono text-xs sm:text-sm leading-relaxed overflow-auto whitespace-pre [&_pre]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0! [&_code]:font-mono'
						dangerouslySetInnerHTML={{
							__html:
								codeHTML ||
								`<pre><code><span style="color: #5c6370;">// Paste or write your code here...</span></code></pre>`,
						}}
					/>

					{/* 2. Верхний слой: Прозрачный Textarea */}
					<textarea
						ref={textareaRef}
						value={code}
						onChange={e => onChange(e.target.value)}
						onScroll={handleScroll}
						placeholder=''
						className='absolute inset-0 w-full h-full p-3.5 sm:p-4 bg-transparent text-transparent caret-[#2dd4bf] font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none whitespace-pre selection:bg-[#2dd4bf]/25 overflow-auto'
						spellCheck={false}
					/>
				</div>
			</div>
		</div>
	);
};