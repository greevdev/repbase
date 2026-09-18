import { createClient } from "@/lib/server";

export default async function ActiveClients() {
	const supabase = await createClient();

	const { data: clients, error } = await supabase
		.from("clients")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) return <p>Failed to load clients.</p>;

	return clients.length;
}
