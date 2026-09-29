import { createClient } from "@/lib/supabase/server";

export default async function WeeklySessions() {
	const supabase = await createClient();

	const now = new Date();

	const startOfWeek = new Date(now);
	const day = startOfWeek.getDay();

	const diff = day === 0 ? -6 : 1 - day;

	startOfWeek.setDate(startOfWeek.getDate() + diff);
	startOfWeek.setHours(0, 0, 0, 0);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(endOfWeek.getDate() + 7);

	const { count, error } = await supabase
		.from("workouts")
		.select(
			`
            id,
            clients!inner (
                user_id
            )
            `,
			{
				count: "exact",
				head: true,
			},
		)
		.gte("date", startOfWeek.toLocaleDateString("en-CA"))
		.lt("date", endOfWeek.toLocaleDateString("en-CA"));

	if (error) {
		console.error(error);
	}

	return count;
}
