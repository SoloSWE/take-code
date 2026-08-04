import { useEffect, useState } from 'react';

import { cn } from '../../utils/cn';
import { supabase } from '../../utils/supabase';

import { SmallFilterLanguagesLoader } from '../ui/Loaders/SmallFilterLanguagesLoader';
import { SmallFilterFWTagsLoader } from '../ui/Loaders/SmallFilterFWTagsLoader';

import type { languagesT, frameworksT, tagsT } from '../../pages/ExploreHub';
import { toast } from 'sonner';

type Props = {
	languages: languagesT[] | null;
	frameworks: frameworksT[] | null;
	tags: tagsT[] | null;
	selectedLanguage: string;
	setSelectedLanguage: (language: string) => void;
	selectedFramework: string;
	setSelectedFramework: (framework: string) => void;
	selectedTag: string;
	setSelectedTag: (tag: string) => void;
	toggleReset: () => void;
	loading: boolean;
};

type filteredFrameworksT = {
	id: string;
	language_id: string;
	framework_id: string;
};

type filteredTagsT = {
	id: string;
	language_id: string;
	tag_id: string;
};

export const SmartSnippetsFilters = ({
	tags,
    loading,
	languages,
	frameworks,
    selectedTag,
	selectedLanguage,
	selectedFramework,
	toggleReset,
    setSelectedTag,
	setSelectedLanguage,
	setSelectedFramework,
}: Props) => {
    const [loadingFrameworks, setLoadingFrameworks] = useState<boolean>(false);
    const [loadingTags, setLoadingTags] = useState<boolean>(false);

	const [languageFrameworks, setLanguageFrameworks] = useState<filteredFrameworksT[] | null>([]);
	const [languageTags, setLanguageTags] = useState<filteredTagsT[] | null>([]);

	const filteredFrameworks = frameworks?.filter(framework =>
		languageFrameworks?.some(f => f.framework_id === framework.id),
	);

	const filteredTags = tags?.filter(tag => languageTags?.some(t => t.tag_id === tag.id))

	useEffect(() => {
		if (selectedLanguage) {
			async function fetchData() {
				setLoadingFrameworks(true);
				try {
					const { data } = await supabase
						.from('language_frameworks')
						.select('*')
						.eq('language_id', selectedLanguage);

					setLanguageFrameworks(data);
					setLoadingFrameworks(false);
				} catch (error) {
					toast.error('Не удалось загрузить фреймворки.');
					console.log(error);
				}
			}
			fetchData();
		}
	}, [selectedLanguage, setLoadingFrameworks]);

    useEffect(() => {
			if (selectedFramework) {
				async function fetchData() {
					setLoadingTags(true);
					try {
						const { data } = await supabase
							.from('frameworks_tags')
							.select('*')
							.eq('framework_id', selectedFramework);

						setLanguageTags(data);
						setLoadingTags(false);
					} catch (error) {
						toast.error('Не удалось загрузить теги.');
						console.log(error);
					}
				}
				fetchData();
			}
		}, [selectedFramework, setLoadingTags]);

	return (
		<div>
			<div className='flex items-center justify-between'>
				<h3 className='text-2xl text-white font-bold'>Smart filters</h3>
				<button
					onClick={toggleReset}
					className='text-[16px] text-[#38BDF8] font-semibold cursor-pointer transition-colors hover:text-[#2c92bd]'
				>
					Reset
				</button>
			</div>
			<div className='mt-5'>
				{/* БЛОК ЯЗЫКА */}
				<div>
					<h4 className='text-sm text-[#64748B] font-bold font-mono'>
						01 · Language
					</h4>
					{loading ? (
						<SmallFilterLanguagesLoader />
					) : (
						<ul className='flex flex-col gap-4 mt-3'>
							{languages?.map(language => (
								<li
									key={language.id}
									onClick={() => setSelectedLanguage(language.id)}
									className={cn(
										'flex items-center justify-between w-full h-auto px-3 py-4 bg-[#151c29] border border-[#242d3a] rounded-2xl text-[#CBD5E1] font-semibold cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#131825] hover:border-[#282e3c] hover:text-[#aeb5c0]',
										language.id === selectedLanguage &&
											'bg-[#11293c] text-[#bae6fd] font-bold border border-[#1c5370] hover:bg-[#11293c] hover:text-[#bae6fd] hover:border-[#1c5370]',
									)}
								>
									<div className='flex gap-2'>
										<img
											className='rounded-sm'
											width={25}
											src={language.icon}
											alt='icon'
										/>
										{language.name}
									</div>
									<span>
										{language.snippets?.[0]?.count ?? 0}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* БЛОК ФРЕЙМВОРКА */}
				{selectedLanguage && (
					<div className='mt-5 animate-fadeIn'>
						<div className='w-full border-t-2 border-[#1c2532]' />
						<h4 className='text-sm text-[#64748B] font-bold font-mono mt-5'>
							02 · Framework
						</h4>
						{loadingFrameworks ? (
							<SmallFilterFWTagsLoader />
						) : (
							<ul className='flex gap-3 my-3 flex-wrap'>
								{filteredFrameworks?.map(framework => (
									<li
										key={framework.id}
										onClick={() => setSelectedFramework(framework.id)} // ТЕПЕРЬ СТАВИМ ИМЕННО ФРЕЙМВОРК!
										className={cn(
											'flex items-center justify-center gap-2 w-auto h-auto rounded-3xl font-bold text-lg px-4 py-1 bg-[#151c29] border border-[#242d3a] text-[#CBD5E1] text-[16px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#131825] hover:border-[#282e3c] hover:text-[#aeb5c0]',
											framework.id === selectedFramework &&
												'bg-[#11293c] text-[#bae6fd] border border-[#1c5370] hover:bg-[#11293c] hover:border-[#1c5370] hover:text-[#bae6fd]',
										)}
									>
										{framework.name}
									</li>
								))}
							</ul>
						)}
						<p className='text-sm text-[#64748B] font-medium'>
							Popular Overall appears when no language is selected.
						</p>
					</div>
				)}

				{/* БЛОК ТЕГОВ */}
				{selectedFramework && (
					<div className='mt-5 animate-fadeIn'>
						<div className='w-full border-t-2 border-[#1c2532]' />
						<h4 className='text-sm text-[#64748B] font-bold font-mono mt-5'>
							03 · Task tags
						</h4>
						{loadingTags ? (
							<SmallFilterFWTagsLoader />
						) : (
							<ul className='flex gap-3 my-3 flex-wrap'>
								{filteredTags?.map(tag => (
									<li
										key={tag.id}
										onClick={() => setSelectedTag(tag.id)}
										className={cn(
											'flex items-center justify-center gap-2 w-auto h-auto rounded-3xl font-bold text-lg px-4 py-1 bg-[#151c29] border border-[#242d3a] text-[#CBD5E1] text-[16px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#131825] hover:border-[#282e3c] hover:text-[#aeb5c0]',
											tag.id === selectedTag &&
												'bg-[#11293c] text-[#bae6fd] border border-[#1c5370] hover:bg-[#11293c] hover:border-[#1c5370] hover:text-[#bae6fd]',
										)}
									>
										{tag.name}
									</li>
								))}
							</ul>
						)}
					</div>
				)}
			</div>
		</div>
	);
};