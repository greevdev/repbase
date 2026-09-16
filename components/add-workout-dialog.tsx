"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addWorkout } from "@/app/dashboard/actions";
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

type Exercise = {
	name: string;
	notes: string;
	sets: ExerciseSet[];
};

export function AddWorkoutDialog({ clientId }: { clientId: string }) {
	const [open, setOpen] = useState(false);
	const [exercises, setExercises] = useState<Exercise[]>([]);

	function addExercise() {
		setExercises([
			...exercises,
			{
				name: "",
				notes: "",
				sets: [
					{
						reps: "",
						weight: "",
					},
				],
			},
		]);
	}

	function addSet(exerciseIndex: number) {
		setExercises(
			exercises.map((exercise, index) =>
				index === exerciseIndex
					? {
							...exercise,
							sets: [
								...exercise.sets,
								{
									reps: "",
									weight: "",
								},
							],
						}
					: exercise,
			),
		);
	}

	function updateExercise(
		index: number,
		field: "name" | "notes",
		value: string,
	) {
		setExercises(
			exercises.map((exercise, i) =>
				i === index
					? {
							...exercise,
							[field]: value,
						}
					: exercise,
			),
		);
	}

	function updateSet(
		exerciseIndex: number,
		setIndex: number,
		field: "reps" | "weight",
		value: string,
	) {
		setExercises(
			exercises.map((exercise, i) => {
				if (i !== exerciseIndex) {
					return exercise;
				}

				return {
					...exercise,
					sets: exercise.sets.map((set, j) =>
						j === setIndex
							? {
									...set,
									[field]: value,
								}
							: set,
					),
				};
			}),
		);
	}

	async function handleSubmit(formData: FormData) {
		const result = await addWorkout(clientId, formData, exercises);

		if (result.success) {
			setOpen(false);
			setExercises([]);
			toast.success("Workout saved");
		} else {
			toast.error(result.error ?? "Failed to save workout");
		}
	}

	const today = new Date().toLocaleDateString("en-CA");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-emerald-700 hover:bg-emerald-900">
					<Plus className="mr-1 size-4" />
					Log Workout
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Log Workout</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<Input
							name="title"
							placeholder="Workout title"
							required
						/>

						<Input
							name="date"
							type="date"
							defaultValue={today}
							required
						/>
					</div>

					<div className="space-y-4">
						{exercises.map((exercise, exerciseIndex) => (
							<div
								key={exerciseIndex}
								className="space-y-4 rounded-lg border p-4"
							>
								<Input
									placeholder="Exercise name"
									value={exercise.name}
									onChange={(e) =>
										updateExercise(
											exerciseIndex,
											"name",
											e.target.value,
										)
									}
									required
								/>

								<Textarea
									placeholder="Exercise notes"
									value={exercise.notes}
									onChange={(e) =>
										updateExercise(
											exerciseIndex,
											"notes",
											e.target.value,
										)
									}
								/>

								<div className="space-y-2">
									{exercise.sets.map((set, setIndex) => (
										<div
											key={setIndex}
											className="flex items-center gap-2"
										>
											<span className="w-12 text-sm">
												Set {setIndex + 1}
											</span>

											<Input
												type="number"
												placeholder="Reps"
												value={set.reps}
												onChange={(e) =>
													updateSet(
														exerciseIndex,
														setIndex,
														"reps",
														e.target.value,
													)
												}
											/>

											<Input
												type="number"
												step="0.5"
												placeholder="kg"
												value={set.weight}
												onChange={(e) =>
													updateSet(
														exerciseIndex,
														setIndex,
														"weight",
														e.target.value,
													)
												}
											/>
										</div>
									))}
								</div>

								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => addSet(exerciseIndex)}
								>
									Add set
								</Button>
							</div>
						))}
					</div>

					<Button
						type="button"
						variant="outline"
						onClick={addExercise}
					>
						<Plus className="mr-2 size-4" />
						Add exercise
					</Button>

					<Button type="submit" className="w-full">
						Save workout
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
