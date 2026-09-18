import { createClient } from "@/lib/supabase/server";

export default async function MonthlyRevenue() {
	const supabase = await createClient();

	const rate = 10;

	const now = new Date();

	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

	const formatDate = (date: Date) => date.toLocaleDateString("en-CA");

	const { count, error } = await supabase
		.from("workouts")
		.select("*", {
			count: "exact",
			head: true,
		})
		.gte("date", formatDate(startOfMonth))
		.lt("date", formatDate(startOfNextMonth));

	if (error) {
		return <p>Failed to calculate revenue.</p>;
	}

	const monthlyRevenue = (count ?? 0) * rate;

	return monthlyRevenue;
}
