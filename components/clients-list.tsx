import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditClientDialog } from "./edit-client-dialog";
import { DeleteClientDialog } from "@/components/delete-client-dialog";
import Link from "next/link";

export default async function ClientsList() {
	const supabase = await createClient();

	const { data: clients, error } = await supabase
		.from("clients")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) return <p>Failed to load clients.</p>;

	const currentYear = new Date().getFullYear();

	return (
		<>
			{clients && clients.length > 0 ? (
				clients.map((client) => (
					<Link
						key={client.id}
						href={`/dashboard/clients/${client.id}`}
					>
						<Card className="cursor-pointer transition hover:shadow-lg">
							<CardHeader>
								<CardTitle className="text-lg">
									{client.name}
								</CardTitle>
							</CardHeader>

							{/* <CardContent className="space-y-4">
							<div>
								{client.goal && (
									<p className="text-sm">
										Goal: {client.goal}
									</p>
								)}

								{client.year_of_birth && (
									<p className="text-sm">
										{currentYear - client.year_of_birth}{" "}
										years old
									</p>
								)}

								{client.notes && (
									<p className="text-sm text-muted-foreground">
										{client.notes}
									</p>
								)}
							</div>

							<div className="space-x-3">
								<EditClientDialog client={client} />

								<DeleteClientDialog
									clientId={client.id}
									clientName={client.name}
								/>
							</div>
						</CardContent> */}
						</Card>
					</Link>
				))
			) : (
				<p>You don't have any clients currently.</p>
			)}
		</>
	);
}
