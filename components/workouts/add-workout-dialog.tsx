"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addWorkout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
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

	function removeExercise(index: number) {
		setExercises(exercises.filter((_, i) => i !== index));
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

			<DialogContent className="top-[50%] h-[90vh] overflow-scroll bg-white flex flex-col">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						Log Workout
					</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-6 mt-3">
					<div className="grid grid-cols-2 gap-4">
						<Input
							name="title"
							placeholder="Workout title"
							required
							className="shadow-none rounded-lg font-semibold md:text-[1.05rem]"
						/>

						<Input
							name="date"
							type="date"
							defaultValue={today}
							required
							className="shadow-none rounded-lg font-semibold"
						/>
					</div>

					<Separator />

					<div className="space-y-8">
						{exercises.length != 0 ? (
							exercises.map((exercise, exerciseIndex) => (
								<div key={exerciseIndex}>
									<div className="flex justify-between items-center gap-2">
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
											type="text"
											className="shadow-none border-none sm:text-xl md:text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0"
										/>

										<Button
											type="button"
											variant="outline"
											size="icon"
											className="bg-white shadow-none hover:bg-slate-200"
											onClick={() =>
												removeExercise(exerciseIndex)
											}
										>
											<Trash2 className="size-4" />
										</Button>
									</div>

									<Input
										placeholder="Add notes here..."
										value={exercise.notes}
										onChange={(e) =>
											updateExercise(
												exerciseIndex,
												"notes",
												e.target.value,
											)
										}
										className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 text-muted-foreground font-medium"
									/>

									<div className="grid grid-cols-5 mt-3 items-center gap-2 text-[0.7rem] font-bold tracking-widest text-foreground/50">
										<p className="text-center">SET</p>
										<p className="col-span-2 text-center">
											WEIGHT (KG)
										</p>
										<p className="col-span-2 text-center">
											REPS
										</p>
									</div>

									<div className="space-y-2 mt-3">
										{exercise.sets.map((set, setIndex) => (
											<div
												key={setIndex}
												className="grid grid-cols-5 items-center gap-2 "
											>
												<span className="text-sm whitespace-nowrap text-center font-bold text-muted-foreground">
													{setIndex + 1}
												</span>

												<Input
													type="number"
													step="0.5"
													placeholder="Weight"
													className="col-span-2 shadow-none rounded-lg md:font-semibold text-center md:text-[1.05rem] md:placeholder:text-[0.85rem]"
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

												<Input
													type="number"
													placeholder="Reps"
													className="col-span-2 shadow-none rounded-lg md:font-semibold text-center md:text-[1.05rem] md:placeholder:text-[0.85rem]"
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
											</div>
										))}
									</div>

									<Button
										type="button"
										variant="outline"
										className="w-full mt-4 border-none shadow-none text-muted-foreground bg-background rounded-xl hover:bg-slate-200"
										onClick={() => addSet(exerciseIndex)}
									>
										+ Add set
									</Button>
								</div>
							))
						) : (
							<p className="text-center font-semibold text-muted-foreground">
								No exercises
							</p>
						)}
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={addExercise}
							className="w-full bg-white rounded-xl text-muted-foreground font-semibold shadow-lg shadow-muted-foreground/5 py-6 hover:bg-gray-50"
						>
							<Plus className="mr-2 size-4" />
							Add exercise
						</Button>

						<Button
							type="submit"
							className="w-full rounded-xl font-semibold shadow-lg shadow-muted-foreground/5 py-6"
						>
							Save workout
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
