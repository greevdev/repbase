import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const workouts = [
	{
		id: 1,
		name: "Upper A",
		exercises: 6,
	},
	{
		id: 2,
		name: "Lower A",
		exercises: 5,
	},
];

export default function ClientPage() {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-muted-foreground">Client</p>

					<h1 className="text-3xl font-bold tracking-tight">
						Ivan Petrov
					</h1>
				</div>

				<Button>
					<Plus className="mr-2 size-4" />
					Add workout
				</Button>
			</div>

			<div className="space-y-3">
				{workouts.map((workout) => (
					<Card key={workout.id}>
						<CardContent className="flex items-center justify-between p-6">
							<div>
								<h2 className="font-semibold">
									{workout.name}
								</h2>

								<p className="text-sm text-muted-foreground">
									{workout.exercises} exercises
								</p>
							</div>

							<Button variant="outline">Open</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
