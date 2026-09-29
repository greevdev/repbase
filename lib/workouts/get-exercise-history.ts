import { createClient } from "@/lib/supabase/server";

export type ExerciseHistory = Record<
	string,
	{
		name: string;
		sets: {
			reps: number | null;
			weight: number | null;
		}[];
	}
>;

export async function getExerciseHistory(
	clientId: string,
): Promise<ExerciseHistory> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("workouts")
		.select(
			`
            id,
            date,
            created_at,
            workout_exercises (
                name,
                position,
                exercise_sets (
                    set_number,
                    reps,
                    weight
                )
            )
        `,
		)
		.eq("client_id", clientId)
		.order("date", {
			ascending: false,
		})
		.order("created_at", {
			ascending: false,
		});

	if (error || !data) {
		return {};
	}

	const history: Record<
		string,
		{
			name: string;
			sets: {
				reps: number | null;
				weight: number | null;
			}[];
		}
	> = {};

	for (const workout of data) {
		for (const exercise of workout.workout_exercises) {
			if (history[exercise.name]) {
				continue;
			}

			const sets = [...exercise.exercise_sets]
				.sort((a, b) => a.set_number - b.set_number)
				.map((set) => ({
					reps: set.reps,
					weight: set.weight,
				}));

			history[exercise.name] = {
				name: exercise.name,
				sets,
			};
		}
	}

	return history;
}
