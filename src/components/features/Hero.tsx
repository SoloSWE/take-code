import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { codeToHtml } from 'shiki'

import { Sparkles } from 'lucide-react';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CodeLoader } from '../ui/Loaders/CodeLoader';

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
        navigator.clipboard.writeText(snippetCode)
        .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        })
    }

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
			isMounted = false; // Защита от race condition, если компонент размонтируется во время асинхронного таска
		};
	}, []);

	const handleSearchSubmit = () => {
		if (!searchQuery.trim()) return;
		navigate(`/exploreHub?search=${encodeURIComponent(searchQuery.trim())}`);
	};

	return (
		<section className='flex flex-col items-center justify-center mt-25 px-5'>
			<div className='flex items-center justify-center gap-1 w-100 h-9 bg-[#38bff824] border border-[#38bff842] rounded-3xl max-[400px]:hidden'>
				<Sparkles className='text-[#38BDF8] scale-85 max-sm:scale-75' />
				<p className='text-[#BAE6FD] font-semibold max-sm:text-[14px] mt-0.5'>
					Community snippets for production builders
				</p>
			</div>

			<h1 className='text-white font-black text-8xl mt-8 text-center max-lg:text-7xl max-md:text-6xl px-5'>
				Take the code you <br /> need. Build faster.
			</h1>

			<p className='text-[#94A3B8] text-center font-medium mt-5.5 text-xl max-lg:text-[18px] max-md:text-[17px] px-5'>
				A developer-first library where every snippet is easy <br /> to scan,
				copy, rate, and reuse across any stack.
			</p>

			<div className='flex items-center gap-2 mt-5.5 max-[640px]:flex-col'>
				<Input
					width={510}
					height={50}
					value={searchQuery}
					onChange={setSearchQuery}
					rounded={16}
					iconColor='#38BDF8'
					placeholder='Search “auth middleware”, “pricing card”, “Rust parser”…'
					otherClass='max-[640px]:w-full max-sm:w-75'
				/>
				<button
					onClick={handleSearchSubmit}
					className='w-45 h-12 rounded-2xl bg-linear-to-br from-[#38BDF8] to-[#34D399] font-bold cursor-pointer max-[640px]:w-full max-sm:w-75 text-[#0f172a] active:scale-98 transition-transform'
				>
					Explore snippets
				</button>
			</div>

			<div className='max-w-260 w-full h-auto bg-[#020617b6] rounded-3xl mt-15 border border-[#222b3e] shadow-[0px_0px_50px_0px_#38bff839]'>
				<div className='flex items-center justify-between w-full h-20 px-5 bg-[#0f172ab0] rounded-t-3xl border border-[#222b3e]'>
					<div className='flex items-center gap-4'>
						<ul className='flex items-center justify-center gap-2 max-sm:hidden'>
							<li className='w-4 h-4 bg-[#F87171] rounded-full'></li>
							<li className='w-4 h-4 bg-[#FBBF24] rounded-full'></li>
							<li className='w-4 h-4 bg-[#34D399] rounded-full'></li>
						</ul>
						<p
							className={`text-white text-xl font-mono max-md:text-lg max-sm:text-[15px]`}
						>
							use-copy-snippet.ts
						</p>
					</div>
					<Button onClick={copyCode} copiedStatus={copied} />
				</div>
				<div className='w-full h-full px-6 py-6 font-mono text-lg overflow-x-auto selection:bg-[#38bff833] [&_pre]:bg-transparent! [&_pre]:outline-hidden'>
					{code ? (
						<div
							className='text-left leading-relaxed'
							dangerouslySetInnerHTML={{ __html: code }}
						/>
					) : (
						<div className='w-full min-h-35 flex items-center justify-center'>
							<CodeLoader />
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
