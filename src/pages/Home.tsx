import { Hero } from '../components/features/Hero';
import { Showcase } from '../components/features/Showcase';
import { TrendingActivites } from '../components/features/TrendingActivites';

export const Home = () => {
	return (
		<main className='w-full min-h-screen flex flex-col gap-12 sm:gap-16 lg:gap-24 px-4 sm:px-6 lg:px-8 max-w-337.5 mx-auto sm:py-10'>
			<Hero />
			<Showcase />
			<TrendingActivites />
		</main>
	);
};