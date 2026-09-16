import { createClient } from "@/lib/server";

export default async function WorkoutDetails({
	params,
}: {
	params: Promise<{ workoutId: string }>;
}) {
	const { workoutId } = await params;

	const supabase = await createClient();

	const { data: workout } = await supabase
		.from("workouts")
		.select("*")
		.eq("id", workoutId)
		.single();

	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${workout.date}T00:00:00Z`));

	const { data: exercises } = await supabase
		.from("workout_exercises")
		.select(
			`
    *,
    exercise_sets (
      id,
      set_number,
      reps,
      weight
    )
  `,
		)
		.eq("workout_id", workoutId)
		.order("position", { ascending: true });

	return (
		<div className="space-y-10">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">
					{workout.title}
				</h1>
				<p className="text-muted-foreground">{formattedDate}</p>
			</div>

			<div className="space-y-2">
				<div>
					<h2 className="text-xl font-semibold">Exercises</h2>
				</div>

				<div>
					{exercises?.map((exercise) => (
						<div
							key={exercise.id}
							className="rounded-lg border p-4"
						>
							<h3 className="font-semibold">{exercise.name}</h3>

							<div className="mt-3 space-y-1">
								{exercise.exercise_sets
									.sort(
										(a: any, b: any) =>
											a.set_number - b.set_number,
									)
									.map((set: any) => (
										<div
											key={set.id}
											className="flex gap-4 text-sm"
										>
											<span>Set {set.set_number}</span>

											<span>{set.reps} reps</span>

											{set.weight !== null && (
												<span>{set.weight} kg</span>
											)}
										</div>
									))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
