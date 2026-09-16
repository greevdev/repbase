"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addExercise } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type ExerciseSet = {
	reps: string;
	weight: string;
};

export function AddExerciseDialog({
	workoutId,
	clientId,
}: {
	workoutId: string;
	clientId: string;
}) {
	const [open, setOpen] = useState(false);

	const [sets, setSets] = useState<ExerciseSet[]>([
		{
			reps: "",
			weight: "",
		},
	]);

	function addSet() {
		setSets([
			...sets,
			{
				reps: "",
				weight: "",
			},
		]);
	}

	function removeSet(index: number) {
		setSets(sets.filter((_, i) => i !== index));
	}

	function updateSet(index: number, field: keyof ExerciseSet, value: string) {
		setSets(
			sets.map((set, i) =>
				i === index
					? {
							...set,
							[field]: value,
						}
					: set,
			),
		);
	}

	async function handleSubmit(formData: FormData) {
		const result = await addExercise(workoutId, clientId, formData, sets);

		if (result.success) {
			setOpen(false);

			setSets([
				{
					reps: "",
					weight: "",
				},
			]);

			toast.success("Exercise added successfully");
		} else {
			toast.error(result.error ?? "Failed to add exercise");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 size-4" />
					Add exercise
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add exercise</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-5">
					<Input name="name" placeholder="Exercise name" required />

					<div className="space-y-3">
						{sets.map((set, index) => (
							<div
								key={index}
								className="flex items-center gap-2"
							>
								<span className="w-12 text-sm text-muted-foreground">
									Set {index + 1}
								</span>

								<Input
									type="number"
									placeholder="Reps"
									min="1"
									value={set.reps}
									onChange={(e) =>
										updateSet(index, "reps", e.target.value)
									}
									required
								/>

								<Input
									type="number"
									placeholder="Weight"
									min="0"
									step="0.5"
									value={set.weight}
									onChange={(e) =>
										updateSet(
											index,
											"weight",
											e.target.value,
										)
									}
								/>

								{sets.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeSet(index)}
									>
										<Trash2 className="size-4" />
									</Button>
								)}
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							onClick={addSet}
						>
							<Plus className="mr-2 size-4" />
							Add set
						</Button>
					</div>

					<Textarea name="notes" placeholder="Notes" />

					<Button type="submit" className="w-full">
						Add exercise
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
