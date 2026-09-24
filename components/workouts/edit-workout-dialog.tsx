"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { editWorkout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";

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
	className = "",
}: {
	workout: Workout;
	clientId: string;
	className: string;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);

		const formData = new FormData(event.currentTarget);

		try {
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
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className={clsx(
						"rounded-lg border border-foreground/10 bg-white text-foreground hover:bg-background",
						className,
					)}
				>
					<Pencil className="mr-1 size-4" />
					Edit
				</Button>
			</DialogTrigger>

			<DialogContent className="top-[50%] flex h-[90dvh] max-w-[97dvw] flex-col overflow-hidden bg-white p-3 md:p-5">
				<DialogHeader className="shrink-0">
					<DialogTitle className="text-xl font-bold">
						Edit Workout
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="mt-3 flex min-h-0 flex-1 flex-col gap-6"
				>
					<div className="flex min-h-0 flex-1 flex-col gap-6">
						{/* Workout details */}
						<div className="shrink-0 space-y-6">
							<div className="grid grid-cols-2 gap-2 md:gap-4">
								<Input
									name="title"
									defaultValue={workout.title}
									required
									className="rounded-lg text-sm font-semibold shadow-none md:text-base"
								/>

								<Input
									name="date"
									type="date"
									defaultValue={workout.date}
									required
									className="rounded-lg text-sm font-semibold shadow-none md:text-base"
								/>
							</div>

							<Separator className="bg-gray-200" />
						</div>

						{/* Scrollable exercises */}
						<div className="custom-scrollbar min-h-0 flex-1 space-y-8 overflow-y-auto">
							{exercises.length !== 0 ? (
								exercises.map((exercise, exerciseIndex) => (
									<div key={exerciseIndex}>
										<div className="flex items-center justify-between gap-2">
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
												className="border-none px-0 py-0 font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-xl"
											/>

											<Button
												type="button"
												variant="outline"
												size="icon"
												className="bg-white shadow-none hover:bg-slate-200"
												onClick={() =>
													removeExercise(
														exerciseIndex,
													)
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
											className="border-none px-0 py-0 text-sm font-medium text-muted-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
										/>

										<div className="mt-3 grid grid-cols-10 items-center gap-1 text-[0.7rem] font-bold tracking-widest text-foreground/50 md:gap-2">
											<p className="text-center">SET</p>

											<p className="col-span-4 text-center">
												WEIGHT (KG)
											</p>

											<p className="col-span-4 text-center">
												REPS
											</p>

											<div />
										</div>

										<div className="mt-3 space-y-2">
											{exercise.sets.map(
												(set, setIndex) => (
													<div
														key={setIndex}
														className="grid grid-cols-10 items-center gap-1 md:gap-2"
													>
														<span className="whitespace-nowrap text-center text-sm font-bold text-muted-foreground">
															{setIndex + 1}
														</span>

														<Input
															type="number"
															step="0.5"
															placeholder="Weight"
															className="col-span-4 rounded-lg text-center text-sm font-semibold shadow-none md:text-[1.05rem] md:placeholder:text-[0.85rem]"
															value={set.weight}
															onChange={(e) =>
																updateSet(
																	exerciseIndex,
																	setIndex,
																	"weight",
																	e.target
																		.value,
																)
															}
														/>

														<Input
															type="number"
															placeholder="Reps"
															className="col-span-4 rounded-lg text-center text-sm font-semibold shadow-none md:text-[1.05rem] md:placeholder:text-[0.85rem]"
															value={set.reps}
															onChange={(e) =>
																updateSet(
																	exerciseIndex,
																	setIndex,
																	"reps",
																	e.target
																		.value,
																)
															}
														/>

														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="w-full hover:bg-slate-200"
															onClick={() =>
																removeSet(
																	exerciseIndex,
																	setIndex,
																)
															}
														>
															<X className="size-4" />
														</Button>
													</div>
												),
											)}
										</div>

										<Button
											type="button"
											variant="outline"
											className="mt-4 w-full rounded-xl border-none bg-background text-muted-foreground shadow-none hover:bg-slate-200"
											onClick={() =>
												addSet(exerciseIndex)
											}
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
					</div>

					<div className="grid shrink-0 grid-cols-2 gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={addExercise}
							disabled={loading}
							className="w-full rounded-xl bg-white py-6 font-semibold text-muted-foreground shadow-lg shadow-muted-foreground/5 hover:bg-gray-50"
						>
							<Plus className="size-4 md:mr-2" />
							Add exercise
						</Button>

						<Button
							type="submit"
							disabled={loading}
							className="w-full rounded-xl py-6 font-semibold shadow-lg shadow-muted-foreground/5"
						>
							{loading ? (
								<Spinner className="size-4" />
							) : (
								"Save changes"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
