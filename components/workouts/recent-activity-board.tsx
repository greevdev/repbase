import { createClient } from "@/lib/supabase/server";
import LetterAvatar from "../letter-avatar";
import Link from "next/link";

export default async function RecentActivityBoard() {
	const supabase = await createClient();

	const { data: workouts, error: workoutsError } = await supabase.from(
		"workouts",
	).select(`*,
            clients (name)`);

	if (workoutsError) return <p>workoutsError.message</p>;

	const { data: clients, error: clientsError } = await supabase
		.from("clients")
		.select("*");

	if (clientsError) return <p>clientsError.message</p>;

	function formatWorkoutDate(date: string) {
		return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
			weekday: "short",
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	}

	return (
		<div className="bg-white border border-foreground/15 rounded-xl overflow-hidden">
			<div className="p-5">
				<h3 className="font-semibold">Recent Client Activity</h3>
			</div>

			<div className="bg-background grid grid-cols-3 gap-1 px-5 py-2 text-[0.8rem] text-foreground/70 border-t border-foreground/5">
				<p>Client</p>
				<p>Program</p>
				<p>Date</p>
			</div>

			<div>
				{workouts ? (
					workouts.map((workout) => (
						<Link
							href={`/dashboard/clients/${workout.client_id}/workouts/${workout.id}`}
							key={workout.id}
							className="px-5 py-3 grid grid-cols-3 gap-1 border-t border-foreground/5 items-center text-[0.9rem] hover:bg-background/60 transition"
						>
							<div className="flex items-center gap-3">
								<LetterAvatar
									clientName={workout.clients?.name}
								/>
								<p className="font-semibold">
									{workout.clients?.name}
								</p>
							</div>

							<p className="font-medium text-muted-foreground">
								{workout.title}
							</p>

							<p className="font-medium text-muted-foreground">
								{formatWorkoutDate(workout.date)}
							</p>
						</Link>
					))
				) : (
					<p>No recent activity</p>
				)}
			</div>
		</div>
	);
}
