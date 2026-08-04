type UserTagProps = {
    user: string;
    avatar: string;
}

export const UserTag = ({ user, avatar }: UserTagProps) => {
	return (
		<div className='flex items-center gap-3'>
			<img className='w-9 h-9 rounded-3xl' src={avatar} alt='' />
			<p className='text-[#cbd5e1] text-lg'>@{user}</p>
		</div>
	);
};