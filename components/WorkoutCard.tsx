import { EditWorkoutDialog } from "./edit-workout-dialog";
import { DeleteWorkoutDialog } from "./delete-workout-dialog";

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
		<div className="rounded-lg border p-4 flex justify-between">
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
		</div>
	);
}
