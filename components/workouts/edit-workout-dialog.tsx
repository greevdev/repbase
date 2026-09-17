"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { editWorkout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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

type Workout = {
	id: string;
	title: string;
	date: string;
	workout_exercises: {
		id: string;
		name: string;
		notes: string | null;
		position: number;
		exercise_sets: {
			id: string;
			set_number: number;
			reps: number;
			weight: number | null;
		}[];
	}[];
};

export function EditWorkoutDialog({
	workout,
	clientId,
}: {
	workout: Workout;
	clientId: string;
}) {
	const [open, setOpen] = useState(false);

	const [exercises, setExercises] = useState<Exercise[]>(
		[...workout.workout_exercises]
			.sort((a, b) => a.position - b.position)
			.map((exercise) => ({
				name: exercise.name,
				notes: exercise.notes ?? "",
				sets: [...exercise.exercise_sets]
					.sort((a, b) => a.set_number - b.set_number)
					.map((set) => ({
						reps: String(set.reps),
						weight: set.weight !== null ? String(set.weight) : "",
					})),
			})),
	);

	function addExercise() {
		setExercises([
			...exercises,
			{
				name: "",
				notes: "",
				sets: [{ reps: "", weight: "" }],
			},
		]);
	}

	function removeExercise(index: number) {
		setExercises(exercises.filter((_, i) => i !== index));
	}

	function addSet(exerciseIndex: number) {
		setExercises(
			exercises.map((exercise, i) =>
				i === exerciseIndex
					? {
							...exercise,
							sets: [...exercise.sets, { reps: "", weight: "" }],
						}
					: exercise,
			),
		);
	}

	function removeSet(exerciseIndex: number, setIndex: number) {
		setExercises(
			exercises.map((exercise, i) =>
				i === exerciseIndex
					? {
							...exercise,
							sets: exercise.sets.filter(
								(_, j) => j !== setIndex,
							),
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
				i === index ? { ...exercise, [field]: value } : exercise,
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
			exercises.map((exercise, i) =>
				i === exerciseIndex
					? {
							...exercise,
							sets: exercise.sets.map((set, j) =>
								j === setIndex
									? { ...set, [field]: value }
									: set,
							),
						}
					: exercise,
			),
		);
	}

	async function handleSubmit(formData: FormData) {
		const result = await editWorkout(
			workout.id,
			clientId,
			formData,
			exercises,
		);

		if (result.success) {
			setOpen(false);
			toast.success("Workout updated successfully");
		} else {
			toast.error(result.error ?? "Failed to update workout");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Pencil className="mr-2 size-4" />
					Edit
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Workout</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<Input
							name="title"
							defaultValue={workout.title}
							required
						/>

						<Input
							name="date"
							type="date"
							defaultValue={workout.date}
							required
						/>
					</div>

					<Separator />

					<div className="space-y-5">
						{exercises.map((exercise, exerciseIndex) => (
							<div key={exerciseIndex} className="space-y-3">
								<div className="flex gap-2">
									<Input
										value={exercise.name}
										placeholder="Exercise name"
										onChange={(e) =>
											updateExercise(
												exerciseIndex,
												"name",
												e.target.value,
											)
										}
										required
									/>

									<Button
										type="button"
										variant="destructive"
										size="icon"
										onClick={() =>
											removeExercise(exerciseIndex)
										}
									>
										<Trash2 className="size-4" />
									</Button>
								</div>

								<Input
									value={exercise.notes}
									placeholder="Add notes here..."
									className="border-none shadow-none"
									onChange={(e) =>
										updateExercise(
											exerciseIndex,
											"notes",
											e.target.value,
										)
									}
								/>

								{exercise.sets.map((set, setIndex) => (
									<div
										key={setIndex}
										className="flex items-center gap-2"
									>
										<span className="whitespace-nowrap text-sm">
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

										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() =>
												removeSet(
													exerciseIndex,
													setIndex,
												)
											}
										>
											<Trash2 className="size-4" />
										</Button>
									</div>
								))}

								<Button
									type="button"
									variant="outline"
									className="w-full"
									onClick={() => addSet(exerciseIndex)}
								>
									<Plus className="mr-2 size-4" />
									Add set
								</Button>

								<Separator />
							</div>
						))}
					</div>

					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={addExercise}
					>
						<Plus className="mr-2 size-4" />
						Add exercise
					</Button>

					<Button type="submit" className="w-full">
						Save changes
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
