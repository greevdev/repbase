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
				<div className="mx-auto flex w-max items-center gap-2 text-xl text-muted-foreground">
					<Spinner />
				</div>
			}
		>
			<WorkoutDetails params={params} />
		</Suspense>
	);
}
