import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { codeToHtml } from 'shiki';

import { Sparkles } from 'lucide-react';

import { Input } from '../../ui/Input';
import { Button } from '../../ui/Buttons/Button';
import { CodeLoader } from '../../ui/Loaders/CodeLoader';

const snippetCode = `export function copySnippet(source: string) {
	return navigator.clipboard.writeText(source)
		.then(() => toast.success("Copied in 0.2s"))
		.catch(() => toast.error("Try again"))
	}`;

export const Hero = () => {
	const navigate = useNavigate();

	const [code, setCode] = useState<string>('');
	const [copied, setCopied] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');

	const copyCode = () => {
		navigator.clipboard.writeText(snippetCode).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	useEffect(() => {
		let isMounted = true;

		async function highlight() {
			try {
				const html = await codeToHtml(snippetCode, {
					lang: 'typescript',
					theme: 'one-dark-pro',
				});
				if (isMounted) {
					setCode(html);
				}
			} catch (error) {
				console.error('Shiki highlight error:', error);
			}
		}

		highlight();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleSearchSubmit = () => {
		if (!searchQuery.trim()) return;
		navigate(`/exploreHub?search=${encodeURIComponent(searchQuery.trim())}`);
	};

	return (
		<section className='flex flex-col items-center justify-center mt-6 sm:mt-12 lg:mt-16 px-4 w-full max-w-7xl mx-auto'>
			{/* Бейдж */}
			<div className='hidden sm:flex items-center justify-center gap-2 px-4 py-1.5 bg-[#38bff824] border border-[#38bff842] rounded-full max-w-max'>
				<Sparkles className='text-[#38BDF8] w-4 h-4' />
				<p className='text-[#BAE6FD] font-semibold text-xs sm:text-sm'>
					Community snippets for production builders
				</p>
			</div>

			{/* Главный заголовок */}
			<h1 className='text-white font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mt-4 sm:mt-8 text-center leading-tight tracking-tight'>
				Take the code you need. <br className='hidden sm:block' /> Build faster.
			</h1>

			{/* Описание */}
			<p className='text-[#94A3B8] text-center font-medium mt-4 sm:mt-6 text-sm sm:text-lg lg:text-xl max-w-2xl leading-relaxed'>
				A developer-first library where every snippet is easy to scan, copy,
				rate, and reuse across any stack.
			</p>

			{/* Поиск и Кнопка */}
			<div className='flex flex-col sm:flex-row items-center gap-3 mt-6 sm:mt-8 w-full max-w-xl justify-center'>
				<div className='w-full sm:w-auto flex-1'>
					<Input
						width={510}
						height={50}
						value={searchQuery}
						onChange={setSearchQuery}
						rounded={16}
						iconColor='#38BDF8'
						placeholder='Search "auth middleware", "pricing card"...'
						otherClass='w-full'
					/>
				</div>
				<button
					onClick={handleSearchSubmit}
					className='w-full sm:w-44 h-12 rounded-2xl bg-linear-to-br from-[#38BDF8] to-[#34D399] font-bold cursor-pointer text-[#0f172a] active:scale-98 transition-transform shrink-0 text-sm sm:text-base'
				>
					Explore snippets
				</button>
			</div>

			{/* Терминал с кодом */}
			<div className='max-w-5xl w-full bg-[#020617b6] rounded-2xl sm:rounded-3xl mt-8 sm:mt-14 border border-[#222b3e] shadow-[0px_0px_50px_0px_#38bff839] overflow-hidden'>
				<div className='flex items-center justify-between w-full h-14 sm:h-16 px-4 sm:px-6 bg-[#0f172ab0] border-b border-[#222b3e]'>
					<div className='flex items-center gap-3 sm:gap-4'>
						<ul className='flex items-center gap-2 max-sm:hidden'>
							<li className='w-3 h-3 bg-[#F87171] rounded-full'></li>
							<li className='w-3 h-3 bg-[#FBBF24] rounded-full'></li>
							<li className='w-3 h-3 bg-[#34D399] rounded-full'></li>
						</ul>
						<p className='text-white text-xs sm:text-base font-mono'>
							use-copy-snippet.ts
						</p>
					</div>
					<Button onClick={copyCode} copiedStatus={copied} />
				</div>
				<div className='w-full px-4 sm:px-6 py-4 sm:py-6 font-mono text-sm sm:text-base lg:text-lg overflow-x-auto selection:bg-[#38bff833] [&_pre]:bg-transparent! [&_pre]:outline-hidden'>
					{code ? (
						<div
							className='text-left leading-relaxed'
							dangerouslySetInnerHTML={{ __html: code }}
						/>
					) : (
						<div className='w-full min-h-32 flex items-center justify-center'>
							<CodeLoader />
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
