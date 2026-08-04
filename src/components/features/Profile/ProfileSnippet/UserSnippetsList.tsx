import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { UserSnippetCard } from './UserSnippetCard';

export const UserSnippetsList = () => {
	const navigate = useNavigate();
	const [snippets, setSnippets] = useState<snippetCard[] | null>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);

	const pageSize = 6;
	const totalPages = Math.ceil(totalCount / pageSize);

	useEffect(() => {
		async function fetchMySnippets() {
			setLoading(true);
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) return;

				const from = (currentPage - 1) * pageSize;
				const to = from + pageSize - 1;

				const { data, count, error } = await supabase
					.from('snippets')
					.select(
						'*, languages(name, color, background, borderColor, icon), profiles:user_id(tag, avatar_url), snippets_stars(user_id)',
						{ count: 'exact' },
					)
					.eq('user_id', user.id)
					.order('created_at', { ascending: false })
					.range(from, to);

				if (error) throw error;

				if (count !== null) setTotalCount(count);

				setSnippets(data || []);
			} catch (error) {
				console.error('Ошибка при загрузке сниппетов:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchMySnippets();
	}, [currentPage]);

	// Функция удаления
	const handleDelete = async (id: string) => {
		try {
			const { error } = await supabase.from('snippets').delete().eq('id', id);
			setSnippets(prev => (prev ?? []).filter(item => item.id !== id));
			if (error) throw error;
		} catch (error) {
			console.error('Ошибка при удалении:', error);
		}
	};

	// Переход на страницу редактирования
	const handleEdit = (id: string) => {
		navigate(`/edit-snippet/${id}`);
	};

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
				У вас пока нет созданных сниппетов.
			</div>
		);
	}

	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
				{snippets?.map(snippet => (
					<UserSnippetCard
						key={snippet.id}
						snippet={snippet}
						onDelete={() => handleDelete(snippet.id)}
						onEdit={handleEdit}
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
