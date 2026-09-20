import clsx from "clsx";

export default function LetterAvatar({
	clientId,
	className,
}: {
	clientId: string;
	className: string;
}) {
	const avatarUrl = `https://api.dicebear.com/10.x/waves/svg?seed=${clientId}?backgroundColor=ff2e88,00e5ff,ffe600,7cff00,ff6a00,b400ff`;

	return (
		<img
			src={avatarUrl}
			alt="avatar"
			className={clsx("size-10 rounded-full", className)}
		/>
	);
}
