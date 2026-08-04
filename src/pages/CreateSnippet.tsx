import {
	ArrowLeft,
	Box,
	CheckCircle2,
	Code2,
	FileText,
	Layers,
	Plus,
	Sparkles,
	Tag,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/ui/CodeBlocks/CodeEditor';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

export type OptionItem = {
	id: string;
	name: string;
};

export const CreateSnippet = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	// Справочники из Supabase
	const [languagesList, setLanguagesList] = useState<OptionItem[]>([]);
	const [frameworksList, setFrameworksList] = useState<OptionItem[]>([]);
	const [dependenciesList, setDependenciesList] = useState<OptionItem[]>([]);
	const [tagsList, setTagsList] = useState<OptionItem[]>([]);

	// Состояния формы
	const [title, setTitle] = useState('');
	const [codeFilename, setCodeFilename] = useState('use-session-guard.ts');
	const [description, setDescription] = useState('');
	const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
	const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>('');
	const [code, setCode] = useState('');

	// Выбранные теги и зависимости
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');
	const [selectedDependencyIds, setSelectedDependencyIds] = useState<string[]>(
		[],
	);
	// Состояния для создания кастомной зависимости
	const [customDepName, setCustomDepName] = useState('');
	const [customDepCommand, setCustomDepCommand] = useState('');
	const [isAddingCustomDep, setIsAddingCustomDep] = useState(false);

	// UI поля
	const [readme, setReadme] = useState('');

	// Загружаем все данные из БД
	useEffect(() => {
		async function fetchMetadata() {
			try {
				const [langRes, frameRes, depRes, tagsRes] = await Promise.all([
					supabase.from('languages').select('id, name'),
					supabase.from('frameworks').select('id, name'),
					supabase.from('dependencies').select('id, name'),
					supabase.from('tags').select('id, name'),
				]);

				if (langRes.data) {
					setLanguagesList(langRes.data);
					if (langRes.data.length > 0)
						setSelectedLanguageId(langRes.data[0].id);
				}
				if (frameRes.data) {
					setFrameworksList(frameRes.data);
					if (frameRes.data.length > 0)
						setSelectedFrameworkId(frameRes.data[0].id);
				}
				if (depRes.data) setDependenciesList(depRes.data);
				if (tagsRes.data) setTagsList(tagsRes.data);
			} catch (err) {
				toast.error('Произошла ошибка при загрузке метаданных. Пожалуйста, попробуйте еще раз.');
				console.error('Ошибка загрузки метаданных:', err);
			}
		}

		fetchMetadata();
	}, []);

	// Переключение зависимости
	const toggleDependency = (id: string) => {
		if (selectedDependencyIds.includes(id)) {
			setSelectedDependencyIds(
				selectedDependencyIds.filter(depId => depId !== id),
			);
		} else {
			setSelectedDependencyIds([...selectedDependencyIds, id]);
		}
	};

	// Добавление тега из БД или вручную
	const handleAddTag = (tagName: string) => {
		const cleanTag = tagName.trim().replace(/^#/, '');
		if (cleanTag && !selectedTags.includes(cleanTag)) {
			setSelectedTags([...selectedTags, cleanTag]);
			setTagInput('');
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
	};

	// Создание новой зависимости в БД и автоматический выбор
	const handleAddCustomDependency = async () => {
		const name = customDepName.trim();
		if (!name) return;

		const installCommand = customDepCommand.trim() || `npm i ${name}`;

		try {
			const { data: newDep, error } = await supabase
				.from('dependencies')
				.insert([
					{
						name: name,
						install_command: installCommand,
						color: '#6366F1',
						bg: '#141638',
						border_color: '#292d70',
					},
				])
				.select()
				.single();

			if (error) {
				toast.warning('Ошибка при создании зависимости.');
				console.error('Ошибка добавления зависимости:', error);
				return;
			}

			if (newDep) {
				setDependenciesList(prev => [...prev, newDep]);
				setSelectedDependencyIds(prev => [...prev, newDep.id]);
				setCustomDepName('');
				setCustomDepCommand('');
				setIsAddingCustomDep(false);
			}
		} catch (err) {
			toast.error('Произошла ошибка при создании зависимости. Пожалуйста, попробуйте еще раз.');
			console.error('Ошибка:', err);
		}
	};

	// Отправка формы в Supabase
	const handleSubmit = async () => {
		if (!title.trim() || !code.trim()) {
			toast.warning('Заполните название и код!');
			return;
		}

		setLoading(true);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				toast.warning('Вы должны быть авторизованы, чтобы создать сниппет.');
				return;
			}

			const snippetPayload = {
				title,
				code,
				description,
				readme,
				code_filename: codeFilename || 'snippet.ts',
				tags: selectedTags,
				language_id: selectedLanguageId || null,
				framework_id: selectedFrameworkId || null,
				user_id: user.id,
			};

			const { data: snippet, error: snippetError } = await supabase
				.from('snippets')
				.insert([snippetPayload])
				.select()
				.single();

			if (snippetError) throw snippetError;

			if (selectedDependencyIds.length > 0 && snippet) {
				const dependenciesPayload = selectedDependencyIds.map(depId => ({
					snippet_id: snippet.id,
					dependency_id: depId,
				}));

				const { error: depError } = await supabase
					.from('snippet_dependencies')
					.insert(dependenciesPayload);

				if (depError) {
					console.error('Ошибка записи зависимостей:', depError);
				}
			}

			toast.success('Сниппет успешно сохранен!');
			navigate(`/snippet/${snippet.id}`);
		} catch (err) {
			toast.error('Произошла ошибка при сохранении сниппета. Пожалуйста, попробуйте еще раз.');
			console.error('Ошибка сохранения:', err);
		} finally {
			setLoading(false);
		}
	};

	const currentLangName =
		languagesList.find(l => l.id === selectedLanguageId)?.name || 'TypeScript';

	return (
		<div className='min-h-screen text-slate-200 font-sans p-3 sm:p-6 lg:p-8 selection:bg-[#2dd4bf]/30 mx-auto'>
			{/* TOP BAR */}
			<div className='flex items-center justify-between gap-4 mb-6'>
				<button
					onClick={() => navigate(-1)}
					className='flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-medium'
				>
					<ArrowLeft className='w-4 h-4' />
					<span className='hidden sm:inline'>Back to dashboard</span>
					<span className='sm:hidden'>Back</span>
				</button>

				<button
					onClick={handleSubmit}
					disabled={loading}
					className='flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#2dd4bf] text-[#090f22] hover:bg-[#5eead4] transition-all cursor-pointer shadow-lg shadow-[#2dd4bf]/10 disabled:opacity-50 shrink-0'
				>
					<CheckCircle2 className='w-4 h-4' />
					<span>{loading ? 'Publishing...' : 'Publish Snippet'}</span>
				</button>
			</div>

			{/* MAIN CONTAINER */}
			<div className='bg-[#0d1424] border border-[#1b2333] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 sm:space-y-8'>
				{/* Header */}
				<div className='flex items-start gap-3 sm:gap-4 border-b border-[#1b2333] pb-6'>
					<div className='p-2.5 sm:p-3 bg-[#162032] border border-[#222f47] rounded-2xl text-[#2dd4bf] shrink-0'>
						<Sparkles className='w-5 h-5 sm:w-6 sm:h-6' />
					</div>
					<div>
						<h1 className='text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight'>
							Create New Snippet
						</h1>
						<p className='text-slate-400 text-xs sm:text-sm lg:text-base mt-1 leading-relaxed'>
							Publish production-ready snippets with full control over syntax,
							tags, and documentation.
						</p>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8'>
					{/* LEFT COLUMN */}
					<div className='lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-6'>
						{/* Title & File Name */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-1.5'>
								<label className='text-xs font-bold text-slate-300 tracking-wider block'>
									Title <span className='text-rose-400'>*</span>
								</label>
								<input
									type='text'
									value={title}
									onChange={e => setTitle(e.target.value)}
									placeholder='useSessionGuard hook'
									className='w-full bg-[#090f22] border border-[#1b2333] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf] transition-all text-sm font-medium'
								/>
							</div>

							<div className='space-y-1.5'>
								<label className='text-xs font-bold text-slate-300 tracking-wider block'>
									File Name (`code_filename`)
								</label>
								<input
									type='text'
									value={codeFilename}
									onChange={e => setCodeFilename(e.target.value)}
									placeholder='use-session-guard.ts'
									className='w-full bg-[#090f22] border border-[#1b2333] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf] transition-all text-sm font-mono'
								/>
							</div>
						</div>

						{/* Short Description */}
						<div className='space-y-1.5'>
							<label className='text-xs font-bold text-slate-300 tracking-wider block'>
								Description
							</label>
							<textarea
								rows={2}
								value={description}
								onChange={e => setDescription(e.target.value)}
								placeholder='Client-safe auth boundary with redirect intent, suspense fallback, and typed roles.'
								className='w-full bg-[#090f22] border border-[#1b2333] rounded-xl p-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf] transition-all text-sm leading-relaxed resize-none'
							/>
						</div>

						{/* Source Code Section */}
						<div className='space-y-3 pt-2'>
							<div className='flex items-center justify-between gap-2 flex-wrap'>
								<div className='flex items-center gap-2 text-white font-bold text-sm'>
									<Code2 className='w-4 h-4 text-[#2dd4bf]' />
									<span>Source Code</span>
								</div>

								<select
									value={selectedLanguageId}
									onChange={e => setSelectedLanguageId(e.target.value)}
									className='bg-[#090f22] border border-[#1b2333] text-[#2dd4bf] rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none cursor-pointer'
								>
									{languagesList.map(lang => (
										<option
											key={lang.id}
											value={lang.id}
											className='bg-[#0d131f] text-white'
										>
											{lang.name}
										</option>
									))}
								</select>
							</div>

							<CodeEditor
								code={code}
								onChange={setCode}
								language={currentLangName}
								filename={codeFilename}
							/>
						</div>
					</div>

					{/* RIGHT COLUMN / SIDEBAR */}
					<div className='lg:col-span-5 xl:col-span-4 space-y-6 pt-6 border-t border-[#1b2333] lg:pt-0 lg:border-t-0 lg:border-l lg:pl-8'>
						{/* Framework Select */}
						<div className='space-y-2'>
							<label className='text-xs font-bold text-slate-300 tracking-wider flex items-center gap-1.5'>
								<Layers className='w-3.5 h-3.5 text-[#2dd4bf]' />
								Framework
							</label>
							<select
								value={selectedFrameworkId}
								onChange={e => setSelectedFrameworkId(e.target.value)}
								className='w-full bg-[#090f22] border border-[#1b2333] text-white rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2dd4bf] cursor-pointer'
							>
								{frameworksList.map(fw => (
									<option
										key={fw.id}
										value={fw.id}
										className='bg-[#0d131f] text-white'
									>
										{fw.name}
									</option>
								))}
							</select>
						</div>

						{/* TAGS SELECT */}
						<div className='space-y-2.5'>
							<label className='text-xs font-bold text-slate-300 tracking-wider flex items-center gap-1.5'>
								<Tag className='w-3.5 h-3.5 text-[#2dd4bf]' />
								Tags
							</label>

							<select
								onChange={e => {
									if (e.target.value) {
										handleAddTag(e.target.value);
										e.target.value = '';
									}
								}}
								className='w-full bg-[#090f22] border border-[#1b2333] text-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2dd4bf] cursor-pointer'
							>
								<option value=''>+ Select tag from database...</option>
								{tagsList.map(tag => (
									<option
										key={tag.id}
										value={tag.name}
										className='bg-[#0d131f] text-white'
									>
										{tag.name}
									</option>
								))}
							</select>

							<div className='flex gap-2 pt-1'>
								<input
									type='text'
									value={tagInput}
									onChange={e => setTagInput(e.target.value)}
									onKeyDown={e =>
										e.key === 'Enter' &&
										(e.preventDefault(), handleAddTag(tagInput))
									}
									placeholder='Or type custom tag...'
									className='flex-1 bg-[#090f22] border border-[#1b2333] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf]'
								/>
								<button
									type='button'
									onClick={() => handleAddTag(tagInput)}
									className='p-2 bg-[#162032] border border-[#222f47] text-[#2dd4bf] hover:bg-[#1f2d47] rounded-xl transition-all cursor-pointer shrink-0'
								>
									<Plus className='w-4 h-4' />
								</button>
							</div>

							<div className='flex flex-wrap gap-2 pt-1'>
								{selectedTags.map(tag => (
									<span
										key={tag}
										className='flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-[#092227] text-[#2dd4bf] border border-[#0d4247]'
									>
										#{tag}
										<X
											className='w-3.5 h-3.5 hover:text-rose-400 cursor-pointer'
											onClick={() => handleRemoveTag(tag)}
										/>
									</span>
								))}
							</div>
						</div>

						{/* DEPENDENCIES SELECT */}
						<div className='space-y-2.5'>
							<div className='flex items-center justify-between'>
								<label className='text-xs font-bold text-slate-300 tracking-wider flex items-center gap-1.5'>
									<Box className='w-3.5 h-3.5 text-[#2dd4bf]' />
									Dependencies
								</label>

								<button
									type='button'
									onClick={() => setIsAddingCustomDep(!isAddingCustomDep)}
									className='text-[11px] font-semibold text-[#2dd4bf] hover:underline cursor-pointer'
								>
									{isAddingCustomDep ? '← Select existing' : '+ Add custom'}
								</button>
							</div>

							{!isAddingCustomDep ? (
								<select
									onChange={e => {
										if (e.target.value) {
											toggleDependency(e.target.value);
											e.target.value = '';
										}
									}}
									className='w-full bg-[#090f22] border border-[#1b2333] text-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#2dd4bf] cursor-pointer'
								>
									<option value=''>Select dependency from database...</option>
									{dependenciesList.map(dep => (
										<option
											key={dep.id}
											value={dep.id}
											className='bg-[#0d131f] text-white'
										>
											{dep.name}
										</option>
									))}
								</select>
							) : (
								<div className='space-y-2 p-3 bg-[#090f22] border border-[#1b2333] rounded-xl'>
									<input
										type='text'
										value={customDepName}
										onChange={e => setCustomDepName(e.target.value)}
										placeholder='Package name (e.g. lodash)'
										className='w-full bg-[#0d131f] border border-[#1b2333] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf]'
									/>
									<input
										type='text'
										value={customDepCommand}
										onChange={e => setCustomDepCommand(e.target.value)}
										placeholder='Install cmd (optional: npm i lodash)'
										className='w-full bg-[#0d131f] border border-[#1b2333] rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf]'
									/>
									<div className='flex justify-end gap-2 pt-1'>
										<button
											type='button'
											onClick={() => setIsAddingCustomDep(false)}
											className='px-2.5 py-1 text-xs text-slate-400 hover:text-white cursor-pointer'
										>
											Cancel
										</button>
										<button
											type='button'
											onClick={handleAddCustomDependency}
											className='px-3 py-1 bg-[#2dd4bf] text-[#090f22] font-bold text-xs rounded-lg hover:bg-[#5eead4] transition-all cursor-pointer'
										>
											Add Package
										</button>
									</div>
								</div>
							)}

							<div className='flex flex-wrap gap-2 pt-1'>
								{selectedDependencyIds.map(depId => {
									const dep = dependenciesList.find(d => d.id === depId);
									if (!dep) return null;
									return (
										<span
											key={dep.id}
											className='flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-[#162032] text-[#2dd4bf] border border-[#222f47]'
										>
											{dep.name}
											<X
												className='w-3.5 h-3.5 text-slate-400 hover:text-rose-400 cursor-pointer'
												onClick={() => toggleDependency(dep.id)}
											/>
										</span>
									);
								})}
							</div>
						</div>

						{/* README / Usage Documentation */}
						<div className='space-y-2 pt-2'>
							<label className='text-xs font-bold text-slate-300 tracking-wider flex items-center gap-2'>
								<FileText className='w-4 h-4 text-[#2dd4bf]' />
								How To Use?
							</label>
							<textarea
								rows={4}
								value={readme}
								onChange={e => setReadme(e.target.value)}
								placeholder='## Installation&#10;Paste hook into your `hooks/` directory and wrap routes with SessionProvider...'
								className='w-full bg-[#090f22] border border-[#1b2333] rounded-xl p-3.5 text-white font-mono text-xs leading-relaxed placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf] transition-all resize-none'
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
