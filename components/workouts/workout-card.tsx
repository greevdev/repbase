import Link from "next/link";

type Workout = {
	id: string;
	title: string;
	date: string;
	client_id: string;
};

type WorkoutCardProps = { workout: Workout };

export default function WorkoutCard({ workout }: WorkoutCardProps) {
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${workout.date}T00:00:00Z`));

	return (
		<Link
			href={`/dashboard/clients/${workout.client_id}/workouts/${workout.id}`}
			className="rounded-lg border border-foreground/10 p-4 flex justify-between hover:border-accent/50 transition bg-white h-full"
		>
			<div className="space-y-1">
				<h3 className="font-semibold">{workout.title}</h3>
				<p className="text-muted-foreground text-sm">{formattedDate}</p>
			</div>
		</Link>
	);
}
