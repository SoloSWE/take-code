import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { supabase } from '../utils/supabase';
import { socialIconsMap } from '../mocks/mockData';

import { AzureEntraGlobalSecureAccess } from '@thesvg/react';

import { ProfileFeaturedSnippets } from '../components/features/ProfileFeaturedSnippets';
import { ProfileFeaturedSnippetsLoader } from '../components/ui/Loaders/ProfileFeaturedSnippetsLoader';
import { ProflieAboutLoader } from '../components/ui/Loaders/ProflieAboutLoader';
import type { snippetCard } from '../components/features/Showcase';

interface SocialMedia {
	id: number;
	name: string;
	link: string;
}

interface UserProfile {
	id: string;
	avatar_url: string;
	username: string;
	display_name: string;
	about: string;
	speciality: string;
	tag: string;
	social_medias: SocialMedia[];
}

export const PublicProfile = () => {
	const { id } = useParams<{ id: string }>();

	const [user, setUser] = useState<UserProfile | null>(null);
	const [featuredSnippets, setFeaturedSnippets] = useState<
		snippetCard[] | null
	>([]);
	const [snippetsCount, setSnippetsCount] = useState<number>(0);
	const [snippetsCountCopy, setSnippetsCountCopy] = useState<number>(0);

	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (id) {
			async function fetchUserProfile() {
				setLoading(true);
				try {
					const { data } = await supabase
						.from('profiles')
						.select('*')
						.eq('id', id)
						.single();

					setUser(data);
				} catch (error) {
					console.log(error);
				} finally {
					setLoading(false);
				}
			}

			fetchUserProfile();
		}
	}, [id]);

	useEffect(() => {
		if (!user?.id) return;

		async function fetchFeaturedSnippets() {
			setLoading(true);
			try {
				const [featuredSnippetsRes, snippetsCountRes] = await Promise.all([
					supabase
						.from('snippets')
						.select('*, profiles(avatar_url, tag, username)')
						.order('stars_count', { ascending: false })
						.eq('user_id', user?.id)
						.limit(2),
					supabase
						.from('snippets')
						.select('*, copied_count')
						.eq('user_id', user?.id),
				]);

				setFeaturedSnippets(featuredSnippetsRes.data || []);
				setSnippetsCount(snippetsCountRes.data?.length || 0);
				setSnippetsCountCopy(
					snippetsCountRes.data?.reduce(
						(acc, snippet) => acc + (snippet.copied_count || 0),
						0,
					) || 0,
				);
			} catch (error) {
				console.error('Error fetching featured snippets:', error);
				console.error('Error fetching snippet copies:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchFeaturedSnippets();
	}, [user?.id]);

	return (
		<section className='w-full max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-10'>
			<div className='flex flex-col lg:flex-row gap-4 w-full bg-[#0c1321] border border-[#252d3c] rounded-3xl sm:rounded-4xl p-3 sm:p-4.5'>
				{/* 1. ЛЕВАЯ КОЛОНКА (Информация о пользователе) */}
				<div className='w-full lg:w-1/2 bg-[#080e1d] border border-[#19202f] rounded-2xl sm:rounded-3xl flex flex-col gap-5 p-5 sm:p-7 lg:p-9 hover:border-[#252e44] transition-colors'>
					{loading ? (
						<ProflieAboutLoader />
					) : (
						<div className='flex flex-col gap-4'>
							{/* Аватар и Имя */}
							<div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
								<div className='w-20 h-20 sm:w-25 sm:h-25 shrink-0'>
									{user?.avatar_url ? (
										<img
											className='w-full h-full object-cover rounded-2xl sm:rounded-3xl'
											src={`${user?.avatar_url}`}
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

								<div className='min-w-0 flex-1'>
									<h2 className='font-extrabold text-2xl sm:text-3xl text-white truncate'>
										{user?.display_name || 'Anonymous'}
									</h2>
									<div className='text-[#94a3b8] flex flex-wrap items-center gap-2 mt-1 text-sm sm:text-base'>
										<span className='truncate'>
											@{user?.tag || user?.username}
										</span>
										<span>•</span>
										<span className='truncate'>
											{user?.speciality || 'Developer'}
										</span>
									</div>
								</div>
							</div>

							{/* Описание */}
							<p className='text-[#94A3B8] text-base sm:text-lg wrap-break-words mt-1'>
								{user?.about || 'No description'}
							</p>

							{/* Социальные сети */}
							<div>
								<ul className='flex items-center gap-2 sm:gap-3 flex-wrap mt-2'>
									{!user?.social_medias || user.social_medias.length === 0 ? (
										<span className='text-[#94a3b8] text-sm sm:text-base'>
											No social media
										</span>
									) : (
										user.social_medias.map((socialRaw, index) => {
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
												socialIconsMap[social.name] ||
												AzureEntraGlobalSecureAccess;

											return (
												<a
													key={social.id || index}
													href={social.link}
													target='_blank'
													rel='noreferrer'
													className='flex items-center gap-2 text-[#CBD5E1] text-xs sm:text-sm font-semibold bg-[#151a29] border border-[#2a3040] rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer transition-colors hover:bg-[#1c2336] hover:text-white'
												>
													<IconComponent className='w-4 h-4 sm:w-5 sm:h-5 text-[#38BDF8]' />
													<span>{social.name}</span>
												</a>
											);
										})
									)}
								</ul>
							</div>

							{/* Статистика */}
							<div className='w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2 sm:mt-4'>
								<div className='w-full bg-[#0b1c2e] border border-[#12354f] rounded-2xl p-3.5 sm:p-4'>
									<h3 className='text-[#38BDF8] text-2xl sm:text-3xl font-extrabold'>
										{snippetsCount.toLocaleString()}
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
					)}
				</div>

				{/* 2. ПРАВАЯ КОЛОНКА (Популярные сниппеты) */}
				<div className='w-full lg:w-1/2 flex flex-col'>
					<div className='w-full h-full min-h-75 sm:min-h-90 bg-[#080e1d] border border-[#19202f] rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 hover:border-[#252e44] transition-colors overflow-hidden'>
						{loading ? (
							<ProfileFeaturedSnippetsLoader />
						) : (
							<ProfileFeaturedSnippets featuredSnippets={featuredSnippets} />
						)}
					</div>
				</div>
			</div>
		</section>
	);
};