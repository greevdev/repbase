import { createClient } from "@/lib/supabase/server";
import { PREDEFINED_EXERCISES } from "@/lib/exercises";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddWorkoutDialog } from "@/components/workouts/add-workout-dialog";
import WorkoutTemplateOptionsPopover from "./workout-template-options-popover";
import type { ExerciseHistory } from "@/lib/workouts/get-exercise-history";

export async function WorkoutTemplates({
	clientId,
	exerciseHistory,
}: {
	clientId: string;
	exerciseHistory: ExerciseHistory;
}) {
	const supabase = await createClient();

	const { data: templates, error } = await supabase
		.from("workout_templates")
		.select(
			`
            id,
            title,
            created_at,
            workout_template_exercises (
                id,
                name,
                notes,
                position,
                workout_template_sets (
                    id,
                    set_number
                )
            )
        `,
		)
		.eq("client_id", clientId)
		.order("created_at", {
			ascending: false,
		});

	if (error) {
		return (
			<p className="text-sm text-muted-foreground">
				Failed to load workout templates.
			</p>
		);
	}

	if (!templates || templates.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				No workout templates yet.
			</p>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{templates.map((template) => {
				const templateExercises = [
					...template.workout_template_exercises,
				].sort((a, b) => a.position - b.position);

				const totalSets = templateExercises.reduce(
					(total, exercise) =>
						total + exercise.workout_template_sets.length,
					0,
				);

				const initialExercises = templateExercises.map((exercise) => {
					const isPredefined = PREDEFINED_EXERCISES.some(
						(predefined) => predefined.name === exercise.name,
					);

					const sortedSets = [...exercise.workout_template_sets].sort(
						(a, b) => a.set_number - b.set_number,
					);

					const previousPerformance = exerciseHistory[exercise.name];

					return {
						name: exercise.name,
						notes: exercise.notes ?? "",
						isCustom: !isPredefined,
						sets: sortedSets.map((_, setIndex) => {
							const previousSet =
								previousPerformance?.sets[setIndex];

							return {
								reps: "",
								weight: "",
								previousReps:
									previousSet?.reps != null
										? String(previousSet.reps)
										: undefined,
								previousWeight:
									previousSet?.weight != null
										? String(previousSet.weight)
										: undefined,
							};
						}),
					};
				});

				return (
					<Card key={template.id} className="shadow-none">
						<CardHeader className="flex w-full flex-row items-start justify-between gap-3 pt-4">
							<CardTitle className="mt-2 text-xl">
								{template.title}
							</CardTitle>

							<WorkoutTemplateOptionsPopover
								template={template}
								clientId={clientId}
							/>
						</CardHeader>

						<CardContent className="space-y-5">
							<div className="flex gap-2 text-sm text-muted-foreground">
								<span>
									{templateExercises.length} Exercises
								</span>
								<span>•</span>
								<span>{totalSets} Sets</span>
							</div>

							{/* <div className="space-y-1">
								{templateExercises.map((exercise) => (
									<p key={exercise.id} className="text-sm">
										{exercise.name}
										<span className="ml-2 text-muted-foreground">
											{
												exercise.workout_template_sets
													.length
											}{" "}
											sets
										</span>
									</p>
								))}
							</div> */}

							<AddWorkoutDialog
								clientId={clientId}
								initialTitle={template.title}
								initialExercises={initialExercises}
								triggerLabel="Start Workout"
								className="w-full"
							/>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
