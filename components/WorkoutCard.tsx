import { EditWorkoutDialog } from "./edit-workout-dialog";
import { DeleteWorkoutDialog } from "./delete-workout-dialog";
import Link from "next/link";

type Workout = {
	id: string;
	title: string;
	date: string;
	notes: string | null;
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
			className="rounded-lg border p-4 flex justify-between hover:border-black/25 transition"
		>
			<div className="space-y-1">
				<h3 className="font-semibold">{workout.title}</h3>
				<p className="text-muted-foreground text-sm">{formattedDate}</p>
			</div>

			<div className="space-x-2">
				<EditWorkoutDialog workout={workout} />

				<DeleteWorkoutDialog
					clientId={workout.client_id}
					workoutId={workout.id}
				/>
			</div>
		</Link>
	);
}
