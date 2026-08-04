import { Edit2, Trash2, Star } from 'lucide-react';
import type { snippetCard } from '../../Home/Showcase';
import { Language } from '../../../ui/Language';
import { Link } from 'react-router-dom';

interface UserSnippetCardProps {
	snippet: snippetCard;
	onDelete: (id: string) => void;
	onEdit: (id: string) => void;
}

export const UserSnippetCard = ({
	snippet,
	onDelete,
	onEdit,
}: UserSnippetCardProps) => {
	return (
		<div className='w-full bg-[#0b1220] border border-[#19202f] rounded-3xl p-6 flex flex-col justify-between transition-all hover:border-[#252e44] hover:shadow-lg hover:shadow-[#000000]/40 group'>
			{/* Верхняя секция: Тег языка + Звезды */}
			<div>
				<div className='flex items-center justify-between mb-4'>
					{/* Бейдж языка */}
					<Language
						language={snippet.languages?.name}
						icon={snippet.languages?.icon}
						background={snippet.languages?.background}
						color={snippet.languages?.color}
						borderColor={snippet.languages?.borderColor}
					/>

					{/* Звёзды */}
					<div className='flex items-center gap-1.5 text-[#94a3b8] font-semibold bg-[#0c1321] px-2.5 py-1 rounded-xl border border-[#19202f]'>
						<span>{snippet.stars_count || 0}</span>
						<Star className='w-4 fill-[#EAB308] text-[#EAB308]' />
					</div>
				</div>

				{/* Заголовок */}
				<h3 className='text-white font-extrabold text-2xl mb-2 line-clamp-1 group-hover:text-[#38BDF8] transition-colors'>
					{snippet.title}
				</h3>

				{/* Описание */}
				<p className='text-[#94A3B8] line-clamp-2 leading-relaxed mb-6 font-normal'>
					{snippet.description || 'No description provided'}
				</p>
			</div>

			{/* Нижняя секция: Дата и Кнопки действий */}
			<div className='pt-4 border-t border-[#19202f] flex items-center justify-between'>
				<span className='text-sm text-[#64748b] font-medium'>
					Updated{' '}
					{snippet.created_at
						? new Date(snippet.created_at).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric',
							})
						: 'recently'}
				</span>

				<div className='flex items-center gap-2'>
					{/* Кнопка Редактировать */}
					<Link to={`/editSnippet/${snippet.id}`}>
						<button
							onClick={() => onEdit(snippet.id)}
							className='flex items-center gap-1.5 text-xs font-bold text-[#CBD5E1] bg-[#151a29] border border-[#2a3040] rounded-xl px-3.5 py-2 cursor-pointer transition-all hover:bg-[#1c2336] hover:text-white hover:border-[#3b4760]'
						>
							<Edit2 className='w-3.5 h-3.5 text-[#38BDF8]' />
							<button>Edit</button>
						</button>
					</Link>

					{/* Кнопка Удалить */}
					<button
						onClick={() => onDelete(snippet.id)}
						title='Delete snippet'
						className='flex items-center justify-center w-8 h-8 rounded-xl bg-[#151a29] border border-[#2a3040] text-[#94a3b8] cursor-pointer transition-all hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
					>
						<Trash2 className='w-3.5 h-3.5' />
					</button>
				</div>
			</div>
		</div>
	);
};
