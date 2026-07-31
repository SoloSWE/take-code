import { useEffect, useState } from 'react'

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../components/ui/pagination';

import { cn } from '../utils/cn';
import { supabase } from '../utils/supabase';

import { Filter, Search, X } from 'lucide-react';

import { SmartSnippetsFilters } from '../components/features/SmartSnippetsFilters';
import { SortDropdown } from '../components/features/SortDropDown';

import type { snippetCard } from '../components/features/Showcase';
import { Snippets } from '../components/features/Snippets';


export type languagesT = {
	id: string;
	name: string;
	icon: string;
	snippets?: { count: number }[];
};

export type frameworksT = {
    id: string,
    name: string
}

export type tagsT = {
	id: string;
	name: string;
};

const sortingFiltersT = ['Trending', 'Most Copied', 'Recent'];

export const ExploreHub = () => {
	const [snippets, setSnippets] = useState<snippetCard[] | null>([]);

	const [selectedLanguage, setSelectedLanguage] = useState<string>('');
	const [selectedFramework, setSelectedFramework] = useState<string>('');
	const [selectedTag, setSelectedTag] = useState<string>('');
	const [selectedFilter, setSelectedFilter] = useState<string>(
		sortingFiltersT[0],
	);

	const [reset, setReset] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);
	const [languages, setLanguages] = useState<languagesT[] | null>([]);
	const [frameworks, setFrameworks] = useState<frameworksT[] | null>([]);
	const [tags, setTags] = useState<tagsT[] | null>([]);

	const currentLang = languages?.find(lang => lang.id === selectedLanguage);
	const currentFramework = frameworks?.find(fw => fw.id === selectedFramework);
	const currentTag = tags?.find(t => t.id === selectedTag);

	const [searchQuery, setSearchQuery] = useState<string>('');

	const isActive = searchQuery?.length > 0;

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);

	const pageSize = 8;
	const totalPages = Math.ceil(totalCount / pageSize);

	const toggleReset = () => {
		setReset(!reset);
		setSelectedLanguage('');
		setSelectedFramework(''); // Сбрасываем фреймворк
		setSelectedTag('');
	};

	const searchFilteredSnippets = snippets
		? snippets.filter(snippet =>
				snippet.title.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: null;

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const [languagesResponce, libsFrameworkdResponce, tagsResponce] =
					await Promise.all([
						supabase.from('languages').select('*, snippets(count)'),
						supabase.from('frameworks').select('*'),
						supabase.from('tags').select('*'),
					]);

				setLanguages(languagesResponce.data);
				setFrameworks(libsFrameworkdResponce.data);
				setTags(tagsResponce.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	useEffect(() => {
		const fetchSnippets = async () => {
			setSnippets([]); // Скелетоны во время загрузки

			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				const currentUserId = user?.id;

				// Расчет диапазона для Supabase
				const from = (currentPage - 1) * pageSize;
				const to = from + pageSize - 1;

				// 2. Добавляем { count: 'exact' } для получения точного количества записей в БД
				let query = supabase.from('snippets').select(
					`
						*,
						languages(name, color, background, borderColor, icon),
						profiles:user_id(tag, avatar_url),
						snippets_stars(user_id),
						dependencies:snippet_dependencies(
							dependencies(id, name, install_command, color, bg, border_color)
						)
					`,
					{ count: 'exact' },
				);

				// Фильтры
				if (selectedLanguage) {
					query = query.eq('language_id', selectedLanguage);
				}
				if (selectedFramework)
					query = query.eq('framework_id', selectedFramework);
				if (selectedTag && currentTag)
					query = query.contains('tags', [currentTag.name]);

				// Сортировка
				if (selectedFilter === 'Trending') {
					query = query.order('stars_count', { ascending: false });
				} else if (selectedFilter === 'Most Copied') {
					query = query.order('copied_count', { ascending: false });
				} else if (selectedFilter === 'Recent') {
					query = query.order('created_at', { ascending: false });
				}

				// 3. Применяем диапазоны пагинации
				query = query.range(from, to);

				const { data, count, error } = await query;

				if (error) {
					console.error('Ошибка Supabase:', error);
					return;
				}

				if (count !== null) {
					setTotalCount(count); // Запоминаем количество
				}

				if (data) {
					const formattedData = data.map(item => {
						const hasStarred =
							Array.isArray(item.snippets_stars) &&
							item.snippets_stars.some(
								(star: { user_id: string }) => star.user_id === currentUserId,
							);

						return {
							...item,
							is_starred_by_user: Boolean(hasStarred),
						};
					});

					setSnippets(formattedData);
				}
			} catch (err) {
				console.error('Ошибка при загрузке:', err);
			}
		};

		fetchSnippets();
	}, [
		selectedLanguage,
		selectedFramework,
		selectedTag,
		currentTag,
		selectedFilter,
		currentPage,
	]);

	const getFilterText = () => {
		if (!selectedLanguage) return 'Filter';
		if (selectedLanguage && !selectedFramework) return currentLang?.name;
		if (selectedLanguage && selectedFramework && !selectedTag)
			return `${currentLang?.name} -> ${currentFramework?.name}`;
		return `${currentLang?.name} -> ${currentFramework?.name} -> ${currentTag?.name}`;
	};

	return (
		<section className='w-full py-6 px-10'>
			<div>
				<div className='flex flex-col gap-3'>
					<h3 className='text-[16px] text-[#38BDF8] font-bold font-mono'>
						Explore Hub
					</h3>
					<h2 className='text-5xl text-white font-extrabold'>
						Browse code by stack, <br /> task, and momentum.
					</h2>
					<div className='flex items-end justify-between'>
						<p className='text-lg text-[#94A3B8]'>
							Narrow from language to framework to exact intent, then take the
							snippet that fits your <br /> build.
						</p>
						<div className='flex items-center justify-center gap-2 w-auto h-auto rounded-3xl bg-[#34d3992e] border border-[#34d39952] text-[#A7F3D0] font-bold text-[16px] px-4 py-2 max-[460px]:py-2'>
							<Filter color='#34D399' size={18} />
							{getFilterText()}
						</div>
					</div>
				</div>
			</div>
			<div className='mt-7 flex items-start gap-5'>
				<div className='w-120 h-auto px-5 py-5 bg-[#0B1220] border border-[#94a3b838] rounded-3xl'>
					<SmartSnippetsFilters
						languages={languages}
						frameworks={frameworks}
						tags={tags}
						selectedLanguage={selectedLanguage}
						setSelectedLanguage={langId => {
							setSelectedLanguage(langId);
							setSelectedFramework('');
							setSelectedTag('');
						}}
						selectedFramework={selectedFramework}
						setSelectedFramework={fwId => {
							setSelectedFramework(fwId);
							setSelectedTag('');
						}}
						selectedTag={selectedTag}
						setSelectedTag={setSelectedTag}
						toggleReset={toggleReset}
						loading={loading}
					/>
				</div>
				<div className='w-full'>
					<div className='bg-[#0c1321] border border-[#252d3c] px-4 py-4 rounded-3xl'>
						<div className='flex items-center justify-between gap-2 max-[640px]:flex-col'>
							<div className='relative flex items-center w-full'>
								<input
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									className='w-full bg-[#060b1b] border border-[#22293d] text-white text-[16px] px-4 py-2.5 pl-11 pr-11 rounded-xl focus:outline-none focus:ring-[#343a4c] focus:border-[#343a4c] max-lg:text-[14px]'
									type='text'
									placeholder='Search snippets...'
								/>

								<div className='absolute left-4 flex items-center justify-center'>
									<Search
										className='cursor-pointer text-[#38BDF8] hover:text-white transition-colors'
										size={18}
									/>
								</div>

								<div className='absolute right-4 flex items-center justify-center'>
									<X
										className={cn(
											'text-[#64748b] cursor-pointer hover:text-white transition-colors',
											isActive ? 'visible opacity-100' : 'invisible opacity-0',
										)}
										size={18}
										onClick={() => setSearchQuery('')}
									/>
								</div>
							</div>
							<SortDropdown
								filtersList={sortingFiltersT}
								selectedFilter={selectedFilter}
								setSelectedFilter={setSelectedFilter}
							/>
						</div>
					</div>
					<div className='flex items-center justify-between mt-4'>
						<h2 className='text-2xl text-[#F8FAFC] font-bold'>
							{totalCount} matching snippets
						</h2>
						<p className='text-[#64748B] font-mono font-semibold'>
							Sorted by: {selectedFilter.toLocaleLowerCase()}
						</p>
					</div>
					<div className='mt-4'>
						<Snippets
							snippets={searchFilteredSnippets}
							activeSnippetCategory={selectedFilter}
						/>
						{/* 4. Оживляем UI Пагинации */}
						{totalPages > 1 && (
							<div className='mt-6 flex justify-start'>
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={e => {
													e.preventDefault();
													if (currentPage > 1) setCurrentPage(prev => prev - 1);
												}}
												className={
													currentPage === 1
														? 'pointer-events-none opacity-40'
														: ''
												}
											/>
										</PaginationItem>

										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											page => (
												<PaginationItem key={page}>
													<PaginationLink
														isActive={page === currentPage}
														onClick={e => {
															e.preventDefault();
															setCurrentPage(page);
														}}
													>
														{page}
													</PaginationLink>
												</PaginationItem>
											),
										)}

										<PaginationItem>
											<PaginationNext
												onClick={e => {
													e.preventDefault();
													if (currentPage < totalPages)
														setCurrentPage(prev => prev + 1);
												}}
												className={
													currentPage === totalPages
														? 'pointer-events-none opacity-40'
														: ''
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};