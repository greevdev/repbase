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
			<div className="text-sm text-muted-foreground flex items-center gap-1">
				<Link href="/dashboard" className="hover:text-black transition">
					Dashboard
				</Link>
				<ChevronRight className="text-foreground/30" size={16} />
				<Link
					href={`/dashboard/clients/${workout.client_id}`}
					className="hover:text-black transition"
				>
					{client?.name}
				</Link>
				<ChevronRight className="text-foreground/30" size={16} />
				<p className="text-foreground font-semibold">{workout.title}</p>
			</div>

			<div className="flex justify-between items-start bg-white p-7 rounded-xl border border-foreground/10">
				<div className="space-y-3">
					<h1 className="text-3xl font-bold flex items-center gap-4">
						<span>{workout.title}</span>
						<span className="text-xs tracking-wider font-semibold text-accent rounded-xl px-3 py-1 bg-emerald-100">
							COMPLETED
						</span>
					</h1>

					<p className="text-muted-foreground text-[0.9rem] flex items-center gap-2">
						<CalendarDays size={20} />
						<span>{workoutDate}</span>
					</p>
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

			<h1 className="text-xl font-semibold flex items-center gap-2">
				<ListChecksIcon className="text-accent" />
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
								className="rounded-xl border bg-white overflow-hidden"
							>
								<h2 className="text-lg font-semibold p-7 border-b border-foreground/5 bg-[#fcfcfd]">
									{exercise.name}
								</h2>

								<div className="grid grid-cols-4 text-[0.7rem] font-semibold tracking-wider text-foreground/50 px-7 py-3">
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
												"grid grid-cols-4 text-base font-semibold px-7 py-3",
												set.set_number != 1 &&
													"border-t border-foreground/5",
												set.set_number % 2 == 0 &&
													"bg-[#fcfcfd]",
											)}
										>
											<p>{set.set_number}</p>

											<p>{set.weight} kg</p>

											<p>{set.reps}</p>

											<p className="italic text-muted-foreground font-normal">
												{set.reps * set.weight} kg
											</p>
										</div>
									))}
								</div>

								{exercise.notes && (
									<p className="text-sm font-normal tracking-wide px-7 py-4 border-t border-foreground/5 flex items-center">
										<MessageCircleMore
											size={18}
											className="mr-2 text-muted-foreground"
										/>
										<span className="font-bold mr-1">
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
