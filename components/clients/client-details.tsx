import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AddWorkoutDialog } from "@/components/workouts/add-workout-dialog";
import WorkoutCard from "../workouts/workout-card";
import Link from "next/link";
import LetterAvatar from "../letter-avatar";
import { ChevronRight } from "lucide-react";

type Workout = {
	id: string;
	title: string;
	date: string;
	notes: string | null;
	client_id: string;
};

export default async function ClientDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();

	const { data: client } = await supabase
		.from("clients")
		.select("*")
		.eq("id", id)
		.single();

	if (!client) {
		notFound();
	}

	const clientJoinDate = new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date(client.created_at));

	const { data: workouts } = await supabase
		.from("workouts")
		.select("*")
		.eq("client_id", id)
		.order("created_at", { ascending: true });

	let lastWorkoutDate = "No workouts";

	if (workouts) {
		lastWorkoutDate = new Intl.DateTimeFormat("en-US", {
			weekday: "long",
			month: "short",
			day: "numeric",
			year: "numeric",
			timeZone: "UTC",
		}).format(new Date(`${workouts[0].date}T00:00:00Z`));
	}

	const currentYear = new Date().getFullYear();

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-1 text-sm text-muted-foreground">
				<Link href="/dashboard" className="transition hover:text-black">
					Dashboard
				</Link>
				<ChevronRight className="text-foreground/30" size={16} />
				<p className="text-foreground font-semibold">{client.name}</p>
			</div>

			<div className="flex justify-between rounded-xl border border-foreground/10 bg-white p-7 text-lg">
				<div className="flex items-center gap-5">
					<LetterAvatar
						clientId={client.id}
						className="size-20 border-4 border-white shadow-lg"
					/>

					<div className="space-y-1">
						<h1 className="text-3xl font-bold tracking-tight">
							{client.name}
						</h1>

						{client.goal && (
							<div className="mt-1 text-muted-foreground text-sm flex items-center gap-2">
								<p>Goal - {client.goal}</p>
								<div>•</div>
								<p>
									{currentYear - client.year_of_birth} years
									old
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col justify-between gap-5">
					<div>
						<p className="text-sm font-bold tracking-wide text-foreground/50">
							JOIN DATE
						</p>

						<p className="text-sm">{clientJoinDate}</p>
					</div>

					<div>
						<p className="text-sm font-bold tracking-wide text-foreground/50">
							LAST ACTIVITY
						</p>

						<p className="text-sm">{lastWorkoutDate}</p>
					</div>
				</div>
			</div>

			<div>
				<div className="mb-4 flex items-center justify-between gap-5">
					<h2 className="text-xl font-semibold">Workouts</h2>

					<div className="h-px w-full bg-foreground/10" />

					<AddWorkoutDialog clientId={id} />
				</div>

				{workouts && workouts.length > 0 ? (
					<div className="grid grid-cols-2 gap-3">
						{workouts.map((workout: Workout) => (
							<WorkoutCard key={workout.id} workout={workout} />
						))}
					</div>
				) : (
					<p className="text-muted-foreground">No workouts yet.</p>
				)}
			</div>
		</div>
	);
}
