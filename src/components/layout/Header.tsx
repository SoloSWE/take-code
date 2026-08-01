import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'ahooks';

import { cn } from '../../utils/cn';
import { supabase } from '../../utils/supabase';
import type { User } from '@supabase/supabase-js';

import { Braces, Code2, Loader2, Search } from 'lucide-react';

import { AuntatificatedUserMenu } from '../features/AuntatificatedUserMenu';
import type { UserProfile } from '../../pages/Profile';

import { Input } from '../ui/Input';

// Тип для элементов быстрого поиска
type SearchResultSnippet = {
	id: string;
	title: string;
	languages?: {
		name: string;
	};
};

export const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [user, setUser] = useState<User | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	const [open, setOpened] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

	// Поиск и результатов
	const [searchQuery, setSearchQuery] = useState<string>('');
	const debouncedSearchQuery = useDebounce(searchQuery, { wait: 300 }); // Уменьшили задержку до 300ms для отклика

	const [searchResults, setSearchResults] = useState<SearchResultSnippet[]>([]);
	const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const searchRef = useRef<HTMLDivElement>(null);

	// 1. Авторизация
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user || null);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		if (user?.id) {
			async function fetchUser() {
				setLoading(true);
				try {
					const { data } = await supabase
						.from('profiles')
						.select('*')
						.eq('id', user?.id);

					if (data) {
						setUserProfile(data[0]);
					}
				} catch (error) {
					console.log(error);
				} finally {
					setLoading(false);
				}
			}
			fetchUser();
		}
	}, [user?.id]);

	// 2. Живой поиск по БД через Supabase
	useEffect(() => {
		const fetchSearchResults = async () => {
			const query = debouncedSearchQuery.trim();
			if (!query) {
				setSearchResults([]);
				setIsDropdownOpen(false);
				return;
			}

			setIsSearchLoading(true);
			setIsDropdownOpen(true);

			try {
				// Ищем по совпадению в названии (ilike = регистронезависимый поиск)
				const { data, error } = await supabase
					.from('snippets')
					.select('id, title, languages(name)')
					.ilike('title', `%${query}%`)
					.limit(5);

				if (error) {
					console.error('Ошибка поиска:', error);
					setSearchResults([]);
				} else {
					// Приводим тип через unknown
					setSearchResults((data as unknown as SearchResultSnippet[]) || []);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setIsSearchLoading(false);
			}
		};

		fetchSearchResults();
	}, [debouncedSearchQuery]);

	// 3. Закрытие выпадающего списка при клике вне поля поиска
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Переход на страницу сниппета
	const handleSelectSnippet = (id: string) => {
		setIsDropdownOpen(false);
		setSearchQuery('');
		navigate(`/snippet/${id}`); // Поменяй путь на свой формат роута (например /exploreHub/${id})
	};

	return (
		<header className='py-6 px-10 flex items-center justify-between border-b border-[#222b3e] max-lg:px-4'>
			<Link to={'/'}>
				<div className='flex items-center gap-3'>
					<div className='flex items-center justify-center w-11 h-11 rounded-xl bg-linear-to-br from-[#38BDF8] to-[#34D399] shadow-[0px_0px_15px_0px_#38BDF8] max-lg:w-9 max-lg:h-9'>
						<Braces className='text-[#03111F] max-lg:scale-90' />
					</div>
					<h1 className='text-3xl font-bold text-white max-lg:text-2xl'>
						TakeCode
					</h1>
				</div>
			</Link>

			{/* Контейнер поиска с относительно позиционированным выпадающим списком */}
			<div ref={searchRef} className='relative max-md:hidden'>
				<Input
					width={400}
					height={45}
					iconColor={'#64748b'}
					rounded={12}
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder={'Search snippets, UI components...'}
					placeholderColor={'#64748b'}
					otherClass='max-lg:w-60 max-lg:pr-5 max-lg:h-10'
				/>

				{/* Выпадающее меню с результатами */}
				{isDropdownOpen && (
					<div className='absolute left-0 top-13 w-full bg-[#0c1321] border border-[#222b3e] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden backdrop-blur-md'>
						{isSearchLoading ? (
							<div className='flex items-center justify-center py-6 text-[#64748b] gap-2'>
								<Loader2 className='w-4 h-4 animate-spin text-[#38BDF8]' />
								<span className='text-sm'>Поиск...</span>
							</div>
						) : searchResults.length > 0 ? (
							<ul className='flex flex-col gap-1'>
								{searchResults.map(snippet => (
									<li
										key={snippet.id}
										onClick={() => handleSelectSnippet(snippet.id)}
										className='flex items-center justify-between p-3 rounded-xl hover:bg-[#162032] cursor-pointer transition-colors group'
									>
										<div className='flex items-center gap-2.5 overflow-hidden'>
											<Code2 className='w-4 h-4 text-[#38BDF8] shrink-0' />
											<span className='text-sm font-medium text-slate-200 group-hover:text-white truncate'>
												{snippet.title}
											</span>
										</div>
										{snippet.languages?.name && (
											<span className='text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#1e293b] text-[#94A3B8] border border-[#334155] shrink-0'>
												{snippet.languages.name}
											</span>
										)}
									</li>
								))}
							</ul>
						) : (
							<div className='py-6 text-center text-sm text-[#64748b]'>
								Ничего не найдено по запросу "{searchQuery}"
							</div>
						)}
					</div>
				)}
			</div>

			<div className='flex items-center justify-between gap-4.5 max-[535px]:hidden'>
				<div className='hidden w-9 h-9 bg-[#090f22] rounded-xl max-md:flex items-center justify-center'>
					<Search color='#fff' size={20} />
				</div>
				<ul className='flex items-center gap-4.5'>
					<Link to='/exploreHub'>
						<li>
							<span
								className={cn(
									'text-[#94A3B8] cursor-pointer transition-colors hover:text-white',
									location.pathname === '/exploreHub' && 'text-white',
								)}
							>
								Explore
							</span>
						</li>
					</Link>
					<Link to='/community'>
						<li>
							<span
								className={cn(
									'text-[#94A3B8] cursor-pointer transition-colors hover:text-white',
									location.pathname === '/community' && 'text-white',
								)}
							>
								Community
							</span>
						</li>
					</Link>
				</ul>
				{loading ? (
					<div className='w-18 h-11 rounded-3xl bg-[#f8fafc20] animate-pulse'></div>
				) : user ? (
					<AuntatificatedUserMenu user={userProfile} />
				) : (
					<div className='flex gap-4.5'>
						<Link to={'/auth'}>
							<button className='w-18 h-11 rounded-3xl border border-[#f8fafc38] bg-[#f8fafc20] text-white font-semibold cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#131825] hover:border-[#282e3c] hover:text-[#aeb5c0]'>
								Login
							</button>
						</Link>
					</div>
				)}
			</div>

			<div className='hidden max-[535px]:flex items-center justify-center gap-3'>
				<div className='w-9 h-9 bg-[#090f22] rounded-xl flex items-center justify-center'>
					<Search color='#fff' size={20} />
				</div>
				<button
					onClick={() => setOpened(prev => !prev)}
					className='w-9 h-9 bg-[#090f22] rounded-xl relative flex flex-col items-center justify-center'
				>
					<span
						className={`w-5 h-0.5 bg-white mb-1.5 transition-all ${open ? 'absolute rotate-45 mt-1.5' : 'rotate-0'}`}
					></span>
					<span
						className={`w-5 h-0.5 bg-white transition-all ${open ? 'opacity-0' : 'opacity-100'}`}
					></span>
					<span
						className={`w-5 h-0.5 bg-white mt-1.5 transition-all ${open ? 'absolute -rotate-45 mb-1.5' : 'rotate-0'}`}
					></span>
				</button>
			</div>

			<div
				className={`absolute transition-all ${open ? 'visible w-full h-full bg-[#0f172a] left-0 top-21 border border-t-[#222b3e]' : 'h-0 hidden '} flex flex-col items-center justify-center px-4 z-100`}
			>
				<ul className='flex flex-col items-center gap-2 mb-4'>
					<li>
						<span className='text-[#94A3B8] text-xl cursor-pointer transition-colors hover:text-white'>
							Explore
						</span>
					</li>
					<li>
						<span className='text-[#94A3B8] text-xl cursor-pointer transition-colors hover:text-white'>
							Community
						</span>
					</li>
				</ul>
				{user ? (
					<AuntatificatedUserMenu user={userProfile} />
				) : (
					<div className='flex flex-col items-center gap-4.5 w-full'>
						<button className='w-full h-11 rounded-3xl border border-[#f8fafc38] bg-[#f8fafc20] text-white font-semibold cursor-pointer'>
							Login
						</button>
						<button className='w-full h-11 rounded-3xl bg-linear-to-br from-[#38BDF8] to-[#34D399] shadow-[0px_0px_10px_0px_#38BDF8] text-white font-semibold cursor-pointer'>
							Sign Up
						</button>
					</div>
				)}
			</div>
		</header>
	);
};