import { createClient } from "@/lib/server";
import { ClientsGrid } from "./clients-grid";

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

	if (error) {
		return <p>Failed to load clients.</p>;
	}

	return (
		<div className="space-y-4">
			

			<ClientsGrid clients={clients} />
		</div>
	);
}
