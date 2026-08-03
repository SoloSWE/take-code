import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'ahooks';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '../../utils/cn';
import { supabase } from '../../utils/supabase';
import type { User } from '@supabase/supabase-js';

import {
	Braces,
	Code2,
	Loader2,
	Search,
	X,
	Menu,
	Compass,
	Users,
	LogIn,
} from 'lucide-react';

import { AuntatificatedUserMenu } from '../features/AuntatificatedUserMenu';
import type { UserProfile } from '../../pages/Profile';
import { Input } from '../ui/Input';

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

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

	const [searchQuery, setSearchQuery] = useState<string>('');
	const debouncedSearchQuery = useDebounce(searchQuery, { wait: 300 });

	const [searchResults, setSearchResults] = useState<SearchResultSnippet[]>([]);
	const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

	const searchRef = useRef<HTMLDivElement>(null);

	// Блокировка скролла при открытом меню
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMobileMenuOpen]);

	// Сброс при смене маршрута
	const [prevPathname, setPrevPathname] = useState(location.pathname);
	if (prevPathname !== location.pathname) {
		setPrevPathname(location.pathname);
		setIsMobileMenuOpen(false);
		setIsMobileSearchOpen(false);
	}

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

					if (data && data.length > 0) {
						setUserProfile(data[0]);
					}
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			}
			fetchUser();
		}
	}, [user?.id]);

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
				const { data, error } = await supabase
					.from('snippets')
					.select('id, title, languages(name)')
					.ilike('title', `%${query}%`)
					.limit(5);

				if (error) {
					console.error('Ошибка поиска:', error);
					setSearchResults([]);
				} else {
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

	const handleSelectSnippet = (id: string) => {
		setIsDropdownOpen(false);
		setIsMobileSearchOpen(false);
		setIsMobileMenuOpen(false);
		setSearchQuery('');
		navigate(`/snippet/${id}`);
	};

	return (
		<header className='sticky top-0 z-50 w-full bg-[#0f172a] border-b border-slate-800 px-4 sm:px-6 lg:px-10 py-3.5 transition-all shadow-lg'>
			<div className='max-w-7xl mx-auto flex items-center justify-between gap-4'>
				{/* Logo */}
				<Link to={'/'} className='flex items-center gap-2.5 shrink-0 z-10'>
					<div className='flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#38BDF8] to-[#34D399] shadow-[0px_0px_15px_0px_rgba(56,189,248,0.25)]'>
						<Braces className='text-[#0f172a] w-5 h-5 sm:w-6 sm:h-6' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-black text-white tracking-tight'>
						TakeCode
					</h1>
				</Link>

				{/* Desktop Search */}
				<div
					ref={searchRef}
					className='relative hidden md:block flex-1 max-w-md mx-4 z-20'
				>
					<Input
						width={440}
						height={42}
						iconColor={'#64748b'}
						rounded={12}
						value={searchQuery}
						onChange={setSearchQuery}
						placeholder={'Search snippets, UI components...'}
						placeholderColor={'#64748b'}
						otherClass='w-full bg-slate-800/60 border-slate-700/60'
					/>

					{isDropdownOpen && (
						<div className='absolute left-0 top-12 w-full bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50'>
							{isSearchLoading ? (
								<div className='flex items-center justify-center py-6 text-slate-400 gap-2'>
									<Loader2 className='w-4 h-4 animate-spin text-[#38BDF8]' />
									<span className='text-sm'>Searching...</span>
								</div>
							) : searchResults.length > 0 ? (
								<ul className='flex flex-col gap-1'>
									{searchResults.map(snippet => (
										<li
											key={snippet.id}
											onClick={() => handleSelectSnippet(snippet.id)}
											className='flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors group'
										>
											<div className='flex items-center gap-2.5 overflow-hidden'>
												<Code2 className='w-4 h-4 text-[#38BDF8] shrink-0' />
												<span className='text-sm font-medium text-slate-200 group-hover:text-white truncate'>
													{snippet.title}
												</span>
											</div>
											{snippet.languages?.name && (
												<span className='text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50 shrink-0'>
													{snippet.languages.name}
												</span>
											)}
										</li>
									))}
								</ul>
							) : (
								<div className='py-6 text-center text-sm text-slate-400'>
									Nothing found
								</div>
							)}
						</div>
					)}
				</div>

				{/* Desktop Nav */}
				<div className='hidden md:flex items-center gap-6'>
					<nav className='flex items-center gap-5'>
						<Link
							to='/exploreHub'
							className={cn(
								'text-sm font-semibold text-slate-400 transition-colors hover:text-white',
								location.pathname === '/exploreHub' && 'text-white font-bold',
							)}
						>
							Explore
						</Link>
						<Link
							to='/community'
							className={cn(
								'text-sm font-semibold text-slate-400 transition-colors hover:text-white',
								location.pathname === '/community' && 'text-white font-bold',
							)}
						>
							Community
						</Link>
					</nav>

					<div className='h-5 w-px bg-slate-800' />

					{loading ? (
						<div className='w-20 h-9 rounded-2xl bg-slate-800 animate-pulse' />
					) : user ? (
						<AuntatificatedUserMenu user={userProfile} />
					) : (
						<Link to={'/auth'}>
							<button className='px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors active:scale-95'>
								Login
							</button>
						</Link>
					)}
				</div>

				{/* Mobile Buttons */}
				<div className='flex md:hidden items-center gap-2 z-10'>
					<button
						onClick={() => {
							setIsMobileSearchOpen(prev => !prev);
							setIsMobileMenuOpen(false);
						}}
						className='p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 active:scale-95'
					>
						<Search className='w-5 h-5 text-slate-300' />
					</button>

					<button
						onClick={() => {
							setIsMobileMenuOpen(prev => !prev);
							setIsMobileSearchOpen(false);
						}}
						className='p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 active:scale-95'
					>
						{isMobileMenuOpen ? (
							<X className='w-5 h-5 text-white' />
						) : (
							<Menu className='w-5 h-5 text-white' />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Search Input Dropdown */}
			<AnimatePresence>
				{isMobileSearchOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className='md:hidden px-1 pt-3 pb-2 relative z-50'
					>
						<div ref={searchRef} className='relative w-full'>
							<Input
								width={1000}
								height={42}
								iconColor={'#64748b'}
								rounded={12}
								value={searchQuery}
								onChange={setSearchQuery}
								placeholder={'Search snippets...'}
								placeholderColor={'#64748b'}
								otherClass='w-full bg-slate-800 border-slate-700'
							/>

							{isDropdownOpen && (
								<div className='absolute left-0 top-12 w-full bg-[#0f172a] border border-slate-800 rounded-xl shadow-2xl p-2 z-50'>
									{isSearchLoading ? (
										<div className='flex items-center justify-center py-4 text-slate-400 gap-2'>
											<Loader2 className='w-4 h-4 animate-spin text-[#38BDF8]' />
											<span className='text-xs'>Searching...</span>
										</div>
									) : searchResults.length > 0 ? (
										<ul className='flex flex-col gap-1'>
											{searchResults.map(snippet => (
												<li
													key={snippet.id}
													onClick={() => handleSelectSnippet(snippet.id)}
													className='flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer'
												>
													<span className='text-xs font-medium text-slate-200 truncate'>
														{snippet.title}
													</span>
													{snippet.languages?.name && (
														<span className='text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400'>
															{snippet.languages.name}
														</span>
													)}
												</li>
											))}
										</ul>
									) : (
										<div className='py-4 text-center text-xs text-slate-400'>
											Nothing found
										</div>
									)}
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Mobile Fullscreen Overlay Navigation */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						/* ВАЖНО: bg-[#0f172a] без прозрачности и z-[999], чтобы полностью закрыть страницу */
						className='fixed inset-x-0 top-16.25 bottom-0 bg-[#0f172a] z-999 flex flex-col justify-between p-6 md:hidden overflow-y-auto'
					>
						<div className='flex flex-col gap-6 mt-2'>
							<p className='text-xs font-semibold uppercase tracking-wider text-slate-400'>
								Navigation
							</p>
							<nav className='flex flex-col gap-3'>
								<Link
									to='/exploreHub'
									className={cn(
										'flex items-center gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/50 text-lg font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white',
										location.pathname === '/exploreHub' &&
											'bg-slate-800 border-slate-700 text-[#38BDF8]',
									)}
								>
									<Compass className='w-5 h-5' />
									Explore Hub
								</Link>
								<Link
									to='/community'
									className={cn(
										'flex items-center gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/50 text-lg font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white',
										location.pathname === '/community' &&
											'bg-slate-800 border-slate-700 text-[#38BDF8]',
									)}
								>
									<Users className='w-5 h-5' />
									Community
								</Link>
							</nav>
						</div>

						{/* Profile at bottom */}
						<div className='pt-6 border-t border-slate-800 mb-6'>
							{user ? (
								<div className='flex items-center justify-between p-2 rounded-2xl bg-slate-900 border border-slate-800'>
									<AuntatificatedUserMenu user={userProfile} />
								</div>
							) : (
								<Link to={'/auth'} className='w-full'>
									<button className='w-full py-3.5 rounded-2xl bg-linear-to-r from-[#38BDF8] to-[#34D399] text-[#0f172a] font-bold text-base active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10'>
										<LogIn className='w-5 h-5' />
										<span>Login / Sign Up</span>
									</button>
								</Link>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};