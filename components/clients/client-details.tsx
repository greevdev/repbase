import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AddWorkoutDialog } from "@/components/workouts/add-workout-dialog";
import WorkoutCard from "../workouts/workout-card";
import Link from "next/link";
import LetterAvatar from "../letter-avatar";
import { ChevronRight } from "lucide-react";
import { EditClientDialog } from "./edit-client-dialog";
import { DeleteClientDialog } from "./delete-client-dialog";

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
		.order("date", { ascending: false });

	let lastWorkoutDate = "No workouts";

	if (workouts?.length != 0 && workouts != null) {
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
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<Link
						href="/dashboard"
						className="transition hover:text-black"
					>
						Dashboard
					</Link>
					<ChevronRight className="text-foreground/30" size={16} />
					<p className="font-semibold text-foreground">
						{client.name}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<EditClientDialog client={client} />
					<DeleteClientDialog
						clientName={client.name}
						clientId={client.id}
					/>
				</div>
			</div>

			<div className="flex flex-col justify-between gap-5 rounded-xl border border-foreground/10 bg-white p-5 text-lg md:p-7 lg:flex-row lg:gap-0">
				<div className="flex items-center gap-3 md:gap-5">
					<LetterAvatar
						clientId={client.id}
						className="size-16 border-4 border-white shadow-lg lg:size-20"
					/>

					<div className="space-y-1">
						<h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
							{client.name}
						</h1>

						<div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
							{client.goal && <p>Goal - {client.goal}</p>}

							{client.goal && client.year_of_birth && (
								<div>•</div>
							)}

							{client.year_of_birth && (
								<p>
									{currentYear - client.year_of_birth} years
									old
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex justify-between gap-5 lg:flex-col">
					<div className="space-y-1">
						<p className="text-xs font-bold tracking-wide text-foreground/50 md:text-sm">
							JOIN DATE
						</p>

						<p className="text-sm">{clientJoinDate}</p>
					</div>

					<div className="space-y-1">
						<p className="text-xs font-bold tracking-wide text-foreground/50 md:text-sm">
							LAST ACTIVITY
						</p>

						<p className="text-sm">
							{workouts?.length != 0
								? lastWorkoutDate
								: "No workouts"}
						</p>
					</div>
				</div>
			</div>

			<div>
				<div className="mb-4 flex items-center justify-between gap-5">
					<h2 className="text-xl font-semibold">Workouts</h2>

					<div className="hidden h-px w-full bg-gray-200 md:block" />

					<AddWorkoutDialog clientId={id} />
				</div>

				{workouts && workouts.length > 0 ? (
					<div className="grid gap-3 lg:grid-cols-2">
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
