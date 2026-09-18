import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditWorkoutDialog } from "./edit-workout-dialog";
import { DeleteWorkoutDialog } from "./delete-workout-dialog";

export default async function WorkoutDetails({
	params,
}: {
	params: Promise<{
		workoutId: string;
	}>;
}) {
	const { workoutId } = await params;

	const supabase = await createClient();

	const { data: workout } = await supabase
		.from("workouts")
		.select(
			`
      id,
      title,
      date,
      client_id,
      workout_exercises (
        id,
        name,
        notes,
        position,
        exercise_sets (
          id,
          set_number,
          reps,
          weight
        )
      )
    `,
		)
		.eq("id", workoutId)
		.single();

	if (!workout) {
		notFound();
	}

	const exercises = [...workout.workout_exercises].sort(
		(a, b) => a.position - b.position,
	);

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{workout.title}
					</h1>

					<p className="text-muted-foreground">{workout.date}</p>
				</div>

				<div className="space-x-2">
					<EditWorkoutDialog
						workout={workout}
						clientId={workout.client_id}
					/>
					<DeleteWorkoutDialog
						clientId={workout.client_id}
						workoutId={workoutId}
					/>
				</div>
			</div>

			{exercises.length > 0 ? (
				<div className="space-y-6">
					{exercises.map((exercise) => {
						const sets = [...exercise.exercise_sets].sort(
							(a, b) => a.set_number - b.set_number,
						);

						return (
							<div
								key={exercise.id}
								className="rounded-lg border p-5"
							>
								<h2 className="text-lg font-semibold">
									{exercise.name}
								</h2>

								{exercise.notes && (
									<p className="mt-1 text-sm text-muted-foreground">
										{exercise.notes}
									</p>
								)}

								<div className="mt-4 space-y-2">
									{sets.map((set) => (
										<div
											key={set.id}
											className="flex gap-6 text-sm"
										>
											<span className="w-12">
												Set {set.set_number}
											</span>

											<span>{set.reps} reps</span>

											{set.weight !== null && (
												<span>{set.weight} kg</span>
											)}
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p className="text-muted-foreground">No exercises logged.</p>
			)}
		</div>
	);
}
