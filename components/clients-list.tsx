import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditClientDialog } from "./edit-client-dialog";
import { DeleteClientDialog } from "@/components/delete-client-dialog";
import Link from "next/link";
import LetterAvatar from "./letter-avatar";
import { ArrowRightIcon } from "lucide-react";

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
						<Card className="cursor-pointer transition hover:shadow-lg hover:shadow-neutral-200/80 shadow-neutral-100">
							<CardHeader>
								<CardTitle className="text-lg flex space-x-3 items-center">
									<LetterAvatar clientName={client.name} />{" "}
									<span>{client.name}</span>
								</CardTitle>
							</CardHeader>

							<CardContent className="flex space-x-1 items-center text-muted-foreground">
								<p className="font-medium">View client</p>
								<ArrowRightIcon size={20} />
								{/* <div>
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
								</div> */}
							</CardContent>
						</Card>
					</Link>
				))
			) : (
				<p>You don't have any clients currently.</p>
			)}
		</>
	);
}
