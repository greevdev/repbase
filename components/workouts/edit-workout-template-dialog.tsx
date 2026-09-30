"use client";

import { useState } from "react";
import { Dumbbell, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { editWorkoutTemplate } from "@/app/dashboard/actions";
import { PREDEFINED_EXERCISES } from "@/lib/exercises";

import { ExerciseSelector } from "@/components/workouts/exercise-selector";
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

type TemplateSet = {
	id: string;
	set_number: number;
};

type TemplateExercise = {
	id: string;
	name: string;
	notes: string | null;
	position: number;
	workout_template_sets: TemplateSet[];
};

type WorkoutTemplate = {
	id: string;
	title: string;
	workout_template_exercises: TemplateExercise[];
};

type ExerciseState = {
	name: string;
	notes: string;
	isCustom: boolean;
	sets: {
		set_number: number;
	}[];
};

export function EditWorkoutTemplateDialog({
	template,
	clientId,
}: {
	template: WorkoutTemplate;
	clientId: string;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	function getInitialExercises(): ExerciseState[] {
		return [...template.workout_template_exercises]
			.sort((a, b) => a.position - b.position)
			.map((exercise) => {
				const isPredefined = PREDEFINED_EXERCISES.some(
					(predefinedExercise) =>
						predefinedExercise.name === exercise.name,
				);

				return {
					name: exercise.name,
					notes: exercise.notes ?? "",
					isCustom: !isPredefined,
					sets: [...exercise.workout_template_sets]
						.sort((a, b) => a.set_number - b.set_number)
						.map((set) => ({
							set_number: set.set_number,
						})),
				};
			});
	}

	const [exercises, setExercises] = useState<ExerciseState[]>(
		getInitialExercises(),
	);

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);

		if (nextOpen) {
			setExercises(getInitialExercises());
		}
	}

	function addExercise() {
		setExercises([
			...exercises,
			{
				name: "",
				notes: "",
				isCustom: false,
				sets: [{ set_number: 1 }],
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
									set_number: exercise.sets.length + 1,
								},
							],
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
							sets: exercise.sets
								.filter((_, j) => j !== setIndex)
								.map((set, j) => ({
									...set,
									set_number: j + 1,
								})),
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

	function setExerciseCustom(index: number) {
		setExercises(
			exercises.map((exercise, i) =>
				i === index
					? {
							...exercise,
							name: "",
							isCustom: true,
						}
					: exercise,
			),
		);
	}

	function setExercisePredefined(index: number) {
		setExercises(
			exercises.map((exercise, i) =>
				i === index
					? {
							...exercise,
							name: "",
							isCustom: false,
						}
					: exercise,
			),
		);
	}

	const totalSets = exercises.reduce(
		(total, exercise) => total + exercise.sets.length,
		0,
	);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setLoading(true);

		const formData = new FormData(event.currentTarget);

		try {
			const result = await editWorkoutTemplate(
				template.id,
				clientId,
				formData,
				exercises,
			);

			if (result.success) {
				setOpen(false);

				toast.success("Workout template updated");
			} else {
				toast.error(
					result.error ?? "Failed to update workout template",
				);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="w-full bg-white hover:bg-gray-100"
				>
					<Pencil className="size-4" />
					Edit Template
				</Button>
			</DialogTrigger>

			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className="top-[50%] flex h-[100dvh] max-w-[100dvw] flex-col overflow-hidden rounded-none bg-white p-3 sm:h-[90dvh] sm:max-w-lg sm:rounded-xl md:p-5"
			>
				<DialogHeader className="shrink-0">
					<DialogTitle className="text-start text-xl font-bold">
						Edit Workout Template
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					onKeyDown={(e) => {
						if (
							e.key === "Enter" &&
							e.target instanceof HTMLInputElement
						) {
							e.preventDefault();
						}
					}}
					className="flex min-h-0 flex-1 flex-col gap-2"
				>
					{/* Template details */}
					<div className="flex shrink-0 flex-col gap-2">
						<div className="flex flex-col gap-1">
							<p className="text-sm font-medium text-muted-foreground">
								Template Name
							</p>

							<Input
								name="title"
								defaultValue={template.title}
								placeholder="e.g. Upper Body A"
								required
								className="w-full rounded-lg text-base font-semibold shadow-none placeholder:font-medium placeholder:text-gray-400"
							/>
						</div>

						{/* <div className="flex items-center justify-between rounded-xl bg-gray-100/70 px-6 py-4">
							<div className="flex flex-col">
								<p className="text-[0.65rem] font-medium tracking-widest text-muted-foreground">
									EXERCISES
								</p>

								<p className="text-lg font-bold tabular-nums">
									{exercises.length}
								</p>
							</div>

							<div className="flex flex-col">
								<p className="text-[0.65rem] font-medium tracking-widest text-muted-foreground">
									SETS
								</p>

								<p className="text-lg font-bold tabular-nums">
									{totalSets}
								</p>
							</div>
						</div> */}
					</div>

					{/* Exercises */}
					<div className="flex min-h-0 flex-1 flex-col gap-2">
						{exercises.length === 0 && (
							<div className="shrink-0">
								<Separator className="bg-gray-200" />
							</div>
						)}

						<div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto">
							{exercises.length > 0 ? (
								exercises.map((exercise, exerciseIndex) => (
									<div
										key={exerciseIndex}
										className="rounded-xl border border-gray-200 px-4 py-2 sm:p-4"
									>
										{/* Exercise title */}
										<div className="flex items-center justify-between gap-2">
											{exercise.isCustom ? (
												<div className="flex flex-1 items-center gap-2">
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
														className="h-max border-none px-0 py-3 text-xl font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:py-0 md:text-xl"
													/>

													<Button
														type="button"
														variant="outline"
														size="icon"
														className="aspect-square bg-white shadow-none hover:bg-slate-200"
														onClick={() =>
															setExercisePredefined(
																exerciseIndex,
															)
														}
													>
														<Dumbbell className="size-4" />
													</Button>
												</div>
											) : (
												<ExerciseSelector
													value={exercise.name}
													onSelect={(name) =>
														updateExercise(
															exerciseIndex,
															"name",
															name,
														)
													}
													onCustom={() =>
														setExerciseCustom(
															exerciseIndex,
														)
													}
												/>
											)}

											<Button
												type="button"
												variant="outline"
												size="icon"
												className="shrink-0 bg-white shadow-none hover:bg-slate-200"
												onClick={() =>
													removeExercise(
														exerciseIndex,
													)
												}
											>
												<Trash2 className="size-4" />
											</Button>
										</div>

										{/* Notes */}
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

										{/* Sets header */}
										<div className="mt-3 grid grid-cols-[1fr_auto] items-center text-[0.7rem] font-bold tracking-widest text-accent">
											<p>SETS</p>

											<p className="text-right text-muted-foreground">
												{exercise.sets.length} TOTAL
											</p>
										</div>

										{/* Sets */}
										<div className="mt-3 space-y-2">
											{exercise.sets.map(
												(set, setIndex) => (
													<div
														key={setIndex}
														className="flex items-center justify-between rounded-lg bg-gray-100/70 px-4 py-2"
													>
														<span className="text-base font-bold text-muted-foreground">
															Set {setIndex + 1}
														</span>

														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="hover:bg-slate-200"
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
								<p className="mt-5 text-center font-semibold tracking-wide text-muted-foreground/50">
									No exercises
								</p>
							)}
						</div>
					</div>

					<div className="grid shrink-0 grid-cols-2 gap-3 pb-4 sm:pb-0">
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
