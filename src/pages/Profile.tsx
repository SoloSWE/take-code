import { useEffect, useState } from 'react';

import type { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

import { Bookmark, Code2, FolderClosed } from 'lucide-react';

import { ProfileAbout } from '../components/features/ProfileAbout';
import { ProfileSettings } from '../components/features/ProfileSettings';
import { ProfileFeaturedSnippets } from '../components/features/ProfileFeaturedSnippets';
import type { snippetCard } from '../components/features/Showcase';

import { ProflieAboutLoader } from '../components/ui/Loaders/ProflieAboutLoader';
import { ProfileFeaturedSnippetsLoader } from '../components/ui/Loaders/ProfileFeaturedSnippetsLoader';
import { cn } from '../utils/cn';
import { UserSnippetsList } from '../components/features/UserSnippetsList';
import { Link } from 'react-router-dom';


export interface SocialMedia {
	id: number;
	name: string;
	link: string;
}

export interface UserProfile {
	id: string;
	avatar_url: string;
	username: string;
	display_name: string;
	about: string;
	speciality: string;
	tag: string;
	social_medias: SocialMedia[];
}

export const Profile = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [featuredSnippets, setFeaturedSnippets] = useState<snippetCard[] | null>(null);

	const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
	const [selectedCategory, setSelectedCategory] =
		useState<string>('My Snippets');

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

	useEffect(() => {
		// 🛑 Не делаем запрос, пока user еще не загрузился!
		if (!user?.id) return;

		async function fetchFeaturedSnippets() {
			setLoading(true);
			try {
				const { data } = await supabase
					.from('snippets')
					.select('*, profiles(avatar_url, tag, username)')
					.order('stars_count', { ascending: false })
					.eq('user_id', user?.id)
					.limit(2);

				setFeaturedSnippets(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchFeaturedSnippets();
	}, [user?.id]); 

	const handleSelectedCategory = (category: string) => {
		setSelectedCategory(category);
	}

	return (
		<section className='w-full mx-auto py-6 px-10'>
			<div className='flex gap-4 w-full bg-[#0c1321] border border-[#252d3c] rounded-4xl px-4.5 py-4.5 max-[965px]:flex-col'>
				{/* 1. ЛЕВАЯ КОЛОНКА (Она задаёт естественную высоту всему контейнеру!) */}
				<div className='w-1/2 bg-[#080e1d] border border-[#19202f] rounded-3xl flex flex-col gap-5 px-8 py-9 max-[965px]:w-full hover:border-[#252e44] hover:ring-[#252e44]'>
					{loading ? (
						<ProflieAboutLoader />
					) : (
						<ProfileAbout
							userProfile={userProfile}
							onOpenSettings={() => setIsSettingsOpen(true)}
						/>
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
			<div className='bg-[#090f22] border border-[#20273b] mt-8 rounded-3xl px-3 py-3'>
				<div className='flex items-center justify-between'>
					<div className='flex'>
						<ul className='flex gap-3'>
							<li
								onClick={() => handleSelectedCategory('My Snippets')}
								className={cn(
									'flex items-center bg-[#13182b] border border-[#20273a] px-4 py-3 gap-3 text-[#94a3b8] text-[16px] rounded-2xl cursor-pointer transition-colors',
									selectedCategory === 'My Snippets' &&
										'bg-[#252d3c] text-white',
								)}
							>
								<Code2 size={20} />
								My Snippets
							</li>
							<li
								onClick={() => handleSelectedCategory('Collections')}
								className={cn(
									'flex items-center bg-[#13182b] border border-[#20273a] px-4 py-3 gap-3 text-[#94a3b8] text-[16px] rounded-2xl cursor-pointer',
									selectedCategory === 'Collections' &&
										'bg-[#252d3c] text-white',
								)}
							>
								<FolderClosed size={20} />
								Collections
							</li>
							<li
								onClick={() => handleSelectedCategory('Saved / Bookmarks')}
								className={cn(
									'flex items-center bg-[#13182b] border border-[#20273a] px-4 py-3 gap-3 text-[#94a3b8] text-[16px] rounded-2xl cursor-pointer',
									selectedCategory === 'Saved / Bookmarks' &&
										'bg-[#252d3c] text-white',
								)}
							>
								<Bookmark size={20} />
								Saved / Bookmarks
							</li>
						</ul>
					</div>
					<div className='flex items-center gap-4'>
						<p className='text-[#64748b] font-mono text-[16px]'>
							128 published
						</p>
						<Link to={'/createSnippet'}>
							<button className='w-full h-auto px-5 py-3 rounded-xl bg-linear-to-br from-[#38BDF8] to-[#34D399] font-bold cursor-pointer max-[640px]:w-full max-sm:w-75 text-[#13182b] active:scale-98 transition-transform'>
								New Snippet
							</button>
						</Link>
					</div>
				</div>
			</div>

			<UserSnippetsList />

			{isSettingsOpen && (
				<ProfileSettings onClose={() => setIsSettingsOpen(false)} user={user} />
			)}
		</section>
	);
};
