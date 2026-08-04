import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'sonner';


export const MainLayout = () => {
	return (
		<div className='flex flex-col min-h-screen'>
			<Header />

			<div className='grow'>
				<Outlet />
			</div>

			<Toaster
				position='top-right'
				toastOptions={{
					style: {
						background: '#0b1220',
						color: '#FFFFFF',
						borderColor: '#222b3e',
					},
				}}
			/>
			<Footer />
		</div>
	);
};