import { createClient } from "@/lib/supabase/server";
import LetterAvatar from "../letter-avatar";
import { Activity } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

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
		<div className="overflow-hidden rounded-xl border border-foreground/15 bg-white">
			<div className="p-4">
				<h3 className="flex items-center gap-2 font-semibold md:text-lg">
					<Activity className="text-accent" />
					<span className="whitespace-nowrap">Recent Activity</span>
				</h3>
			</div>

			<div className="grid grid-cols-3 gap-1 border-t border-foreground/5 bg-background px-4 py-2 text-xs text-foreground/70 md:text-[0.8rem]">
				<p>Client</p>
				<p className="md:hidden">Date</p>
				<p>Program</p>
				<p className="hidden md:block">Date</p>
			</div>

			<div>
				{workouts.length > 0 ? (
					workouts.map((workout, index: number) => (
						<Link
							href={`/dashboard/clients/${workout.client_id}/workouts/${workout.id}`}
							key={workout.id}
							className={clsx(
								"grid grid-cols-3 items-center gap-1 border-t border-foreground/5 px-4 py-3 text-[0.9rem] transition hover:bg-foreground/5",
								index % 2 != 0 && "bg-background/70",
							)}
						>
							<div className="flex items-center gap-3">
								<LetterAvatar
									className="hidden md:block"
									clientId={workout.client_id}
								/>
								<p className="text-sm font-semibold md:text-[0.9rem]">
									{workout.clients?.name}
								</p>
							</div>

							<p className="text-xs text-muted-foreground md:hidden md:text-[0.9rem]">
								{formatWorkoutDateMobile(workout.date)}
							</p>

							<p className="text-xs text-muted-foreground md:text-[0.9rem]">
								{workout.title}
							</p>

							<p className="hidden text-xs text-muted-foreground md:block md:text-[0.9rem]">
								{formatWorkoutDate(workout.date)}
							</p>
						</Link>
					))
				) : (
					<p className="px-4 py-3 text-center text-sm tracking-wide text-muted-foreground">
						No recent activity
					</p>
				)}
			</div>
		</div>
	);
}
