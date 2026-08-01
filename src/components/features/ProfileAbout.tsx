import { useRef } from 'react';
import { useHover } from 'ahooks'

import { Settings2 } from 'lucide-react'
import { AzureEntraGlobalSecureAccess } from '@thesvg/react';

import { cn } from '../../utils/cn';
import { socialIconsMap } from '../../mocks/mockData';

import type { SocialMedia, UserProfile } from '../../pages/Profile';


interface ProfileAboutProps {
	userProfile: UserProfile | null;
	onOpenSettings: () => void;
	totalCreatedSnippets: number;
	snippetsCountCopy: number;
}

export const ProfileAbout = ({ userProfile, onOpenSettings, totalCreatedSnippets, snippetsCountCopy }: ProfileAboutProps) => {
	const profileRef = useRef(null);
	const isHovering = useHover(profileRef);

	return (
		<div ref={profileRef} className='flex flex-col gap-5'>
			<div className='flex gap-4'>
				<div className='w-25 h-25'>
					{userProfile?.avatar_url ? (
						<img
							className='rounded-3xl'
							src={`${userProfile?.avatar_url}`}
							alt='avatar'
						/>
					) : (
						<img
							className='rounded-3xl'
							src='https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80'
							alt=''
						/>
					)}
				</div>
				<div className='w-full flex justify-between'>
					<div>
						<h2 className='font-extrabold text-3xl text-white'>
							{userProfile?.display_name}
						</h2>
						<div className='text-[#94a3b8] flex items-center gap-2 mt-1'>
							<span>@{userProfile?.tag || userProfile?.username}</span>
							<span className='text-[#94a3b8]'>•</span>
							<span>{userProfile?.speciality || 'Developer'}</span>
						</div>
					</div>
					<div>
						<span>
							<Settings2
								onClick={onOpenSettings}
								className={cn(
									'cursor-pointer text-[#94a3b8] transition-opacity opacity-0',
									isHovering && 'opacity-100',
								)}
								size={25}
							/>
						</span>
					</div>
				</div>
			</div>
			<p className='text-[#94A3B8] text-lg'>
				{userProfile?.about || 'No description'}
			</p>
			<div>
				<ul className='flex items-center gap-3 flex-wrap'>
					{userProfile?.social_medias === null ? (
						<span className='text-[#94a3b8] text-lg'>No social media</span>
					) : ((userProfile?.social_medias || []).map((socialRaw, index) => {
							// Если это строка, парсим её в объект. Если уже объект — оставляем как есть.
							let social: SocialMedia;
							try {
								social =
									typeof socialRaw === 'string'
										? JSON.parse(socialRaw)
										: socialRaw;
							} catch (e) {
								console.error('Ошибка парсинга social_media:', e);
								return null;
							}

							if (!social || !social.name) return null;

							const IconComponent =
								socialIconsMap[social.name] || AzureEntraGlobalSecureAccess;

							return (
								<li key={social.id || index}>
									<a
										href={social.link}
										target='_blank'
										className='flex items-center gap-2 text-[#CBD5E1] text-sm font-semibold bg-[#151a29] border border-[#2a3040] rounded-3xl px-4 py-2 cursor-pointer transition-colors hover:bg-[#1c2336] hover:text-white'
									>
										<IconComponent className='w-5 h-5 text-[#38BDF8]' />
										<span>{social.name}</span>
									</a>
								</li>
							);
						})
					)}
				</ul>
			</div>
			<div className='w-full h-auto flex items-center gap-4 mt-2'>
				<div className='w-full bg-[#0b1c2e] border border-[#12354f] rounded-2xl px-4 py-4'>
					<h3 className='text-[#38BDF8] text-3xl font-extrabold'>{totalCreatedSnippets}</h3>
					<p className='text-[#94A3B8] font-medium'>created snippets</p>
				</div>
				<div className='w-full bg-[#0b1e27] border border-[#113b3a] rounded-2xl px-4 py-4'>
					<h3 className='text-[#34D399] text-3xl font-extrabold'>{snippetsCountCopy.toLocaleString()}</h3>
					<p className='text-[#94A3B8] font-medium'>upvotes copies</p>
				</div>
			</div>
		</div>
	);
};