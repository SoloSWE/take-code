import { useEffect, useState } from 'react';

import { cn } from '../../utils/cn';

import { supabase } from '../../utils/supabase';
import { FeaturCards } from './FeaturCards';
import { Snippets } from './Snippets';

const categories = [
	{
		id: 1,
		name: 'Trending',
		color: '#bae6fd',
		bg: '#142b43',
		borderColor: '#1e5475',
	},
	{
		id: 2,
		name: 'Most Copied',
		color: '#ddd6fe',
		bg: '#1b1936',
		borderColor: '#342359',
	},
	{
		id: 3,
		name: 'Recent',
		color: '#fde68a',
		bg: '#242321',
		borderColor: '#4f4221',
	},
];

export type dependencyT = {
	id: string;
	name: string;
	install_command: string;
	color: string;
	bg: string;
	border_color: string;
};

export interface snippetCard {
	id: string;
	user_id: string;
	language_id: string;
	framework_id?: string;
	title: string;
	description: string;
	readme: string;
	code: string;
	tags: string[];
	stars_count: number;
	snippet_stars?: { user_id: string }[];
	is_starred_by_user?: boolean;
	copied_count: number;
	dependencies?: { dependencies: dependencyT }[];
	languages?: {
		name: string;
		icon: string;
		background: string;
		color: string;
		borderColor: string;
	} | null;
	profiles?: {
		tag: string;
		avatar_url: string;
	} | null;
	created_at: string | null;
	updated_at: string | null;
}

export const Showcase = () => {
	const [snippetsCards, setSnippetsCards] = useState<snippetCard[] | null>(
		null,
	);

	const [active, setActive] = useState<number>(1);
	const [activeSnippetCategory, setActiveSnippetCategory] =
		useState<string>('Trending');

	const setActivesRules = (id: number, snippetCategory: string) => {
		if (activeSnippetCategory === snippetCategory) return;

		setActive(id);
		setActiveSnippetCategory(snippetCategory);
		setSnippetsCards(null);
	};

	useEffect(() => {
		const fetchSnippets = async () => {
			setSnippetsCards(null);

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const currentUserId = user?.id;

			let query = supabase.from('snippets').select(`
                *,
                languages(name, color, background, borderColor, icon),
                profiles:user_id(tag, avatar_url),
                snippets_stars(user_id)
            `);

			if (currentUserId) {
				query = query.eq('snippets_stars.user_id', currentUserId);
			}

			if (activeSnippetCategory === 'Trending') {
				query = query.order('stars_count', { ascending: false }).limit(4);
			} else if (activeSnippetCategory === 'Most Copied') {
				query = query.order('copied_count', { ascending: false }).limit(4);
			} else if (activeSnippetCategory === 'Recent') {
				query = query.order('created_at', { ascending: false }).limit(4);
			}

			const { data, error } = await query;

			if (!error && data) {
				const formattedData = data.map(item => {
					const hasStarred =
						Array.isArray(item.snippets_stars) &&
						item.snippets_stars.some(
							(star: { user_id: string }) => star.user_id === currentUserId,
						);

					return {
						...item,
						is_starred_by_user: Boolean(hasStarred),
					};
				});

				setSnippetsCards(formattedData);
			}
		};

		fetchSnippets();
	}, [activeSnippetCategory]);

	return (
		<section className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 flex flex-col gap-12 sm:gap-16 lg:gap-24'>
			{/* Верхняя часть с карточками фич */}
			<div className='w-full flex flex-col items-center'>
				<h2 className='text-white font-extrabold text-3xl sm:text-5xl md:text-6xl text-center leading-tight max-w-4xl'>
					Find battle-tested code without the noise.
				</h2>

				<p className='text-[#94A3B8] text-center font-normal text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 max-w-2xl leading-relaxed'>
					TakeCode keeps reusable snippets organized, verified, and instantly
					copyable so teams can skip boilerplate and focus on shipping.
				</p>

				<div className='w-full mt-8 sm:mt-12 lg:mt-15'>
					<FeaturCards />
				</div>
			</div>

			{/* Нижняя часть со сниппетами */}
			<div className='w-full flex flex-col items-start'>
				<h2 className='text-white font-extrabold text-3xl sm:text-5xl md:text-6xl text-left leading-tight'>
					Explore what developers are copying now.
				</h2>

				<div className='w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3 sm:mt-4'>
					<p className='text-[#94A3B8] text-left font-normal text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed'>
						Browse reusable snippets with readable summaries, community proof,
						and clean copy controls.
					</p>

					{/* Категории (табы с горизонтальным скроллом на мобилках) */}
					<div className='w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar'>
						<ul className='flex gap-2 sm:gap-3 whitespace-nowrap min-w-max'>
							{categories.map(category => (
								<li
									key={category.id}
									className={cn(
										'flex items-center justify-center gap-2 rounded-3xl border font-bold text-sm sm:text-base lg:text-lg cursor-pointer px-3.5 sm:px-4 py-1 sm:py-1.5 transition-colors duration-300 ease-in-out',
										active !== category.id &&
											'bg-[#1b2335] border-[#2f374a] text-[#94a3b8] hover:bg-[#131825] hover:border-[#282e3c] hover:text-[#7b8695]',
									)}
									style={
										active === category.id
											? {
													backgroundColor: `${category.bg}`,
													borderColor: `${category.borderColor}`,
													color: `${category.color}`,
												}
											: {}
									}
									onClick={() => setActivesRules(category.id, category.name)}
								>
									{category.name}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Сетка карточек */}
				<div className='w-full mt-6 sm:mt-8'>
					<Snippets
						snippets={snippetsCards}
						activeSnippetCategory={activeSnippetCategory}
					/>
				</div>
			</div>
		</section>
	);
};