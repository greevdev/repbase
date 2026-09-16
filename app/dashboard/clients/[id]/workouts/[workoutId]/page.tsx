import WorkoutDetails from "@/components/workout-details";
import { Suspense } from "react";

export default function page({
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
