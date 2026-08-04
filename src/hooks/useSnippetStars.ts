import { supabase } from "../utils/supabase";
import type { snippetCard } from "../components/features/Home/Showcase";

export const useSnippetStars = (
	setSnippetsCards: React.Dispatch<React.SetStateAction<snippetCard[] | null>>,
) => {
	const handleToggleStar = async (snippetId: string, isStarred: boolean) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert('Пожалуйста, авторизуйтесь, чтобы ставить лайки!');
			return;
		}

		// 1. Мгновенно обновляем UI (Optimistic update)
		setSnippetsCards(
			prev =>
				prev?.map(snippet => {
					if (snippet.id === snippetId) {
						return {
							...snippet,
							is_starred_by_user: !isStarred,
							stars_count: isStarred
								? Math.max(0, snippet.stars_count - 1)
								: snippet.stars_count + 1,
						};
					}
					return snippet;
				}) || null,
		);

		// 2. Делаем запрос к БД
		if (isStarred) {
			const { error } = await supabase
				.from('snippets_stars')
				.delete()
				.eq('snippet_id', snippetId)
				.eq('user_id', user.id);

			if (error) console.error('Ошибка при удалении лайка:', error);
		} else {
			const { error } = await supabase
				.from('snippets_stars')
				.upsert(
					{ snippet_id: snippetId, user_id: user.id },
					{ onConflict: 'user_id, snippet_id' },
				);

			if (error) console.error('Ошибка при добавлении лайка:', error);
		}
	};

	return { handleToggleStar };
};