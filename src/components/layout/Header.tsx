import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Braces, Search } from 'lucide-react';

import type { User } from '@supabase/supabase-js';
import { supabase } from '../../utils/supabase';

import { Input } from '../ui/Input';

import { AuntatificatedUserMenu } from '../features/AuntatificatedUserMenu';
import type { UserProfile } from '../../pages/Profile';
import { cn } from '../../utils/cn';

export const Header = () => {
	const location = useLocation()
	const [user, setUser] = useState<User | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [open, setOpened] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState<string>('');

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

			<div className='max-md:hidden'>
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
			</div>

			<div className='flex items-center justify-between gap-4.5 max-[535px]:hidden'>
				<div className='hidden w-9 h-9 bg-[#090f22] rounded-xl max-md:flex items-center justify-center'>
					<Search color='#fff' size={20} />
				</div>
				<ul className='flex items-center gap-4.5'>
					<Link to='/exploreHub'>
						<li>
							<span className={cn('text-[#94A3B8] cursor-pointer transition-colors hover:text-white', location.pathname === '/exploreHub' && 'text-white')}>
								Explore
							</span>
						</li>
					</Link>
					<Link to='/community'>
						<li>
							<span className={cn('text-[#94A3B8] cursor-pointer transition-colors hover:text-white', location.pathname === '/community' && 'text-white')}>
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
