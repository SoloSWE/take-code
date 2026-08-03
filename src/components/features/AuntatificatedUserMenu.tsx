import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, ChevronDown } from 'lucide-react';

import { supabase } from '../../utils/supabase';
import { cn } from '../../utils/cn';
import { useCloseDropdown } from '../../hooks/useCloseDropDown';
import type { UserProfile } from '../../pages/Profile';

interface AuntatificatedUserMenuProps {
	user: UserProfile | null;
}

export const AuntatificatedUserMenu = ({
	user,
}: AuntatificatedUserMenuProps) => {
	const navigate = useNavigate();
	const menuRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState<boolean>(false);

	const signOut = async () => {
		await supabase.auth.signOut();
		setActive(false);
		navigate('/');
	};

	useCloseDropdown(menuRef, active, setActive);

	const avatarSrc =
		user?.avatar_url ||
		'https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80';

	return (
		<div ref={menuRef} className='relative w-full sm:w-auto'>
			{/* Кнопка профиля */}
			<button
				onClick={() => setActive(prev => !prev)}
				className='w-full sm:w-auto flex items-center justify-between gap-3 p-2.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition-all active:scale-95 group cursor-pointer'
			>
				<div className='flex items-center gap-2.5 min-w-0'>
					<div className='relative shrink-0'>
						<img
							className='w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-[#38BDF8]/40 group-hover:ring-[#38BDF8] transition-all'
							src={avatarSrc}
							alt={user?.display_name || 'User Avatar'}
						/>
						<span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0f172a]' />
					</div>

					<div className='flex flex-col text-left truncate'>
						<span className='text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white truncate'>
							{user?.display_name || 'Developer'}
						</span>
						<span className='text-[10px] text-slate-400 sm:hidden'>
							Logged in
						</span>
					</div>
				</div>

				<ChevronDown
					className={cn(
						'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
						active && 'transform rotate-180 text-[#38BDF8]',
					)}
				/>
			</button>

			{/* Раскрывающийся контент */}
			<AnimatePresence>
				{active && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						/* На мобилках рендерится как встроенный блок (открывается вниз прямо в меню), а на ПК как выпадающая карточка сверху (absolute) */
						className='w-full sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-56 bg-[#0f172a]/95 sm:bg-[#0f172a] border border-slate-800 rounded-2xl sm:shadow-2xl overflow-hidden z-50 backdrop-blur-xl mt-2'
					>
						{/* Для ПК версии (шапка с ником) */}
						<div className='hidden sm:block p-3.5 border-b border-slate-800 bg-slate-900/50'>
							<p className='text-xs font-semibold text-slate-200 truncate'>
								{user?.display_name || 'Developer'}
							</p>
							<p className='text-[11px] text-slate-400 truncate mt-0.5'>
								Logged in
							</p>
						</div>

						{/* Список действий */}
						<ul className='p-1.5 flex flex-col gap-1'>
							<li>
								<Link
									to='/profile'
									onClick={() => setActive(false)}
									className='flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors'
								>
									<User className='w-4 h-4 text-[#38BDF8]' />
									<span>Profile</span>
								</Link>
							</li>

							<div className='my-0.5 h-px bg-slate-800' />

							<li>
								<button
									onClick={signOut}
									className='w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left'
								>
									<LogOut className='w-4 h-4' />
									<span>Sign Out</span>
								</button>
							</li>
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};