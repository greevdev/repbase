"use client";

import { useState } from "react";
import { Dumbbell, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { addWorkoutTemplate } from "@/app/dashboard/actions";
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
	set_number: number;
};

type TemplateExercise = {
	name: string;
	notes: string;
	isCustom: boolean;
	sets: TemplateSet[];
};

export function AddWorkoutTemplateDialog({ clientId }: { clientId: string }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const [exercises, setExercises] = useState<TemplateExercise[]>([]);

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
			exercises.map((exercise, i) =>
				i === exerciseIndex
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

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setLoading(true);

		const formData = new FormData(event.currentTarget);

		try {
			const result = await addWorkoutTemplate(
				clientId,
				formData,
				exercises,
			);

			if (result.success) {
				setOpen(false);
				setExercises([]);
				toast.success("Workout template created");
			} else {
				toast.error(
					result.error ?? "Failed to create workout template",
				);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className="rounded-lg border border-muted-foreground/15 bg-white hover:bg-gray-200"
				>
					<Plus className="mr-2 size-4" />
					New Template
				</Button>
			</DialogTrigger>

			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className="top-[50%] flex h-[100dvh] max-w-[100dvw] flex-col overflow-hidden rounded-none bg-white p-3 sm:h-[90dvh] sm:rounded-xl md:p-5"
			>
				<DialogHeader className="shrink-0">
					<DialogTitle className="text-start text-xl font-bold">
						Create Workout Template
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
					className="mt-2 flex min-h-0 flex-1 flex-col gap-6"
				>
					<div className="flex w-full flex-col gap-2">
						<p className="text-sm font-medium text-muted-foreground">
							Template Name
						</p>
						<Input
							name="title"
							placeholder="e.g. Upper Body"
							required
							className="h-full w-full rounded-lg text-base font-semibold shadow-none placeholder:font-medium placeholder:text-gray-400"
						/>

						<Separator className="mt-2" />
					</div>

					<div className="custom-scrollbar min-h-0 flex-1 space-y-8 overflow-y-auto">
						{exercises.length > 0 ? (
							exercises.map((exercise, exerciseIndex) => (
								<div
									key={exerciseIndex}
									className="rounded-xl border border-gray-200 px-4 py-2 sm:p-4"
								>
									<div className="flex items-center justify-between gap-2">
										<div className="min-w-0 flex-1">
											{exercise.isCustom ? (
												<div className="flex items-center gap-2">
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
														className="h-auto border-none px-0 py-0 text-xl font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-xl"
													/>

													<Button
														type="button"
														variant="outline"
														size="icon"
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
										</div>

										<Button
											type="button"
											variant="outline"
											size="icon"
											className="shrink-0 bg-white hover:bg-gray-100"
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
										className="border-none px-0 py-0 text-sm font-medium tracking-wide text-muted-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
									/>

									<div className="mt-4 space-y-2">
										{exercise.sets.map((set, setIndex) => (
											<div
												key={set.set_number}
												className="flex items-center justify-between rounded-lg bg-background px-4 py-2"
											>
												<span className="text-sm font-semibold text-muted-foreground">
													Set {setIndex + 1}
												</span>

												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="hover:bg-gray-200/70"
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
										))}
									</div>

									<Button
										type="button"
										variant="outline"
										className="mt-3 w-full rounded-xl border-none bg-background text-muted-foreground shadow-none hover:bg-gray-200"
										onClick={() => addSet(exerciseIndex)}
									>
										+ Add set
									</Button>
								</div>
							))
						) : (
							<p className="text-center font-semibold text-muted-foreground/60">
								No exercises
							</p>
						)}
					</div>

					<div className="grid shrink-0 grid-cols-2 gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={addExercise}
							disabled={loading}
							className="w-full rounded-xl bg-white py-6 font-semibold text-muted-foreground hover:bg-gray-200"
						>
							<Plus className="mr-2 size-4" />
							Add exercise
						</Button>

						<Button
							type="submit"
							disabled={loading}
							className="w-full rounded-xl py-6 font-semibold"
						>
							{loading ? (
								<Spinner className="size-4" />
							) : (
								"Save template"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
