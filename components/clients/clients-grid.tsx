"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Users2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LetterAvatar from "@/components/letter-avatar";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddClientDialog } from "./add-client-dialog";

type Workout = {
	id: string;
	title: string;
	date: string;
};

type Client = {
	id: string;
	name: string;
	goal: string | null;
	created_at: string;
	workouts: Workout[];
};

type SortOption = "newest" | "oldest" | "alphabetical" | "recent-activity";

export function ClientsGrid({ clients }: { clients: Client[] }) {
	const [sortBy, setSortBy] = useState<SortOption>("newest");

	function getLatestWorkout(client: Client) {
		return [...client.workouts].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		)[0];
	}

	const sortedClients = useMemo(() => {
		const sorted = [...clients];

		switch (sortBy) {
			case "oldest":
				return sorted.sort(
					(a, b) =>
						new Date(a.created_at).getTime() -
						new Date(b.created_at).getTime(),
				);

			case "newest":
				return sorted.sort(
					(a, b) =>
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime(),
				);

			case "alphabetical":
				return sorted.sort((a, b) => a.name.localeCompare(b.name));

			case "recent-activity":
				return sorted.sort((a, b) => {
					const latestA = getLatestWorkout(a);
					const latestB = getLatestWorkout(b);

					if (!latestA && !latestB) {
						return 0;
					}

					if (!latestA) {
						return 1;
					}

					if (!latestB) {
						return -1;
					}

					return (
						new Date(latestB.date).getTime() -
						new Date(latestA.date).getTime()
					);
				});

			default:
				return sorted;
		}
	}, [clients, sortBy]);

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

	function getSortLabel() {
		switch (sortBy) {
			case "newest":
				return "Newest";
			case "oldest":
				return "Oldest";
			case "alphabetical":
				return "Alphabetical";
			case "recent-activity":
				return "Recent activity";
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<h3 className="flex items-center gap-1 border-b-2 border-accent pb-1 text-sm font-semibold md:gap-2 md:text-lg">
					<Users2 className="size-4 text-accent md:size-6" />

					<span className="whitespace-nowrap text-accent">
						All Clients ({clients.length})
					</span>
				</h3>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="rounded-lg bg-white py-5 text-xs hover:bg-gray-100 sm:text-sm"
						>
							<ArrowUpDown className="size-4" />
							Sort by {getSortLabel()}
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => setSortBy("newest")}
							className="focus:bg-gray-100"
						>
							Newest
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => setSortBy("oldest")}
							className="focus:bg-gray-100"
						>
							Oldest
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => setSortBy("alphabetical")}
							className="focus:bg-gray-100"
						>
							A-Z
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => setSortBy("recent-activity")}
							className="focus:bg-gray-100"
						>
							Recent activity
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="overflow-hidden rounded-2xl border border-muted-foreground/15 bg-[#fcfcfd] shadow-lg shadow-muted-foreground/10">
				<div className="grid grid-cols-3 px-4 py-5 text-[0.6rem] font-bold tracking-wider text-muted-foreground/70 sm:px-7 sm:text-xs">
					<p>CLIENT</p>
					<p>LAST WORKOUT</p>
					<p>LAST ACTIVE</p>
				</div>

				<div>
					{sortedClients.length > 0 ? (
						sortedClients.map((client) => {
							const lastWorkout = getLatestWorkout(client);

							return (
								<Link
									key={client.id}
									href={`/dashboard/clients/${client.id}`}
								>
									<div className="grid grid-cols-3 items-center border-t border-muted-foreground/15 bg-white px-4 py-4 sm:px-7">
										<div className="flex items-center text-lg sm:space-x-3">
											<LetterAvatar
												className="hidden sm:block"
												clientId={client.id}
											/>

											<div>
												<p className="text-sm font-medium sm:text-lg">
													{client.name}
												</p>

												<p className="hidden text-xs font-normal italic text-muted-foreground sm:block sm:text-sm">
													{client.goal}
												</p>
											</div>
										</div>

										{lastWorkout ? (
											<p className="text-xs font-medium tracking-wide sm:text-base">
												{lastWorkout.title}
											</p>
										) : (
											<>
												<p className="hidden text-base text-muted-foreground sm:block">
													No workouts yet
												</p>

												<p className="text-xs text-muted-foreground sm:hidden">
													No workouts
												</p>
											</>
										)}

										{lastWorkout ? (
											<p className="text-xs font-medium tracking-wide sm:text-base">
												{formatWorkoutDate(
													lastWorkout.date,
												)}
											</p>
										) : (
											<>
												<p className="hidden text-base text-muted-foreground sm:block">
													No workouts yet
												</p>

												<p className="text-xs text-muted-foreground sm:hidden">
													No workouts
												</p>
											</>
										)}
									</div>
								</Link>
							);
						})
					) : (
						<p>You don't have any clients currently.</p>
					)}
				</div>
			</div>

			<div className="text-end">
				<AddClientDialog />
			</div>
		</div>
	);
}
