import { ArrowRight, Star } from 'lucide-react';
import type { snippetCard } from './Showcase';
import { Language } from '../ui/Language';
import { Link } from 'react-router-dom';

type UserBookmarkedSnippetsCardProps = {
    id: string;
    user_id: string;
    snippet_id: snippetCard;
    created_at: string;
}

interface UserSnippetCardProps {
    snippet: UserBookmarkedSnippetsCardProps;
}

export const UserBookmarkedSnippetsCard = ({ snippet }: UserSnippetCardProps) => {
	return (
		<Link to={`/snippet/${snippet.snippet_id.id}`}>
			<div className='w-full bg-[#0b1220] border border-[#19202f] rounded-3xl p-6 flex flex-col justify-between transition-all hover:border-[#252e44] hover:shadow-lg hover:shadow-[#000000]/40 group'>
				{/* Верхняя секция: Тег языка + Звезды */}
				<div>
					<div className='flex items-center justify-between mb-4'>
						{/* Бейдж языка */}
						<Language
							language={snippet.snippet_id?.languages?.name}
							icon={snippet.snippet_id?.languages?.icon}
							background={snippet.snippet_id?.languages?.background}
							color={snippet.snippet_id?.languages?.color}
							borderColor={snippet.snippet_id?.languages?.borderColor}
						/>

						{/* Звёзды */}
						<div className='flex items-center gap-1.5 text-[#94a3b8] font-semibold bg-[#0c1321] px-2.5 py-1 rounded-xl border border-[#19202f]'>
							<span>{snippet.snippet_id?.stars_count || 0}</span>
							<Star className='w-4 fill-[#EAB308] text-[#EAB308]' />
						</div>
					</div>

					{/* Заголовок */}
					<h3 className='text-white font-extrabold text-2xl mb-2 line-clamp-1 group-hover:text-[#38BDF8] transition-colors'>
						{snippet.snippet_id?.title || 'Untitled Snippet'}
					</h3>

					{/* Описание */}
					<p className='text-[#94A3B8] line-clamp-2 leading-relaxed mb-6 font-normal'>
						{snippet.snippet_id?.description || 'No description provided'}
					</p>
				</div>

				{/* Нижняя секция: Дата и Кнопки действий */}
				<div className='pt-4 border-t border-[#19202f] flex items-center justify-between'>
					<span className='text-sm text-[#64748b] font-medium transition-colors group-hover:text-white group-hover:font-semibold'>
						@{snippet.snippet_id?.profiles?.tag || 'Anonymous'}
					</span>
					<button className='px-4 py-2 font-bold cursor-pointer max-[640px]:w-full max-sm:w-75 text-[#64748b] group-hover:text-white active:scale-98 transition-transform'>
						Explore snippet
						<ArrowRight className='w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform' />
					</button>
				</div>
			</div>
		</Link>
	);
};