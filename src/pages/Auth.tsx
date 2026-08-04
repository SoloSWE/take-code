import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { supabase } from '../utils/supabase';
import { AuthLoader } from '../components/ui/Loaders/AuthLoader';

import { cn } from '../utils/cn';

import { Braces } from 'lucide-react';
import { Github, Google } from '@thesvg/react';
import { toast } from 'sonner';

export const Auth = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [username, setUsername] = useState('');
	const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (!isCreateMode) {
				// Вход по логину и паролю
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});

				
				if (error) throw error;
				
				toast.success('Вход выполнен успешно!');

				navigate('/');
			} else {
				// Регистрация
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							username,
							display_name: username,
						},
					},
				});

				if (error) throw error;

				// Если в Supabase включен Email Confirmation
				if (data?.user && data.session === null) {
					toast.info('Проверьте почту для подтверждения аккаунта!');
				} else {
					toast.success('Регистрация успешна!');
					navigate('/');
				}
			}
		} catch (error) {
			// Показываем реальное сообщение ошибки от Supabase на английском или понятный дефолт
			toast.error('Произошла ошибка при авторизации.');
			console.error('Auth error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const authWithGitHub = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'github',
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			});

			if (error) throw error;
		} catch (error) {
			toast.error('Ошибка авторизации через GitHub.');
			console.error('GitHub auth error:', error);
			setIsLoading(false);
		}
	};

	const authWithGoogle = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			});

			if (error) throw error;
		} catch (error) {
			toast.error('Ошибка авторизации через Google.');
			console.error('Google auth error:', error);
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full min-h-dvh flex flex-col xl:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16 px-4 py-8 max-w-7xl mx-auto'>
			{/* Левый промо-блок (скрывается на мобилках или аккуратно адаптируется) */}
			<div className='hidden lg:flex flex-col gap-4 max-w-xl text-left'>
				<div className='flex items-center gap-2 max-w-max px-4 py-2 bg-[#0e1d2a] border border-[#163d54] rounded-3xl'>
					<Braces className='text-[#67e8f9]' size={18} />
					<span className='text-[#baf2ff] text-xs sm:text-sm font-semibold tracking-wider'>
						AUTHENTICATION FLOW
					</span>
				</div>
				<div className='flex flex-col gap-4 mt-2'>
					<h1 className='font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight'>
						Developer-first access, wrapped in a calm dark interface.
					</h1>
					<p className='text-sm sm:text-base text-[#94a3b8c7] leading-relaxed'>
						A reusable TakeCode sign-in/sign-up component with priority OAuth
						actions, precise focus states, gradient primary action, and
						low-noise account switching.
					</p>
					<ul className='text-[#c4c9d1] flex flex-col gap-2 text-sm sm:text-base'>
						<li>• OAuth-first layout for GitHub and Google</li>
						<li>• Animated focus ring styling on email fields</li>
						<li>• Sign In and Sign Up variants ready to reuse</li>
					</ul>
				</div>
			</div>

			{/* Форма авторизации */}
			<form
				className='w-full max-w-md bg-[#0a111f] border border-[#242c3b] rounded-3xl flex flex-col items-center gap-6 p-5 sm:p-8 shadow-[0_0_50px_0_rgba(56,189,248,0.15)] shrink-0'
				onSubmit={handleAuth}
			>
				<div className='flex flex-col items-center gap-4 w-full'>
					<Link to={'/'}>
						<div className='flex items-center gap-3'>
							<div className='flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-[#38BDF8] to-[#34D399] shadow-[0px_0px_15px_0px_#38BDF8]'>
								<Braces className='text-[#03111F] scale-85' />
							</div>
							<h1 className='text-xl font-bold text-[#e0f2fe]'>TAKECODE</h1>
						</div>
					</Link>
					<div className='flex flex-col items-center justify-center text-center gap-2'>
						<h2 className='font-bold text-2xl sm:text-3xl text-white'>
							{isCreateMode ? 'Join the developer collective' : 'Welcome back'}
						</h2>
						<p className='text-xs sm:text-sm text-[#94a3b8c7] text-center'>
							Access community snippets and production-ready recipes.
						</p>
					</div>
				</div>

				<div className='flex flex-col gap-5 w-full'>
					{/* Соцсети */}
					<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 w-full'>
						<button
							type='button'
							onClick={() => authWithGitHub()}
							disabled={isLoading}
							className={cn(
								'flex items-center justify-center gap-2 text-base sm:text-lg text-white font-semibold bg-[#0b1220] border border-[#222b3e] hover:border-[#38BDF8]/40 w-full py-2.5 sm:py-3 rounded-2xl cursor-pointer transition-all',
								isLoading && 'opacity-70 pointer-events-none',
							)}
						>
							{isLoading ? (
								<AuthLoader />
							) : (
								<>
									<Github variant='dark' className='w-5 h-5' />
									<span>GitHub</span>
								</>
							)}
						</button>
						<button
							type='button'
							onClick={() => authWithGoogle()}
							disabled={isLoading}
							className={cn(
								'flex items-center justify-center gap-2 text-base sm:text-lg text-white font-semibold bg-[#0b1220] border border-[#222b3e] hover:border-[#38BDF8]/40 w-full py-2.5 sm:py-3 rounded-2xl cursor-pointer transition-all',
								isLoading && 'opacity-70 pointer-events-none',
							)}
						>
							{isLoading ? (
								<AuthLoader />
							) : (
								<>
									<Google variant='default' className='w-5 h-5' />
									<span>Google</span>
								</>
							)}
						</button>
					</div>

					{/* Разделитель */}
					<div className='flex items-center w-full'>
						<div className='grow border-t border-slate-700/50'></div>
						<span className='mx-3 text-xs sm:text-sm text-slate-400 font-medium whitespace-nowrap'>
							or continue with email
						</span>
						<div className='grow border-t border-slate-700/50'></div>
					</div>

					{/* Поля ввода */}
					<div className='flex flex-col gap-4 w-full'>
						{isCreateMode && (
							<div className='flex flex-col gap-2'>
								<span className='text-white font-semibold text-xs sm:text-sm'>
									User Name
								</span>
								<input
									value={username}
									onChange={e => setUsername(e.target.value)}
									className='bg-[#070d19] border border-[#222b3e] focus:border-[#38BDF8] text-white placeholder:text-[#5f6a7c] px-4 py-2.5 sm:py-3 rounded-2xl outline-none transition-all text-sm sm:text-base'
									placeholder='Your Name'
									type='text'
								/>
							</div>
						)}
						<div className='flex flex-col gap-2'>
							<span className='text-white font-semibold text-xs sm:text-sm'>
								Email Address
							</span>
							<input
								value={email}
								onChange={e => setEmail(e.target.value)}
								className='bg-[#070d19] border border-[#222b3e] focus:border-[#38BDF8] text-white placeholder:text-[#5f6a7c] px-4 py-2.5 sm:py-3 rounded-2xl outline-none transition-all text-sm sm:text-base'
								placeholder='you@takecode.dev'
								type='email'
							/>
						</div>
						<div className='flex flex-col gap-2'>
							<div className='flex justify-between items-center'>
								<span className='text-white font-semibold text-xs sm:text-sm'>
									Password
								</span>
								<span className='text-[#38BDF8] hover:underline font-semibold text-xs cursor-pointer'>
									Forgot password?
								</span>
							</div>
							<input
								value={password}
								onChange={e => setPassword(e.target.value)}
								className='bg-[#070d19] border border-[#222b3e] focus:border-[#38BDF8] text-white placeholder:text-[#5f6a7c] px-4 py-2.5 sm:py-3 rounded-2xl outline-none transition-all text-sm sm:text-base'
								placeholder='your password'
								type='password'
							/>
						</div>
					</div>

					{/* Нижняя кнопка и переключатель */}
					<div className='flex flex-col gap-4 w-full mt-2'>
						<button
							type='submit'
							disabled={isLoading}
							className={cn(
								'flex items-center justify-center w-full h-11 sm:h-12 rounded-2xl bg-linear-to-br from-[#38BDF8] to-[#34D399] shadow-[0px_0px_15px_0px_#38BDF8] font-semibold text-slate-950 cursor-pointer transition-all duration-200 text-sm sm:text-base',
								isLoading && 'opacity-70 pointer-events-none',
							)}
						>
							{isLoading ? (
								<AuthLoader />
							) : isCreateMode ? (
								'Create account'
							) : (
								'Log In'
							)}
						</button>

						<p className='font-normal text-xs sm:text-sm text-center text-slate-400'>
							{isCreateMode
								? 'Already have an account?'
								: 'Don’t have an account?'}
							<span
								className='text-[#38BDF8] font-bold cursor-pointer ml-1 hover:underline'
								onClick={() => setIsCreateMode(prev => !prev)}
							>
								{isCreateMode ? 'Sign In' : 'Sign Up'}
							</span>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
};