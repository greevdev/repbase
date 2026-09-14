import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AddWorkoutDialog } from "@/components/add-workout-dialog";

export default async function ClientDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();

	const { data: client } = await supabase
		.from("clients")
		.select("*")
		.eq("id", id)
		.single();

	if (!client) {
		notFound();
	}

	const { data: workouts } = await supabase
		.from("workouts")
		.select("*")
		.eq("client_id", id)
		.order("created_at", { ascending: true });

	return (
		<div className="space-y-8">
			<div className="flex justify-between">
				<div>
					<p className="text-sm text-muted-foreground">Client</p>

					<h1 className="text-3xl font-bold tracking-tight">
						{client.name}
					</h1>

					{client.goal && (
						<p className="mt-1 text-muted-foreground">
							{client.goal}
						</p>
					)}
				</div>

				<AddWorkoutDialog clientId={id} />
			</div>

			<div>
				<h2 className="mb-4 text-xl font-semibold">Workouts</h2>

				{workouts && workouts.length > 0 ? (
					<div className="space-y-3">
						{workouts.map((workout) => (
							<div
								key={workout.id}
								className="rounded-lg border p-4"
							>
								<h3 className="font-semibold">
									{workout.title}
								</h3>

								{workout.notes && (
									<p className="text-sm text-muted-foreground">
										{workout.notes}
									</p>
								)}

								{workout.date && (
									<p className="text-sm text-muted-foreground">
										{workout.date}
									</p>
								)}
							</div>
						))}
					</div>
				) : (
					<p className="text-muted-foreground">No workouts yet.</p>
				)}
			</div>
		</div>
	);
}
