import { CalendarDays, Clock3 } from "lucide-react";
import { createGoogleCalendarUrl } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import GoogleCalendar from "@/public/google_calendar.webp";
import Image from "next/image";
import { SessionDateTime } from "@/components/workouts/session-date-time";
import Link from "next/link";
import ScheduledWorkoutOptionsPopover from "./scheduled-workout-options-popover";

export async function UpcomingSessions({
	clientId,
	clientName,
}: {
	clientId: string;
	clientName: string;
}) {
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

				const googleCalendarUrl = createGoogleCalendarUrl({
					title: session.title,
					start: scheduledDate,
					durationMinutes: session.duration_minutes,
					clientName,
					notes: session.notes,
				});

				return (
					<Card key={session.id} className="shadow-none">
						<CardContent className="flex items-center justify-between gap-4 p-4">
							<div className="w-full">
								<div className="flex items-center justify-between">
									<p className="truncate text-base font-semibold">
										{session.title}
									</p>

									<ScheduledWorkoutOptionsPopover
										workout={session}
										clientId={clientId}
									/>
								</div>

								<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
									<div className="flex items-center gap-1.5">
										<CalendarDays className="size-4" />
										<SessionDateTime
											scheduledAt={session.scheduled_at}
										/>
									</div>

									<div className="flex items-center gap-1.5">
										<Clock3 className="size-4" />
										<span>
											{session.duration_minutes} min
										</span>
									</div>
								</div>

								{session.notes && (
									<p className="mt-2 text-sm text-muted-foreground">
										{session.notes}
									</p>
								)}

								<Button
									asChild
									variant="outline"
									className="mt-3 shrink-0 rounded-lg bg-white shadow-none hover:bg-gray-200"
								>
									<Link
										href={googleCalendarUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Image
											alt="Google Calendar"
											src={GoogleCalendar}
											className="size-6"
										/>
										Google Calendar
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
