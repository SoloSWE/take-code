import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../utils/supabase";
import { cn } from "../../utils/cn";

import { useCloseDropdown } from '../../hooks/useCloseDropDown'
import type { UserProfile } from "../../pages/Profile";

import { LogOut, User } from "lucide-react";

interface User {
    user: UserProfile | null;
}

export const AuntatificatedUserMenu = ({ user }: User) => {
	const navigate = useNavigate();
	const menuRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState<boolean>(false)
	
    const signOut = () => {
		supabase.auth.signOut();
		navigate('/')
	}
	
	useCloseDropdown(menuRef, active, setActive);

	return (
		<div ref={menuRef} className='relative z-100'>
			<button
				className='flex items-center gap-2 cursor-pointer'
				onClick={() => setActive(prev => !prev)}
			>
				<span className='text-white font-bold'>
					{user?.display_name}
				</span>
				<div>
					{user?.avatar_url === undefined ? (
						<img
							className='w-9 h-9 rounded-3xl'
							src='https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80'
							alt=''
						/>
					) : (
						<img
							className='w-9 h-9 rounded-3xl'
							src={user?.avatar_url}
							alt=''
						/>
					)}
				</div>
			</button>
			<div
				className={cn(
					'bg-[#090f22] border border-[#22293d] rounded-xl absolute mt-2 w-full h-auto transition-all ease-in-out duration-300',
					active ? 'opacity-100 visible' : 'opacity-0 invisible',
				)}
			>
				<ul>
					<Link to={'/profile'}>
						<li className='flex items-center gap-2 text-[#94A3B8] px-4 p-3 cursor-pointer transition-colors hover:text-white'>
							<User size={19} />
							Profile
						</li>
					</Link>
					<li
						onClick={signOut}
						className='flex items-center gap-2 text-[#94A3B8] px-4 p-3 cursor-pointer rounded-b-2xl transition-colors hover:text-white border-t border-[#22293d]'
					>
						<LogOut size={18} />
						Exit
					</li>
				</ul>
			</div>
		</div>
	);
};
