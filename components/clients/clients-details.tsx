import { Users2 } from "lucide-react";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import { createClient } from "@/lib/server";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import LetterAvatar from "../letter-avatar";
import Link from "next/link";

export default async function ClientsDetails() {
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
		<div className="space-y-4">
			<div className="flex items-center justify-between md:gap-7">
				<h3 className="font-semibold text-sm md:text-lg flex items-center gap-1 md:gap-2 border-b-2 border-accent pb-1">
					<Users2 className="text-accent size-4 md:size-6" />
					<span className="whitespace-nowrap text-accent">
						All Clients ({clients.length})
					</span>
				</h3>

				<AddClientDialog />
			</div>

			<div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
										<LetterAvatar
											className=""
											clientId={client.id}
										/>{" "}
										<div>
											<p>{client.name}</p>

											<p className="text-sm italic text-muted-foreground font-normal">
												{client.goal}
											</p>
										</div>
									</CardTitle>
								</CardHeader>

								<div className="px-5 pb-5">
									<div className="h-px w-full bg-foreground/5" />
								</div>

								<CardContent className="flex justify-between items-center mr-10">
									<div className="space-y-2">
										<p className="text-xs font-medium text-foreground/50 tracking-widest">
											LAST WORKOUT
										</p>

										{lastWorkout ? (
											<>
												<p className="text-sm font-medium tracking-wide hidden sm:block">
													{lastWorkout.title}
												</p>

												<p className="text-sm font-medium tracking-wide sm:hidden">
													{formatWorkoutDate(
														lastWorkout.date,
													)}
												</p>
											</>
										) : (
											<p className="text-sm text-muted-foreground">
												No workouts yet
											</p>
										)}
									</div>

									<div className="space-y-2 hidden sm:block">
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
		</div>
	);
}
