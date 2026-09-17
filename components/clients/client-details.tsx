import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AddWorkoutDialog } from "@/components/workouts/add-workout-dialog";
import WorkoutCard from "../workouts/workout-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

	const { data: workouts } = await supabase
		.from("workouts")
		.select("*")
		.eq("client_id", id)
		.order("created_at", { ascending: true });

	return (
		<div className="space-y-8">
			<div className="flex justify-between">
				<div className="space-y-1">
					<Link
						href="/dashboard"
						className="text-sm text-muted-foreground hover:text-black transition flex gap-1 items-center mb-2"
					>
						<ArrowLeft size={18} />{" "}
						<span className="">Dashboard</span>
					</Link>

					<h1 className="text-3xl font-bold tracking-tight">
						{client.name}
					</h1>

					{client.goal && (
						<p className="mt-1 text-muted-foreground">
							Goal - {client.goal}
						</p>
					)}
				</div>
			</div>

			<div>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Workouts</h2>

					<AddWorkoutDialog clientId={id} />
				</div>

				{workouts && workouts.length > 0 ? (
					<div className="space-y-3">
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
