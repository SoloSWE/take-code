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
		// 🛑 Не делаем запрос, пока user еще не загрузился!
		if (!user?.id) return;

		async function fetchFeaturedSnippets() {
			setLoading(true);
			try {
				const [featuredSnippets, snippetsCount] = await Promise.all([
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

				setFeaturedSnippets(featuredSnippets.data || []);
				setSnippetsCount(snippetsCount.data?.length || 0);
				setSnippetsCountCopy(
					snippetsCount.data?.reduce(
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
		<section className='w-full py-6 px-10'>
			<div className='flex gap-4 w-full bg-[#0c1321] border border-[#252d3c] rounded-4xl px-4.5 py-4.5 max-[965px]:flex-col'>
				{/* 1. ЛЕВАЯ КОЛОНКА (Она задаёт естественную высоту всему контейнеру!) */}
				<div className='w-1/2 bg-[#080e1d] border border-[#19202f] rounded-3xl flex flex-col gap-5 px-8 py-9 max-[965px]:w-full hover:border-[#252e44] hover:ring-[#252e44]'>
					{loading ? (
						<ProflieAboutLoader />
					) : (
						<>
							<div>
								<div className='flex gap-4'>
									<div className='w-25 h-25'>
										{user?.avatar_url ? (
											<img
												className='rounded-3xl'
												src={`${user?.avatar_url}`}
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
												{user?.display_name}
											</h2>
											<div className='text-[#94a3b8] flex items-center gap-2 mt-1'>
												<span>@{user?.tag || user?.username}</span>
												<span className='text-[#94a3b8]'>•</span>
												<span>{user?.speciality || 'Developer'}</span>
											</div>
										</div>
									</div>
								</div>
								<p className='text-[#94A3B8] text-lg'>
									{user?.about || 'No description'}
								</p>
								<div>
									<ul className='flex items-center gap-3 flex-wrap mt-4'>
										{user?.social_medias === null ? (
											<span className='text-[#94a3b8] text-lg'>
												No social media
											</span>
										) : (
											(user?.social_medias || []).map((socialRaw, index) => {
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
													socialIconsMap[social.name] ||
													AzureEntraGlobalSecureAccess;

												return (
													<a
														key={social.id || index}
														href={social.link}
														target='_blank'
														className='flex items-center gap-2 text-[#CBD5E1] text-sm font-semibold bg-[#151a29] border border-[#2a3040] rounded-3xl px-4 py-2 cursor-pointer transition-colors hover:bg-[#1c2336] hover:text-white'
													>
														<IconComponent className='w-5 h-5 text-[#38BDF8]' />
														<span>{social.name}</span>
													</a>
												);
											})
										)}
									</ul>
								</div>
								<div className='w-full h-auto flex items-center gap-4 mt-4'>
									<div className='w-full bg-[#0b1c2e] border border-[#12354f] rounded-2xl px-4 py-4'>
										<h3 className='text-[#38BDF8] text-3xl font-extrabold'>
											{snippetsCount.toLocaleString()}
										</h3>
										<p className='text-[#94A3B8] font-medium'>
											created snippets
										</p>
									</div>
									<div className='w-full bg-[#0b1e27] border border-[#113b3a] rounded-2xl px-4 py-4'>
										<h3 className='text-[#34D399] text-3xl font-extrabold'>
											{snippetsCountCopy.toLocaleString()}
										</h3>
										<p className='text-[#94A3B8] font-medium'>total copies</p>
									</div>
								</div>
							</div>
						</>
					)}
				</div>

				{/* 2. ПРАВАЯ КОЛОНКА (Делаем relative, чтобы запереть правый блок внутри высоты левого) */}
				<div className='w-1/2 relative max-[965px]:w-full max-[965px]:min-h-100'>
					<div className='absolute inset-0 bg-[#080e1d] border border-[#19202f] rounded-4xl px-8 py-8 hover:border-[#252e44] hover:ring-[#252e44] overflow-hidden'>
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
