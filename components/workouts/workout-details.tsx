import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditWorkoutDialog } from "./edit-workout-dialog";
import { DeleteWorkoutDialog } from "./delete-workout-dialog";
import Link from "next/link";
import {
	ChevronRight,
	CalendarDays,
	ListChecksIcon,
	MessageCircleMore,
} from "lucide-react";
import clsx from "clsx";

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

	const { data: client } = await supabase
		.from("clients")
		.select(`name`)
		.eq("id", workout.client_id)
		.single();

	const exercises = [...workout.workout_exercises].sort(
		(a, b) => a.position - b.position,
	);

	const workoutDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${workout.date}T00:00:00Z`));

	return (
		<div className="space-y-8">
			<div className="flex items-center gap-1 text-sm text-muted-foreground">
				<Link href="/dashboard" className="transition hover:text-black">
					Dashboard
				</Link>
				<ChevronRight className="text-foreground/30" size={16} />
				<Link
					href={`/dashboard/clients/${workout.client_id}`}
					className="transition hover:text-black"
				>
					{client?.name}
				</Link>
				<ChevronRight className="text-foreground/30" size={16} />
				<p className="font-semibold text-foreground">{workout.title}</p>
			</div>

			<div className="flex flex-col items-start justify-between gap-5 rounded-xl border border-foreground/10 bg-white p-7 sm:flex-row sm:gap-1">
				<div className="space-y-3">
					<h1 className="flex items-center gap-4 text-2xl font-bold sm:text-3xl">
						<span>{workout.title}</span>
						<span className="rounded-xl bg-emerald-100 px-3 text-[0.6rem] font-semibold tracking-wider text-accent sm:py-1 sm:text-xs">
							COMPLETED
						</span>
					</h1>

					<p className="flex items-center gap-2 text-[0.8rem] text-muted-foreground sm:text-[0.9rem]">
						<CalendarDays size={20} />
						<span>{workoutDate}</span>
					</p>
				</div>

				<div className="flex w-full gap-2 sm:w-auto">
					<EditWorkoutDialog
						workout={workout}
						clientId={workout.client_id}
						className="w-full"
					/>
					<DeleteWorkoutDialog
						clientId={workout.client_id}
						workoutId={workoutId}
						className="w-full"
					/>
				</div>
			</div>

			<h1 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
				<ListChecksIcon className="size-6 text-accent sm:size-7" />
				<span>Exercise Breakdown</span>
			</h1>

			{exercises.length > 0 ? (
				<div className="space-y-6">
					{exercises.map((exercise) => {
						const sets = [...exercise.exercise_sets].sort(
							(a, b) => a.set_number - b.set_number,
						);

						return (
							<div
								key={exercise.id}
								className="overflow-hidden rounded-xl border bg-white"
							>
								<h2 className="border-b border-foreground/5 bg-[#fcfcfd] p-4 font-semibold sm:p-7 sm:text-lg">
									{exercise.name}
								</h2>

								<div className="grid grid-cols-4 px-4 py-3 text-[0.6rem] font-semibold tracking-wider text-foreground/50 sm:px-7 sm:text-[0.7rem]">
									<p>SET</p>
									<p>WEIGHT</p>
									<p>REPS</p>
									<p>VOLUME</p>
								</div>

								<div className="">
									{sets.map((set) => (
										<div
											key={set.id}
											className={clsx(
												"grid grid-cols-4 px-4 py-3 text-sm font-semibold sm:px-7 sm:text-base",
												set.set_number != 1 &&
													"border-t border-foreground/5",
												set.set_number % 2 == 0 &&
													"bg-[#fcfcfd]",
											)}
										>
											<p>{set.set_number}</p>

											<p>{set.weight} kg</p>

											<p>{set.reps}</p>

											<p className="font-normal italic text-muted-foreground">
												{set.reps * set.weight} kg
											</p>
										</div>
									))}
								</div>

								{exercise.notes && (
									<p className="flex items-center border-t border-foreground/5 px-4 py-4 text-xs font-normal tracking-wide sm:px-7 sm:text-sm">
										<MessageCircleMore
											size={18}
											className="mr-2 text-muted-foreground"
										/>
										<span className="mr-1 font-bold">
											Notes:
										</span>{" "}
										{exercise.notes}
									</p>
								)}
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
