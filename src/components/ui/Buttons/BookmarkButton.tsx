import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { supabase } from '../../../utils/supabase';

interface BookmarkButtonProps {
	snippetId: string;
	userId: string | null;
}

export const BookmarkButton = ({ snippetId, userId }: BookmarkButtonProps) => {
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!userId || !snippetId) return;

		async function checkBookmarkStatus() {
			const { data, error } = await supabase
				.from('bookmarks')
				.select('id')
				.eq('user_id', userId)
				.eq('snippet_id', snippetId)
				.maybeSingle();

			if (!error && data) {
				setIsBookmarked(true);
			}
		}

		checkBookmarkStatus();
	}, [snippetId, userId]);

	const handleToggleBookmark = async () => {
		if (!userId) {
			alert('Авторизуйтесь, чтобы добавлять сниппеты в избранное');
			return;
		}

		setLoading(true);

		const previousState = isBookmarked;
		setIsBookmarked(!previousState);

		try {
			if (previousState) {
				const { error } = await supabase
					.from('bookmarks')
					.delete()
					.eq('user_id', userId)
					.eq('snippet_id', snippetId);

				if (error) throw error;
			} else {
				const { error } = await supabase
					.from('bookmarks')
					.insert({ user_id: userId, snippet_id: snippetId });

				if (error) throw error;
			}
		} catch (error) {
			console.error('Ошибка при изменении закладки:', error);
			setIsBookmarked(previousState);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleToggleBookmark}
			disabled={loading}
			className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
				isBookmarked
					? 'bg-[#2dd4bf]/10 border-[#2dd4bf] text-[#2dd4bf]'
					: 'bg-[#090f22] border-[#1b2333] text-slate-400 hover:text-white hover:border-slate-600'
			}`}
			title={isBookmarked ? 'Убрать из избранного' : 'Добавить в избранное'}
		>
			<Bookmark
				className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`}
			/>
		</button>
	);
};
