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
import { useNavigate, useParams } from 'react-router-dom';
import { CodeEditor } from '../components/ui/CodeEditor';
import { supabase } from '../utils/supabase';

type OptionItem = {
	id: string;
	name: string;
};

export const EditSnippet = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	// Supabase Lookup Lists
	const [languagesList, setLanguagesList] = useState<OptionItem[]>([]);
	const [frameworksList, setFrameworksList] = useState<OptionItem[]>([]);
	const [dependenciesList, setDependenciesList] = useState<OptionItem[]>([]);
	const [tagsList, setTagsList] = useState<OptionItem[]>([]);

	// Form Fields
	const [title, setTitle] = useState('');
	const [codeFilename, setCodeFilename] = useState('');
	const [description, setDescription] = useState('');
	const [code, setCode] = useState('');
	const [readme, setReadme] = useState('');
	const [selectedLanguageId, setSelectedLanguageId] = useState('');
	const [selectedFrameworkId, setSelectedFrameworkId] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [selectedDependencyIds, setSelectedDependencyIds] = useState<string[]>(
		[],
	);

	// Local UI State
	const [tagInput, setTagInput] = useState('');
	const [isAddingCustomDep, setIsAddingCustomDep] = useState(false);
	const [customDepName, setCustomDepName] = useState('');
	const [customDepCommand, setCustomDepCommand] = useState('');

	const currentLangName =
		languagesList.find(lang => lang.id === selectedLanguageId)?.name || '';

	// 1. FETCH DATA
	useEffect(() => {
		if (!id) return;

		async function fetchSnippetData() {
			setLoading(true);
			try {
				const [langRes, frameRes, depRes, tagsRes, snippetRes, activeDepsRes] =
					await Promise.all([
						supabase.from('languages').select('id, name'),
						supabase.from('frameworks').select('id, name'),
						supabase.from('dependencies').select('id, name'),
						supabase.from('tags').select('id, name'),
						supabase.from('snippets').select('*').eq('id', id).single(),
						supabase
							.from('snippet_dependencies')
							.select('dependency_id')
							.eq('snippet_id', id),
					]);

				if (langRes.data) setLanguagesList(langRes.data);
				if (frameRes.data) setFrameworksList(frameRes.data);
				if (depRes.data) setDependenciesList(depRes.data);
				if (tagsRes.data) setTagsList(tagsRes.data);

				if (snippetRes.data) {
					const snip = snippetRes.data;
					setTitle(snip.title || '');
					setCodeFilename(snip.code_filename || '');
					setDescription(snip.description || '');
					setCode(snip.code || '');
					setReadme(snip.readme || '');
					setSelectedLanguageId(snip.language_id || '');
					setSelectedFrameworkId(snip.framework_id || '');
					setSelectedTags(snip.tags || []);
				}

				if (activeDepsRes.data) {
					const activeIds = activeDepsRes.data.map(item => item.dependency_id);
					setSelectedDependencyIds(activeIds);
				}
			} catch (err) {
				console.error('Error loading snippet:', err);
				alert('Failed to load snippet data');
			} finally {
				setLoading(false);
			}
		}

		fetchSnippetData();
	}, [id]);

	// Tag Handlers
	const handleAddTag = (tagToAdd: string) => {
		const cleanTag = tagToAdd.trim().replace(/^#/, '');
		if (!cleanTag) return;
		if (!selectedTags.includes(cleanTag)) {
			setSelectedTags(prev => [...prev, cleanTag]);
		}
		setTagInput('');
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setSelectedTags(prev => prev.filter(t => t !== tagToRemove));
	};

	// Dependency Handlers
	const toggleDependency = (depId: string) => {
		setSelectedDependencyIds(prev =>
			prev.includes(depId) ? prev.filter(id => id !== depId) : [...prev, depId],
		);
	};

	const handleAddCustomDependency = async () => {
		if (!customDepName.trim()) return;

		try {
			const { data, error } = await supabase
				.from('dependencies')
				.insert({
					name: customDepName.trim(),
					install_command: customDepCommand.trim() || null,
				})
				.select('id, name')
				.single();

			if (error) throw error;

			if (data) {
				setDependenciesList(prev => [...prev, data]);
				setSelectedDependencyIds(prev => [...prev, data.id]);
				setCustomDepName('');
				setCustomDepCommand('');
				setIsAddingCustomDep(false);
			}
		} catch (err) {
			console.error('Error adding custom dependency:', err);
			alert('Failed to add custom dependency');
		}
	};

	// 2. SAVE UPDATES
	const handleUpdate = async () => {
		if (!title.trim() || !code.trim() || !id) return;

		setLoading(true);

		try {
			const snippetPayload = {
				title,
				code,
				description,
				readme,
				code_filename: codeFilename,
				tags: selectedTags,
				language_id: selectedLanguageId || null,
				framework_id: selectedFrameworkId || null,
				updated_at: new Date().toISOString(),
			};

			const { error: snippetError } = await supabase
				.from('snippets')
				.update(snippetPayload)
				.eq('id', id);

			if (snippetError) throw snippetError;

			const { error: deleteError } = await supabase
				.from('snippet_dependencies')
				.delete()
				.eq('snippet_id', id);

			if (deleteError) throw deleteError;

			if (selectedDependencyIds.length > 0) {
				const dependenciesPayload = selectedDependencyIds.map(depId => ({
					snippet_id: id,
					dependency_id: depId,
				}));

				const { error: insertDepError } = await supabase
					.from('snippet_dependencies')
					.insert(dependenciesPayload);

				if (insertDepError) throw insertDepError;
			}

			navigate(`/snippet/${id}`);
		} catch (error) {
			console.error('Update error:', error);
			alert(`Supabase error: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='text-white p-8   mx-auto'>Loading snippet data...</div>
		);
	}

	return (
		<div className='min-h-screen text-slate-200 font-sans p-3 sm:p-6 lg:p-8 selection:bg-[#2dd4bf]/30 mx-auto'>
			{/* TOP BAR */}
			<div className='flex items-center justify-between gap-4 mb-6'>
				<button
					onClick={() => navigate('/profile')}
					className='flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-medium'
				>
					<ArrowLeft className='w-4 h-4' />
					<span className='hidden sm:inline'>Back to dashboard</span>
					<span className='sm:hidden'>Back</span>
				</button>

				<button
					onClick={handleUpdate}
					disabled={loading}
					className='flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#2dd4bf] text-[#090f22] hover:bg-[#5eead4] transition-all cursor-pointer shadow-lg shadow-[#2dd4bf]/10 disabled:opacity-50 shrink-0'
				>
					<CheckCircle2 className='w-4 h-4' />
					<span>{loading ? 'Updating...' : 'Update Snippet'}</span>
				</button>
			</div>

			{/* MAIN CONTAINER */}
			<div className='bg-[#0b1220] border border-[#1b2333] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 sm:space-y-8'>
				{/* Header */}
				<div className='flex items-start gap-3 sm:gap-4 border-b border-[#1b2333] pb-6'>
					<div className='p-2.5 sm:p-3 bg-[#162032] border border-[#222f47] rounded-2xl text-[#2dd4bf] shrink-0'>
						<Sparkles className='w-5 h-5 sm:w-6 sm:h-6' />
					</div>
					<div>
						<h1 className='text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight'>
							Edit Snippet
						</h1>
						<p className='text-slate-400 text-xs sm:text-sm lg:text-base mt-1 leading-relaxed'>
							Update your snippet with the latest changes and improvements.
						</p>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8'>
					{/* LEFT COLUMN */}
					<div className='lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-6'>
						{/* Title & File Name */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-1.5'>
								<label className='text-xs sm:text-sm font-bold text-slate-300 tracking-wider block'>
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
								<label className='text-xs sm:text-sm font-bold text-slate-300 tracking-wider block'>
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
							<label className='text-xs sm:text-sm font-bold text-slate-300 tracking-wider block'>
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
									className='bg-[#090f22] border border-[#1b2333] text-[#2dd4bf] rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer'
								>
									<option value=''>Select Language</option>
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
							<label className='text-xs sm:text-sm font-bold text-slate-300 tracking-wider flex items-center gap-1.5'>
								<Layers className='w-3.5 h-3.5 text-[#2dd4bf]' />
								Framework
							</label>
							<select
								value={selectedFrameworkId}
								onChange={e => setSelectedFrameworkId(e.target.value)}
								className='w-full bg-[#090f22] border border-[#1b2333] text-white rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2dd4bf] cursor-pointer'
							>
								<option value=''>Select Framework</option>
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
							<label className='text-xs sm:text-sm font-bold text-slate-300 tracking-wider flex items-center gap-1.5'>
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
								className='w-full bg-[#090f22] border border-[#1b2333] text-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2dd4bf] cursor-pointer'
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
									className='flex-1 bg-[#090f22] border border-[#1b2333] rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf]'
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
										className='flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold px-2.5 py-1 rounded-xl bg-[#092227] text-[#2dd4bf] border border-[#0d4247]'
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
								<label className='text-xs sm:text-sm font-bold text-slate-300 tracking-wider flex items-center gap-1.5'>
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
									className='w-full bg-[#090f22] border border-[#1b2333] text-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2dd4bf] cursor-pointer'
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
										className='w-full bg-[#0d131f] border border-[#1b2333] rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf]'
									/>
									<input
										type='text'
										value={customDepCommand}
										onChange={e => setCustomDepCommand(e.target.value)}
										placeholder='Install cmd (optional: npm i lodash)'
										className='w-full bg-[#0d131f] border border-[#1b2333] rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf]'
									/>
									<div className='flex justify-end gap-2 pt-1'>
										<button
											type='button'
											onClick={() => setIsAddingCustomDep(false)}
											className='px-2.5 py-1 text-xs sm:text-sm text-slate-400 hover:text-white cursor-pointer'
										>
											Cancel
										</button>
										<button
											type='button'
											onClick={handleAddCustomDependency}
											className='px-3 py-1 bg-[#2dd4bf] text-[#090f22] font-bold text-xs sm:text-sm rounded-lg hover:bg-[#5eead4] transition-all cursor-pointer'
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
											className='flex items-center gap-1.5 text-xs sm:text-sm font-mono px-2.5 py-1 rounded-lg bg-[#162032] text-[#2dd4bf] border border-[#222f47]'
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
							<label className='text-xs sm:text-sm font-bold text-slate-300 tracking-wider flex items-center gap-2'>
								<FileText className='w-4 h-4 text-[#2dd4bf]' />
								How To Use?
							</label>
							<textarea
								rows={4}
								value={readme}
								onChange={e => setReadme(e.target.value)}
								placeholder='## Installation&#10;Paste hook into your `hooks/` directory...'
								className='w-full bg-[#090f22] border border-[#1b2333] rounded-xl p-3.5 text-white font-mono text-xs sm:text-sm leading-relaxed placeholder-slate-600 focus:outline-none focus:border-[#2dd4bf] transition-all resize-none'
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
