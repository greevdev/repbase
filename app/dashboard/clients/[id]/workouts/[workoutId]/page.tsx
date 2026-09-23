import { Spinner } from "@/components/ui/spinner";
import WorkoutDetails from "@/components/workouts/workout-details";
import { Suspense } from "react";

export default function WorkoutPage({
	params,
}: {
	params: Promise<{ workoutId: string }>;
}) {
	return (
		<Suspense
			fallback={
				<div className="text-muted-foreground w-max mx-auto flex items-center gap-2 text-xl">
					Loading
					<Spinner />
				</div>
			}
		>
			<WorkoutDetails params={params} />
		</Suspense>
	);
}
