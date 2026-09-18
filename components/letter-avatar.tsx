export default function LetterAvatar({ clientName }: { clientName: string }) {
	return (
		<div className="bg-accent/20 w-10 h-10 font-bold flex justify-center items-center rounded-full">
			<span className="">{clientName[0]}</span>
		</div>
	);
}
