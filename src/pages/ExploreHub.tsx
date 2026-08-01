import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
	id: string;
	name: string;
};

export type tagsT = {
	id: string;
	name: string;
};

const sortingFiltersT = ['Trending', 'Most Copied', 'Recent'];

export const ExploreHub = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	// 1. Справочники из БД
	const [languages, setLanguages] = useState<languagesT[] | null>(null);
	const [frameworks, setFrameworks] = useState<frameworksT[] | null>(null);
	const [tags, setTags] = useState<tagsT[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	// 2. Считываем параметры из URL (Единый источник правды)
	const searchQuery = searchParams.get('search') || '';
	const selectedFilter = searchParams.get('filter') || sortingFiltersT[0];
	const currentPage = Number(searchParams.get('page')) || 1;

	const langParam = searchParams.get('language');
	const fwParam = searchParams.get('framework');
	const tagParam = searchParams.get('tag');

	// 3. Вычисляем текущие объекты и ID из URL
	const currentLang = languages?.find(
		l => l.name.toLowerCase() === langParam?.toLowerCase(),
	);
	const currentFramework = frameworks?.find(
		f => f.name.toLowerCase() === fwParam?.toLowerCase(),
	);
	const currentTag = tags?.find(
		t => t.name.toLowerCase() === tagParam?.toLowerCase(),
	);

	const selectedLanguage = currentLang?.id || '';
	const selectedFramework = currentFramework?.id || '';
	const selectedTag = currentTag?.id || '';

	const isActive = searchQuery.length > 0;

	// Состояния для сниппетов
	const [snippets, setSnippets] = useState<snippetCard[] | null>([]);
	const [snippetsLoading, setSnippetsLoading] = useState<boolean>(true);
	const [totalCount, setTotalCount] = useState<number>(0);

	const pageSize = 6;
	const totalPages = Math.ceil(totalCount / pageSize);

	// 4. Загрузка справочников из БД
	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const [languagesRes, frameworksRes, tagsRes] = await Promise.all([
					supabase.from('languages').select('*, snippets(count)'),
					supabase.from('frameworks').select('*'),
					supabase.from('tags').select('*'),
				]);

				setLanguages(languagesRes.data || []);
				setFrameworks(frameworksRes.data || []);
				setTags(tagsRes.data || []);
			} catch (error) {
				console.error('Ошибка загрузки справочников:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	// 5. Вспомогательная функция обновления URL
	const updateSearchParams = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams);

		Object.entries(updates).forEach(([key, value]) => {
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});

		// Сбрасываем пагинацию при изменении поиска/фильтров
		if (!('page' in updates)) {
			params.delete('page');
		}

		setSearchParams(params, { replace: true });
	};

	// Хэндлеры UI
	const handleSelectLanguage = (langId: string) => {
		const lang = languages?.find(l => l.id === langId);
		updateSearchParams({
			language: lang ? lang.name : null,
			framework: null,
			tag: null,
		});
	};

	const handleSelectFramework = (fwId: string) => {
		const fw = frameworks?.find(f => f.id === fwId);
		updateSearchParams({
			framework: fw ? fw.name : null,
			tag: null,
		});
	};

	const handleSelectTag = (tagId: string) => {
		const tag = tags?.find(t => t.id === tagId);
		updateSearchParams({
			tag: tag ? tag.name : null,
		});
	};

	const handleSearchChange = (value: string) => {
		updateSearchParams({ search: value || null });
	};

	const handleFilterSelect = (filter: string) => {
		updateSearchParams({
			filter: filter === sortingFiltersT[0] ? null : filter,
		});
	};

	const handlePageChange = (page: number) => {
		updateSearchParams({ page: page > 1 ? page.toString() : null });
	};

	const toggleReset = () => {
		setSearchParams({}, { replace: true });
	};

	// 6. Загрузка сниппетов из Supabase
	useEffect(() => {
		const fetchSnippets = async () => {
			setSnippetsLoading(true);
			setSnippets(null);

			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				const currentUserId = user?.id;

				const from = (currentPage - 1) * pageSize;
				const to = from + pageSize - 1;

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
				)

				if (selectedLanguage) query = query.eq('language_id', selectedLanguage);
				if (selectedFramework)
					query = query.eq('framework_id', selectedFramework);
				if (selectedTag && currentTag)
					query = query.contains('tags', [currentTag.name]);

				if (selectedFilter === 'Trending') {
					query = query.order('stars_count', { ascending: false });
				} else if (selectedFilter === 'Most Copied') {
					query = query.order('copied_count', { ascending: false });
				} else if (selectedFilter === 'Recent') {
					query = query.order('created_at', { ascending: false });
				}

				query = query.range(from, to);

				const { data, count, error } = await query;

				if (error) {
					console.error('Ошибка Supabase:', error);
					setSnippets([]);
					return;
				}

				if (count !== null) setTotalCount(count);

				if (data) {
					const formattedData = data.map(item => ({
						...item,
						is_starred_by_user: Boolean(
							Array.isArray(item.snippets_stars) &&
							item.snippets_stars.some(
								(star: { user_id: string }) => star.user_id === currentUserId,
							),
						),
					}));

					setSnippets(formattedData);
				} else {
					setSnippets([]);
				}
			} catch (err) {
				console.error('Ошибка при загрузке:', err);
				setSnippets([]);
			} finally {
				setSnippetsLoading(false);
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

	const searchFilteredSnippets = snippets
		? snippets.filter(snippet =>
				snippet.title.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: null;

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
						setSelectedLanguage={handleSelectLanguage}
						selectedFramework={selectedFramework}
						setSelectedFramework={handleSelectFramework}
						selectedTag={selectedTag}
						setSelectedTag={handleSelectTag}
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
									onChange={e => handleSearchChange(e.target.value)}
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
										onClick={() => handleSearchChange('')}
									/>
								</div>
							</div>
							<SortDropdown
								filtersList={sortingFiltersT}
								selectedFilter={selectedFilter}
								setSelectedFilter={handleFilterSelect}
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
						{snippetsLoading ? (
							<Snippets
								snippets={null}
								activeSnippetCategory={selectedFilter}
							/>
						) : searchFilteredSnippets && searchFilteredSnippets.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#252d3c] rounded-3xl bg-[#0c1321]/50 text-center space-y-3'>
								<div className='p-4 bg-[#162032] border border-[#222f47] rounded-full text-[#38BDF8] mb-1'>
									<Search className='w-8 h-8' />
								</div>
								<h3 className='text-xl font-bold text-white'>
									Сниппеты не найдены
								</h3>
								<p className='text-sm text-[#64748B] max-w-md leading-relaxed'>
									По вашему запросу {searchQuery ? `"${searchQuery}"` : ''}{' '}
									ничего не найдено. Попробуйте изменить фильтры или сбросить
									поиск.
								</p>
								{(searchQuery ||
									selectedLanguage ||
									selectedFramework ||
									selectedTag) && (
									<button
										onClick={toggleReset}
										className='mt-2 px-4 py-2 bg-[#1b2333] hover:bg-[#252d3c] text-[#38BDF8] text-sm font-semibold rounded-xl transition-all cursor-pointer'
									>
										Сбросить фильтры
									</button>
								)}
							</div>
						) : (
							<Snippets
								snippets={searchFilteredSnippets}
								activeSnippetCategory={selectedFilter}
							/>
						)}

						{!snippetsLoading &&
							totalPages > 1 &&
							searchFilteredSnippets &&
							searchFilteredSnippets.length > 0 && (
								<div className='mt-6 flex justify-start'>
									<Pagination>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious
													onClick={e => {
														e.preventDefault();
														if (currentPage > 1)
															handlePageChange(currentPage - 1);
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
																handlePageChange(page);
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
															handlePageChange(currentPage + 1);
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