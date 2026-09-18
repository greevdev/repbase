import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LetterAvatar from "../letter-avatar";

export default async function ClientsList() {
	const supabase = await createClient();

	const { data: clients, error } = await supabase
		.from("clients")
		.select(
			`
			*,
			workouts (
			id,
			title,
			date
			)
		`,
		)
		.order("created_at", { ascending: false });

	if (error) return <p>Failed to load clients.</p>;

	const currentYear = new Date().getFullYear();

	function formatWorkoutDate(dateString: string) {
		const [year, month, day] = dateString.split("-").map(Number);
		const date = new Date(year, month - 1, day);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		if (date.getTime() === today.getTime()) {
			return "Today";
		}

		if (date.getTime() === yesterday.getTime()) {
			return "Yesterday";
		}

		return date.toLocaleDateString("en-GB", {
			weekday: "short",
			day: "numeric",
			month: "short",
			...(date.getFullYear() !== today.getFullYear() && {
				year: "numeric",
			}),
		});
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{clients && clients.length > 0 ? (
				clients.map((client) => {
					const sortedWorkouts = [...client.workouts].sort(
						(a, b) =>
							new Date(b.date).getTime() -
							new Date(a.date).getTime(),
					);

					const lastWorkout = sortedWorkouts[0];

					return (
						<Card
							key={client.id}
							className="cursor-pointer transition hover:border-accent/50 h-full flex flex-col justify-between shadow-none"
						>
							<CardHeader>
								<CardTitle className="text-lg flex space-x-3 items-center">
									<LetterAvatar clientName={client.name} />{" "}
									<div>
										<p>{client.name}</p>

										<p className="text-sm italic text-muted-foreground font-normal">
											{client.goal}
										</p>
									</div>
								</CardTitle>
							</CardHeader>

							<CardContent className="flex justify-between items-center mr-10">
								<div className="space-y-2">
									<p className="text-xs font-medium text-foreground/50 tracking-widest">
										LAST WORKOUT
									</p>

									{lastWorkout ? (
										<p className="text-sm font-medium tracking-wide">
											{lastWorkout.title}
										</p>
									) : (
										<p className="text-sm text-muted-foreground">
											No workouts yet
										</p>
									)}
								</div>

								<div className="space-y-2">
									<p className="text-xs font-medium text-foreground/50 tracking-widest">
										LOG DATE
									</p>

									{lastWorkout ? (
										<p className="text-sm font-medium tracking-wide">
											{formatWorkoutDate(
												lastWorkout.date,
											)}
										</p>
									) : (
										<p className="text-sm text-muted-foreground">
											No workouts yet
										</p>
									)}
								</div>
							</CardContent>

							<Link
								className="bg-gray-100 text-center btn mx-5 mb-5 text-sm"
								href={`/dashboard/clients/${client.id}`}
							>
								View client
							</Link>
						</Card>
					);
				})
			) : (
				<p>You don't have any clients currently.</p>
			)}
		</div>
	);
}
