import { CalendarClock } from "lucide-react";
import { NextSessionContent } from "./next-session-content";
import { createClient } from "@/lib/supabase/server";

export async function NextSessionCard() {
	const supabase = await createClient();

	const { data: session, error } = await supabase
		.from("scheduled_workouts")
		.select(
			`
            id,
            title,
            scheduled_at,
            clients (
                name
            )
        `,
		)
		.gte("scheduled_at", new Date().toISOString())
		.order("scheduled_at", {
			ascending: true,
		})
		.limit(1)
		.maybeSingle();

	if (error) {
		console.error("Failed to load next session:", error);
	}

	return (
		<div className="dashboard-card flex h-full flex-col gap-3">
			<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground md:text-sm">
				<CalendarClock className="size-5" />
				<p>Next Session</p>
			</div>

			{session ? (
				<NextSessionContent scheduledAt={session.scheduled_at} />
			) : (
				<p className="text-2xl font-bold">None</p>
			)}
		</div>
	);
}
