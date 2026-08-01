import { useEffect, useState, useRef } from 'react';
import { codeToHtml } from 'shiki';

type CodeEditorProps = {
	code: string;
	onChange: (newCode: string) => void;
	language: string;
	filename?: string;
};

export const CodeEditor = ({ code, onChange, language, filename }: CodeEditorProps) => {
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
				// Фолбэк на случай ошибки языка
				if (isMounted) {
					const safeCode = code
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;');
					setCodeHTML(`<pre><code>${safeCode}</code></pre>`);
				}
                console.log(error)
			}
		}

		highlight();
		return () => {
			isMounted = false;
		};
	}, [code, language]);

	// Синхронизация скролла между textarea и подсвеченным слоем
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
		String(i + 1).padStart(2, '0')
	);

	return (
		<div className='bg-[#080c14] border border-[#1b2333] rounded-2xl overflow-hidden focus-within:border-[#2dd4bf]/70 transition-all shadow-2xl'>
			{/* Шапка с точками macOS или названием файла */}
			<div className='bg-[#0c1326] px-4 py-5 border-b border-[#1b2333] flex items-center justify-between select-none'>
				<div className='flex items-center gap-3'>
					{/* Красная, жёлтая, зелёная точки как на use-copy-snippet.ts */}
					<div className='flex items-center gap-1.5'>
						<span className='w-3 h-3 rounded-full bg-[#ff5f56] inline-block' />
						<span className='w-3 h-3 rounded-full bg-[#ffbd2e] inline-block' />
						<span className='w-3 h-3 rounded-full bg-[#27c93f] inline-block' />
					</div>

					<span className='text-base font-mono text-slate-200 font-semibold tracking-wide ml-1'>
						{filename || 'use-session-guard.ts'}
					</span>
				</div>

				{/* Бейдж языка */}
				<span className='px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black bg-[#161f30] text-[#2dd4bf] border border-[#222f47] uppercase tracking-wider'>
					{language}
				</span>
			</div>

			{/* Поле ввода + Полноценная Shiki подсветка */}
			<div className='relative flex min-h-[320px] font-mono text-sm leading-relaxed overflow-hidden'>
				{/* Номера строк (01, 02, 03...) */}
				<div className='select-none py-4 px-3.5 text-right bg-[#050b1c] border-r border-[#1b2333] text-slate-600 text-xs font-mono flex flex-col space-y-[1px] min-w-[48px] z-10'>
					{lineNumbers.map(num => (
						<span key={num} className='leading-relaxed'>
							{num}
						</span>
					))}
				</div>

				{/* Обертка редактора с наложением */}
				<div className='relative flex-1 bg-[#050b1c] overflow-hidden'>
					{/* 1. Нижний слой: Подсвеченный HTML от Shiki */}
					<div
						ref={preRef}
						className='absolute inset-0 p-4 pointer-events-none font-mono text-sm leading-relaxed overflow-auto whitespace-pre wrap-break-word [&_pre]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0! [&_code]:font-mono'
						dangerouslySetInnerHTML={{
							__html:
								codeHTML ||
								`<pre><code><span style="color: #5c6370;">// Paste or write your code here...</span></code></pre>`,
						}}
					/>

					{/* 2. Верхний слой: Прозрачный Textarea для набора текста */}
					<textarea
						ref={textareaRef}
						value={code}
						onChange={e => onChange(e.target.value)}
						onScroll={handleScroll}
						placeholder=''
						className='absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-[#2dd4bf] font-mono text-sm leading-relaxed focus:outline-none resize-none whitespace-pre wrap-break-word selection:bg-[#2dd4bf]/25'
						spellCheck={false}
					/>
				</div>
			</div>
		</div>
	);
}