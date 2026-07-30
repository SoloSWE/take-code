import { AzureEntraGlobalSecureAccess } from '@thesvg/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileFeaturedSnippets } from '../components/features/ProfileFeaturedSnippets';
import { ProfileFeaturedSnippetsLoader } from '../components/ui/Loaders/ProfileFeaturedSnippetsLoader';
import { ProflieAboutLoader } from '../components/ui/Loaders/ProflieAboutLoader';
import { socialIconsMap } from '../mocks/mockData';
import { supabase } from '../utils/supabase';

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
	const [loading, setLoading] = useState<boolean>(true);
	const [user, setUser] = useState<UserProfile | null>(null);

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

	console.log(user);
	return (
		<section className='w-full py-6 px-10'>
			<div className='flex gap-4 w-full h-auto bg-[#0c1321] border border-[#252d3c] rounded-4xl px-4.5 py-4.5 max-[965px]:flex-col'>
				<div className='w-1/2 h-auto bg-[#080e1d] border border-[#19202f] rounded-3xl flex flex-col px-8 py-8 max-[965px]:w-full hover:border-[#252e44] hover:ring-[#252e44]'>
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
											128
										</h3>
										<p className='text-[#94A3B8] font-medium'>
											snippets shared
										</p>
									</div>
									<div className='w-full bg-[#0b1e27] border border-[#113b3a] rounded-2xl px-4 py-4'>
										<h3 className='text-[#34D399] text-3xl font-extrabold'>
											24.7k
										</h3>
										<p className='text-[#94A3B8] font-medium'>
											upvotes received
										</p>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
				<div className='w-1/2 h-auto bg-[#080e1d] border border-[#19202f] rounded-4xl px-8 py-8 max-[965px]:w-full hover:border-[#252e44] hover:ring-[#252e44]'>
					{loading ? <ProfileFeaturedSnippetsLoader /> : <ProfileFeaturedSnippets />}
				</div>
			</div>
		</section>
	);
};
