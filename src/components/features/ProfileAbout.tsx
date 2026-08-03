import { useRef } from 'react';
import { useHover } from 'ahooks';

import { Settings2 } from 'lucide-react';
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

export const ProfileAbout = ({
	userProfile,
	onOpenSettings,
	totalCreatedSnippets,
	snippetsCountCopy,
}: ProfileAboutProps) => {
	const profileRef = useRef(null);
	const isHovering = useHover(profileRef);

	return (
		<div
			ref={profileRef}
			className='group flex-1 h-full flex flex-col gap-4 sm:gap-5'
		>
			{/* Верхний блок: Аватар, Данные и Настройки */}
			<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
				<div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 flex-1 w-full'>
					{/* Аватар */}
					<div className='w-20 h-20 sm:w-25 sm:h-25 shrink-0'>
						{userProfile?.avatar_url ? (
							<img
								className='w-full h-full object-cover rounded-2xl sm:rounded-3xl'
								src={`${userProfile?.avatar_url}`}
								alt='avatar'
							/>
						) : (
							<img
								className='w-full h-full object-cover rounded-2xl sm:rounded-3xl'
								src='https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80'
								alt='default avatar'
							/>
						)}
					</div>

					{/* Имя и спец-ть */}
					<div className='min-w-0 flex-1 w-full'>
						<div className='flex items-center justify-between gap-2'>
							<h2 className='font-extrabold text-2xl sm:text-3xl text-white truncate'>
								{userProfile?.display_name || 'Anonymous'}
							</h2>

							{/* Кнопка настроек на мобилке рядом с именем */}
							<button
								onClick={onOpenSettings}
								className='sm:hidden text-[#94a3b8] hover:text-white transition-colors p-1'
								aria-label='Settings'
							>
								<Settings2 size={22} />
							</button>
						</div>

						<div className='text-[#94a3b8] flex flex-wrap items-center gap-2 mt-1 text-sm sm:text-base'>
							<span className='truncate'>
								@{userProfile?.tag || userProfile?.username}
							</span>
							<span>•</span>
							<span className='truncate'>
								{userProfile?.speciality || 'Developer'}
							</span>
						</div>
					</div>
				</div>

				{/* Кнопка настроек (для планшетов/десктопа) */}
				<div className='hidden sm:block shrink-0'>
					<button
						onClick={onOpenSettings}
						aria-label='Settings'
						className='p-1'
					>
						<Settings2
							className={cn(
								'cursor-pointer text-[#94a3b8] hover:text-white transition-all opacity-100 sm:opacity-0',
								isHovering && 'sm:opacity-100',
							)}
							size={25}
						/>
					</button>
				</div>
			</div>

			{/* Описание */}
			<p className='text-[#94A3B8] text-base sm:text-lg break-words'>
				{userProfile?.about || 'No description'}
			</p>

			{/* Соцсети */}
			<div>
				<ul className='flex items-center gap-2 sm:gap-3 flex-wrap'>
					{!userProfile?.social_medias ||
					userProfile.social_medias.length === 0 ? (
						<span className='text-[#94a3b8] text-sm sm:text-base'>
							No social media
						</span>
					) : (
						userProfile.social_medias.map((socialRaw, index) => {
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
										rel='noreferrer'
										className='flex items-center gap-2 text-[#CBD5E1] text-xs sm:text-sm font-semibold bg-[#151a29] border border-[#2a3040] rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer transition-colors hover:bg-[#1c2336] hover:text-white'
									>
										<IconComponent className='w-4 h-4 sm:w-5 sm:h-5 text-[#38BDF8]' />
										<span>{social.name}</span>
									</a>
								</li>
							);
						})
					)}
				</ul>
			</div>

			{/* Статистика – прижата к низу */}
			<div className='w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-auto'>
				<div className='w-full bg-[#0b1c2e] border border-[#12354f] rounded-2xl p-3.5 sm:p-4'>
					<h3 className='text-[#38BDF8] text-2xl sm:text-3xl font-extrabold'>
						{totalCreatedSnippets}
					</h3>
					<p className='text-[#94A3B8] text-sm sm:text-base font-medium'>
						created snippets
					</p>
				</div>
				<div className='w-full bg-[#0b1e27] border border-[#113b3a] rounded-2xl p-3.5 sm:p-4'>
					<h3 className='text-[#34D399] text-2xl sm:text-3xl font-extrabold'>
						{snippetsCountCopy.toLocaleString()}
					</h3>
					<p className='text-[#94A3B8] text-sm sm:text-base font-medium'>
						total copies
					</p>
				</div>
			</div>
		</div>
	);
};
