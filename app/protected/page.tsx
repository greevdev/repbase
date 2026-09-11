import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/client";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
	const supabase = await createClient();

	const { data: clients } = await supabase
		.from("clients")
		.select("*")
		.order("created_at", { ascending: false });

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Clients
					</h1>

					<p className="mt-1 text-muted-foreground">
						Manage your clients and their training programs.
					</p>
				</div>

				<Button>
					<Plus className="mr-2 size-4" />
					Add client
				</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
									{client.workouts} workouts
								</p>
							</CardContent>
						</Card>
					))
				) : (
					<p>You don't have any clients currently.</p>
				)}
			</div>
		</div>
	);
}
