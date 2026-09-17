import WorkoutDetails from "@/components/workouts/workout-details";
import { Suspense } from "react";

export default function WorkoutPage({
	params,
}: {
	params: Promise<{ workoutId: string }>;
}) {
	return (
		<Suspense fallback="Loading...">
			<WorkoutDetails params={params} />
		</Suspense>
	);
}
