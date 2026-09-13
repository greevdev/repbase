export default function LetterAvatar({ clientName }: { clientName: string }) {
	return (
		<div className="bg-slate-200 w-10 h-10 flex justify-center items-center rounded-full">
			<span className="">{clientName[0]}</span>
		</div>
	);
}
