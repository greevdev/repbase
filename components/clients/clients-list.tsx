import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LetterAvatar from "../letter-avatar";
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
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
							</CardContent>
						</Card>
					</Link>
				))
			) : (
				<p>You don't have any clients currently.</p>
			)}
		</div>
	);
}
