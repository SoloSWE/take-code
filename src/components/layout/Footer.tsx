import { Link, useLocation } from 'react-router-dom';

import { Braces } from 'lucide-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { cn } from '../../utils/cn';

export const Footer = () => {
	const location = useLocation();
	return (
		<footer className='w-full border-t border-[#222b3e] bg-[#020617]/40 backdrop-blur-md px-4 sm:px-8 lg:px-16 py-8 md:py-12 flex flex-col items-center justify-center'>
			<div className='w-full max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-4'>
				<Link to={'/'}>
					<div className='flex items-center gap-3 justify-center md:justify-start select-none'>
						<div className='flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-[#38BDF8] to-[#34D399] shadow-[0px_0px_20px_0px_rgba(56,189,248,0.25)] max-lg:w-9 max-lg:h-9'>
							<Braces className='text-[#03111F] scale-95 max-lg:scale-90' />
						</div>
						<h3 className='text-xl text-[#cbd5e1] max-lg:text-lg font-bold tracking-wide'>
							TakeCode
						</h3>
					</div>
				</Link>

				<ul className='flex items-center gap-6 sm:gap-8 justify-center text-[16px] font-medium text-[#94A3B8] max-sm:text-sm'>
					<Link to='/exploreHub'>
						<li>
							<span
								className={cn(
									'text-[#94A3B8] cursor-pointer transition-colors hover:text-white',
									location.pathname === '/exploreHub' && 'text-white',
								)}
							>
								Explore
							</span>
						</li>
					</Link>
					<Link to='/community'>
						<li>
							<span
								className={cn(
									'text-[#94A3B8] cursor-pointer transition-colors hover:text-white',
									location.pathname === '/community' && 'text-white',
								)}
							>
								Community
							</span>
						</li>
					</Link>
					<Link to='/guideLines'>
						<li>
							<span
								className={cn(
									'text-[#94A3B8] cursor-pointer transition-colors hover:text-white',
									location.pathname === '/guideLines' && 'text-white',
								)}
							>
								Guidelines
							</span>
						</li>
					</Link>
				</ul>

				<ul className='flex items-center gap-2 justify-center'>
					<li>
						<a
							href='https://github.com/gaitarov095'
							target='_blank'
							rel='noreferrer'
						>
							<FontAwesomeIcon
								icon={faGithub}
								className='text-[#94A3B8] text-2xl transition-colors duration-200 hover:text-white cursor-pointer'
							/>
						</a>
					</li>
					<li>
						<a href='https://t.me/gaitarov095' target='_blank' rel='noreferrer'>
							<FontAwesomeIcon
								icon={faTelegram}
								className='text-[#94A3B8] text-2xl transition-colors duration-200 hover:text-[#38BDF8] cursor-pointer'
							/>
						</a>
					</li>
					<li>
						<a
							href='https://www.instagram.com/meldar.achlo/'
							target='_blank'
							rel='noreferrer'
						>
							<FontAwesomeIcon
								icon={faInstagram}
								className='text-[#94A3B8] text-2xl transition-colors duration-200 hover:text-[#fd1d1d] cursor-pointer'
							/>
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
};
