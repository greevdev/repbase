import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClientsList() {
	const supabase = await createClient();

	const { data: clients, error } = await supabase
		.from("clients")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) return <p>Failed to load clients.</p>;

	return (
		<>
			{clients && clients.length > 0 ? (
				clients.map((client) => (
					<Card
						key={client.id}
						className="cursor-pointer transition hover:shadow-md"
					>
						<CardHeader>
							<CardTitle className="text-lg">
								{client.name}
							</CardTitle>
						</CardHeader>

						<CardContent>
							<p className="text-sm text-muted-foreground">
								{client.notes}
							</p>
						</CardContent>
					</Card>
				))
			) : (
				<p>You don't have any clients currently.</p>
			)}
		</>
	);
}
