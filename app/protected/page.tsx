import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const clients = [
	{
		id: 1,
		name: "Ivan Petrov",
		workouts: 4,
	},
	{
		id: 2,
		name: "Maria Ivanova",
		workouts: 3,
	},
];

export default function DashboardPage() {
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
				{clients.map((client) => (
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
				))}
			</div>
		</div>
	);
}
