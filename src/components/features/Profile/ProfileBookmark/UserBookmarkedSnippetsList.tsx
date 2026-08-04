import { useEffect, useState } from 'react';
import { supabase } from '../../../../utils/supabase';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../../ui/Pagination/pagination';
import { SnippetSkeleton } from '../../../ui/Skeletons/SnippetSkeleton'; // или твой скелетон
import type { snippetCard } from '../../Home/Showcase';
import { UserBookmarkedSnippetsCard } from './UserBookmarkedSnippetsCard';
import { toast } from 'sonner';

type BookmarkedSnippet = {
	id: string;
	user_id: string;
	created_at: string;
	snippet_id: snippetCard;
};

export const UserBookmarkedSnippetsList = () => {
	const [snippets, setSnippets] = useState<BookmarkedSnippet[] | null>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);

	const pageSize = 6;
	const totalPages = Math.ceil(totalCount / pageSize);

	useEffect(() => {
		async function fetchBookmarkedSnippets() {
			setLoading(true);
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) return;

				const from = (currentPage - 1) * pageSize;
				const to = from + pageSize - 1;

				const { data, count, error } = await supabase
					.from('bookmarks')
					.select(
						'*, snippet_id(*, languages(name, color, background, borderColor, icon), profiles:user_id(tag, avatar_url), snippets_stars(user_id))',
						{ count: 'exact' },
					)
					.eq('user_id', user.id)
					.order('created_at', { ascending: false })
					.range(from, to);

				if (error) throw error;

				if (count !== null) setTotalCount(count);

				setSnippets(data || []);
                console.log(data)
			} catch (error) {
				toast.error('Ошибка при загрузке сниппетов.');
				console.error('Ошибка при загрузке сниппетов:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchBookmarkedSnippets();
	}, [currentPage]);

	if (loading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
				<SnippetSkeleton />
				<SnippetSkeleton />
				<SnippetSkeleton />
			</div>
		);
	}

	if (snippets?.length === 0) {
		return (
			<div className='w-full py-12 text-center text-[#94a3b8] bg-[#080e1d] border border-[#19202f] rounded-3xl mt-6'>
				У вас пока нет сохраненных сниппетов.
			</div>
		);
	}

	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
				{snippets?.map(snippet => (
					<UserBookmarkedSnippetsCard
						key={snippet.id}
						snippet={snippet}
					/>
				))}
			</div>
			{totalPages > 1 && (
				<div className='mt-6 flex justify-start'>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={e => {
										e.preventDefault();
										if (currentPage > 1) setCurrentPage(prev => prev - 1);
									} }
									className={currentPage === 1 ? 'pointer-events-none opacity-40' : ''} size={undefined}								/>
							</PaginationItem>

							{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
								<PaginationItem key={page}>
									<PaginationLink
										isActive={page === currentPage}
										onClick={e => {
											e.preventDefault();
											setCurrentPage(page);
										} } size={undefined}									>
										{page}
									</PaginationLink>
								</PaginationItem>
							))}

							<PaginationItem>
								<PaginationNext
									onClick={e => {
										e.preventDefault();
										if (currentPage < totalPages)
											setCurrentPage(prev => prev + 1);
									} }
									className={currentPage === totalPages
										? 'pointer-events-none opacity-40'
										: ''} size={undefined}								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</>
	);
};