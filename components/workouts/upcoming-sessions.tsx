import { CalendarDays, Clock3 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export async function UpcomingSessions({ clientId }: { clientId: string }) {
	const supabase = await createClient();

	const now = new Date().toISOString();

	const { data: sessions, error } = await supabase
		.from("scheduled_workouts")
		.select(
			`
            id,
            title,
            scheduled_at,
            duration_minutes,
            notes
        `,
		)
		.eq("client_id", clientId)
		.gte("scheduled_at", now)
		.order("scheduled_at", {
			ascending: true,
		});

	if (error) {
		return (
			<p className="text-sm text-muted-foreground">
				Failed to load upcoming sessions.
			</p>
		);
	}

	if (!sessions || sessions.length === 0) {
		return (
			<div className="rounded-xl border border-dashed p-6 text-center">
				<CalendarDays className="mx-auto mb-3 size-6 text-muted-foreground" />

				<p className="font-medium">No upcoming sessions</p>

				<p className="mt-1 text-sm text-muted-foreground">
					Schedule the next workout for this client.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{sessions.map((session) => {
				const scheduledDate = new Date(session.scheduled_at);

				const date = scheduledDate.toLocaleDateString("en-GB", {
					day: "numeric",
					month: "short",
					year: "numeric",
				});

				const time = scheduledDate.toLocaleTimeString("en-GB", {
					hour: "2-digit",
					minute: "2-digit",
				});

				return (
					<Card key={session.id} className="shadow-none">
						<CardContent className="flex items-center justify-between gap-4 p-4">
							<div className="min-w-0">
								<p className="truncate text-base font-semibold">
									{session.title}
								</p>

								<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
									<div className="flex items-center gap-1.5">
										<CalendarDays className="size-4" />
										<span>{date}</span>
									</div>

									<div className="flex items-center gap-1.5">
										<Clock3 className="size-4" />
										<span>{time}</span>
									</div>

									<span>{session.duration_minutes} min</span>
								</div>

								{session.notes && (
									<p className="mt-2 text-sm text-muted-foreground">
										{session.notes}
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
