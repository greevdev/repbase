import { createClient } from "@/lib/supabase/server";
import LetterAvatar from "../letter-avatar";
import { Activity } from "lucide-react";
import Link from "next/link";

export default async function RecentActivityBoard() {
	const supabase = await createClient();

	const { data: workouts, error: workoutsError } = await supabase
		.from("workouts")
		.select(
			`*,
            clients (name)`,
		)
		.order("date", { ascending: false })
		.limit(5);

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

	function formatWorkoutDateMobile(date: string) {
		return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
			year: "2-digit",
		});
	}

	return (
		<div className="bg-white border border-foreground/15 rounded-xl overflow-hidden">
			<div className="p-4">
				<h3 className="font-semibold md:text-lg flex items-center gap-2">
					<Activity className="text-accent" />
					<span className="whitespace-nowrap">Recent Activity</span>
				</h3>
			</div>

			<div className="bg-background grid grid-cols-3 gap-1 px-4 py-2 text-xs md:text-[0.8rem] text-foreground/70 border-t border-foreground/5">
				<p>Client</p>
				<p className="md:hidden">Date</p>
				<p>Program</p>
				<p className="hidden md:block">Date</p>
			</div>

			<div>
				{workouts ? (
					workouts.map((workout) => (
						<Link
							href={`/dashboard/clients/${workout.client_id}/workouts/${workout.id}`}
							key={workout.id}
							className="px-4 py-3 grid grid-cols-3 gap-1 border-t border-foreground/5 items-center text-[0.9rem] hover:bg-background/60 transition"
						>
							<div className="flex items-center gap-3">
								<LetterAvatar
									className="hidden md:block"
									clientId={workout.client_id}
								/>
								<p className="font-semibold text-sm md:text-[0.9rem]">
									{workout.clients?.name}
								</p>
							</div>

							<p className="text-muted-foreground text-xs md:text-[0.9rem] md:hidden">
								{formatWorkoutDateMobile(workout.date)}
							</p>

							<p className="text-muted-foreground text-xs md:text-[0.9rem]">
								{workout.title}
							</p>

							<p className="text-muted-foreground text-xs md:text-[0.9rem] hidden md:block">
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
