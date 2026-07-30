import { useEffect, useState } from 'react';

import { supabase } from '../../utils/supabase';
import type { User } from '@supabase/supabase-js';

import { socialIconsMap, socialMedias } from '../../mocks/mockData';

import { X, Shield, Save, Link2, User as UserIcon, Camera } from 'lucide-react';
import { AzureEntraGlobalSecureAccess } from '@thesvg/react';

interface ProfileSettingsProps {
	user: User | null;
	onClose: () => void;
}

type SettingsSection = 'personal' | 'security';

type SelectedSocials = Record<string, string>;

export const ProfileSettings = ({ onClose, user }: ProfileSettingsProps) => {
	const [displayName, setDisplayName] = useState<string>('');
	const [tag, setTag] = useState<string>('');
	const [speciality, setSpeciality] = useState<string>('');
	const [about, setAbout] = useState<string>('');
	const [avatarUrl, setAvatarUrl] = useState<string>('');
	const [selectedSocials, setSelectedSocials] = useState<SelectedSocials>({});

	const [currentPassword, setCurrentPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');

	const [activeSection, setActiveSection] =
		useState<SettingsSection>('personal');

	useEffect(() => {
		const fetchProfileData = async () => {
			if (activeSection === 'personal') {
				if (!user?.id) return;

				try {
					// Тянем данные из таблицы profiles именно для этого юзера
					const { data, error } = await supabase
						.from('profiles')
						.select('display_name, avatar_url, tag, speciality, about, social_medias')
						.eq('id', user.id)
						.single();

					if (error) throw error;

					if (data) {
						setDisplayName(data.display_name || '');
						setTag(data.tag || '');
						setSpeciality(data.speciality || '');
						setAbout(data.about || '');
						setAvatarUrl(data.avatar_url || '');

						if (Array.isArray(data.social_medias)) {
							const socialsObject: SelectedSocials = {};
							data.social_medias.forEach(item => {
								if (item && item.name) {
									socialsObject[item.name] = item.link || '';
								}
							});
							setSelectedSocials(socialsObject);
						}
					}
				} catch (error) {
					console.error('Ошибка загрузки профиля:', error);
				}
			} else {
				await supabase.auth.updateUser({
					password: newPassword
				})
			}
		};

		fetchProfileData();
	}, [user?.id, activeSection, newPassword ]); 

	const updateProfile = async () => {
		try {
			const socialMediasArray = Object.entries(selectedSocials).map(
				([name, link], index) => ({
					id: index + 1,
					name: name,
					link: link,
				}),
			);

			await supabase
				.from('profiles')
				.update({
					display_name: displayName,
					tag: tag,
					speciality: speciality,
					about: about,
					social_medias: socialMediasArray,
				})
				.eq('id', user?.id);
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			if (!e.target.files || e.target.files.length === 0) return;
			const file = e.target.files[0];

			// 1. Получаем текущего авторизованного юзера напрямую из auth
			const { data: authData, error: authError } =
				await supabase.auth.getUser();

			if (authError || !authData.user) {
				alert('Сессия истекла. Пожалуйста, войдите снова.');
				return;
			}

			const userId = authData.user.id;
			const fileExt = file.name.split('.').pop();

			// Формируем чистый путь: ID_пользователя/timestamp.ext
			const filePath = `${userId}/${Date.now()}.${fileExt}`;

			console.log('Начинаем загрузку файла:', filePath);

			// 2. Загружаем файл в Storage
			const { error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(filePath, file, {
					upsert: true,
					contentType: file.type,
				});

			if (uploadError) {
				console.error(
					'❌ Ошибка Supabase Storage при загрузке:',
					uploadError.message,
				);
				alert(`Не удалось загрузить фото: ${uploadError.message}`);
				return;
			}

			// 3. Получаем публичную ссылку
			const { data: urlData } = supabase.storage
				.from('avatars')
				.getPublicUrl(filePath);

			const publicUrl = urlData.publicUrl;
			console.log('✅ Успешно сгенерирован URL:', publicUrl);

			// 4. Обновляем профиль в БД
			const { error: updateError } = await supabase
				.from('profiles')
				.update({ avatar_url: publicUrl })
				.eq('id', userId);

			if (updateError) {
				console.error('❌ Ошибка обновления profiles:', updateError.message);
				return;
			}

			// 5. Обновляем локальное состояние UI
			setAvatarUrl(publicUrl);
		} catch (err) {
			console.error('🔥 Непредвиденная ошибка:', err);
		}
	};
	
	const handleToggleSocial = (name: string) => {
		setSelectedSocials(prev => {
			const updated = { ...prev };
			if (name in updated) {
				delete updated[name];
			} else {
				updated[name] = '';
			}
			return updated;
		});
	};

	const handleLinkChange = (name: string, value: string) => {
		setSelectedSocials(prev => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn'>
			<div className='absolute inset-0 cursor-pointer' onClick={onClose} />

			<div className='relative w-full max-w-7xl h-150 bg-[#0c1321] border border-[#252d3c] rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex overflow-hidden transform transition-all duration-300'>
				<button
					onClick={onClose}
					className='absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer p-1.5 hover:bg-[#19202f] rounded-xl border border-transparent hover:border-[#252c3c] z-10'
				>
					<X size={18} />
				</button>

				<div className='w-1/4 bg-[#080e1d] border-r border-[#252d3c] p-6 flex flex-col gap-6'>
					<div>
						<h3 className='text-2xl font-bold text-white'>Settings</h3>
						<p className='text-sm text-gray-500 mt-1'>Manage your account</p>
					</div>

					<nav className='flex flex-col gap-2'>
						<button
							onClick={() => setActiveSection('personal')}
							className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-medium transition-all duration-200 cursor-pointer text-left
                                ${
																	activeSection === 'personal'
																		? 'bg-[#13182b] border border-[#20273a] text-[#38bdf8]'
																		: 'text-gray-400 hover:bg-[#13182b]/50 hover:text-white border border-transparent'
																}`}
						>
							<UserIcon size={18} />
							<span>Personal information</span>
						</button>

						<button
							onClick={() => setActiveSection('security')}
							className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-medium transition-all duration-200 cursor-pointer text-left
                                ${
																	activeSection === 'security'
																		? 'bg-[#13182b] border border-[#20273a] text-[#34d399]'
																		: 'text-gray-400 hover:bg-[#13182b]/50 hover:text-white border border-transparent'
																}`}
						>
							<Shield size={18} />
							<span>Security</span>
						</button>
					</nav>
				</div>

				<div className='w-2/3 p-8 flex flex-col justify-between h-full bg-[#0c1321]'>
					<div className='overflow-y-auto pr-2 space-y-5 grow scrollbar-thin scrollbar-thumb-current'>
						{activeSection === 'personal' && (
							<div className='animate-fadeIn space-y-4'>
								<div>
									<h4 className='text-xl font-semibold text-white'>
										Personal information
									</h4>
									<p className='text-sm text-gray-400 mt-1'>
										This information will be displayed on your profile.
									</p>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='relative group w-24 h-24 rounded-full overflow-hidden border border-[#252d3c] cursor-pointer block'>
										{/* Картинка аватара */}
										<img
											src={avatarUrl || '/default-avatar.png'}
											className='w-full h-full object-cover'
										/>

										{/* Ховер-эффект с иконкой при наведении */}
										<div className='absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
											<Camera size={20} className='text-white' />
										</div>

										{/* Скрытый инпут */}
										<input
											type='file'
											accept='image/*'
											onChange={handleAvatarChange}
											className='hidden'
										/>
									</label>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='text-sm text-gray-400 font-medium'>
										Display Name
									</label>
									<input
										value={displayName}
										onChange={e => setDisplayName(e.target.value)}
										type='text'
										className='w-full bg-[#080e1d] border border-[#19202f] focus:border-[#38bdf8] rounded-2xl px-4 py-2.5 text-sm text-white outline-none transition-colors'
										placeholder='Username...'
									/>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='text-sm text-gray-400 font-medium'>
										Tag
									</label>
									<input
										value={tag}
										onChange={e => setTag(e.target.value)}
										type='text'
										className='w-full bg-[#080e1d] border border-[#19202f] focus:border-[#38bdf8] rounded-2xl px-4 py-2.5 text-sm text-white outline-none transition-colors'
										placeholder='jonh.dev'
									/>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='text-sm text-gray-400 font-medium'>
										Speciality
									</label>
									<input
										value={speciality}
										onChange={e => setSpeciality(e.target.value)}
										type='text'
										className='w-full bg-[#080e1d] border border-[#19202f] focus:border-[#38bdf8] rounded-2xl px-4 py-2.5 text-sm text-white outline-none transition-colors'
										placeholder='e.g. Frontend Developer'
									/>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='text-sm text-gray-400 font-medium'>
										About
									</label>
									<textarea
										value={about}
										onChange={e => setAbout(e.target.value)}
										rows={3}
										className='w-full bg-[#080e1d] border border-[#19202f] focus:border-[#38bdf8] rounded-2xl px-4 py-2.5 text-sm text-white outline-none transition-colors resize-none'
										placeholder='Расскажи немного о себе...'
									/>
								</div>

								{/* --- БЛОК ВЫБОРА СОЦ СЕТЕЙ --- */}
								<div className='flex flex-col gap-3'>
									<label className='text-sm text-gray-400 font-medium'>
										Social Medias
									</label>
									<ul className='flex items-center gap-4 flex-wrap'>
										{(socialMedias || []).map((socialMedia, index) => {
											const IconComponent =
												socialIconsMap[socialMedia] ||
												AzureEntraGlobalSecureAccess;

											const isSelected = socialMedia in selectedSocials;

											return (
												<li
													key={index}
													onClick={() => handleToggleSocial(socialMedia)}
													className={`flex items-center gap-2 text-sm font-semibold border rounded-3xl px-4 py-2 cursor-pointer transition-all select-none
                                                        ${
																													isSelected
																														? 'bg-[#1e293b] border-[#38bdf8] text-white shadow-[0_0_10px_rgba(56,189,248,0.2)]'
																														: 'bg-[#151a29] border-[#2a3040] text-[#CBD5E1] hover:bg-[#1c2336] hover:text-white'
																												}`}
												>
													<IconComponent
														className={`w-5 h-5 transition-colors ${isSelected ? 'text-[#38BDF8]' : 'text-[#64748B]'}`}
													/>
													<span>{socialMedia}</span>
												</li>
											);
										})}
									</ul>
								</div>

								{Object.keys(selectedSocials).length > 0 && (
									<div className='animate-fadeIn space-y-3 pt-2 border-t border-[#1e293b] mb-5'>
										<label className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>
											Social Media Links
										</label>

										{Object.keys(selectedSocials).map(name => {
											const IconComponent =
												socialIconsMap[name] || AzureEntraGlobalSecureAccess;
											return (
												<div
													key={name}
													className='flex items-center gap-3 bg-[#111726] border border-[#1e2538] rounded-2xl mt-2 px-4 py-2 animate-slideDown'
												>
													<div className='flex items-center gap-2 w-1/4 min-w-30 text-white font-medium text-sm'>
														<IconComponent className='w-4 h-4 text-[#38BDF8]' />
														<span>{name}</span>
													</div>
													<div className='relative flex-1'>
														<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500'>
															<Link2 size={14} />
														</span>
														<input
															type='text'
															value={selectedSocials[name]}
															onChange={e =>
																handleLinkChange(name, e.target.value)
															}
															className='w-full bg-[#080e1d] border border-[#19202f] focus:border-[#38bdf8] rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none transition-colors'
															placeholder={`Enter your ${name} profile link...`}
														/>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						)}

						{activeSection === 'security' && (
							<div className='animate-fadeIn space-y-4'>
								<div>
									<h4 className='text-xl font-semibold text-white'>
										Account security
									</h4>
									<p className='text-sm text-gray-400 mt-0.5'>
										Password and account access management
									</p>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='text-sm text-gray-400 font-medium'>
										Current password
									</label>
									<input
										value={currentPassword}
										onChange={e => setCurrentPassword(e.target.value)}
										type='password'
										className='w-full bg-[#080e1d] border border-[#19202f] focus:border-[#34d399] rounded-2xl px-4 py-2.5 text-sm text-white outline-none transition-colors'
										placeholder='••••••••'
									/>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='text-sm text-gray-400 font-medium'>
										New password
									</label>
									<input
										value={newPassword}
										onChange={e => setNewPassword(e.target.value)}
										type='password'
										className='w-full bg-[#080e1d] border border-[#19202f] focus:border-[#34d399] rounded-2xl px-4 py-2.5 text-sm text-white outline-none transition-colors'
										placeholder='Минимум 6 символов'
									/>
								</div>

								<div className='flex flex-col gap-2'>
									<label className='text-sm text-gray-400 font-medium'>
										Repeat your password
									</label>
									<input
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
										type='password'
										className='w-full bg-[#080e1d] border border-[#19202f] focus:border-[#34d399] rounded-2xl px-4 py-2.5 text-sm text-white outline-none transition-colors'
										placeholder='••••••••'
									/>
								</div>
							</div>
						)}
					</div>

					<div className='flex items-center justify-end gap-3 border-t border-[#252d3c] pt-4 mt-4'>
						<button
							onClick={onClose}
							className='px-4 py-2 bg-transparent border border-[#252d3c] hover:bg-[#19202f] rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer'
						>
							Cancel
						</button>
						<button
							onClick={() => {
								updateProfile();
								onClose();
							}}
							className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black transition-colors cursor-pointer
                                ${activeSection === 'personal' ? 'bg-[#38bdf8] hover:bg-[#0ea5e9]' : 'bg-[#34d399] hover:bg-[#10b981]'}`}
						>
							<Save size={14} />
							Save changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
