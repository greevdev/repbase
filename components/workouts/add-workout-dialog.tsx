"use client";

import { useEffect, useState } from "react";
import {
	ChartColumnBig,
	ChartColumnIncreasing,
	ChartColumnIncreasingIcon,
	Dumbbell,
	Layers,
	Plus,
	Trash2,
	X,
} from "lucide-react";
import { toast } from "sonner";
import { addWorkout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Play, LucidePause } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ExerciseSelector } from "./exercise-selector";

type ExerciseSet = {
	reps: string;
	weight: string;
};

type Exercise = {
	name: string;
	notes: string;
	sets: ExerciseSet[];
	isCustom: boolean;
};

export function AddWorkoutDialog({ clientId }: { clientId: string }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [duration, setDuration] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (!open) {
			setDuration(0);
			setIsRunning(false);
			return;
		}

		setIsRunning(true);
	}, [open]);

	useEffect(() => {
		if (!isRunning) {
			return;
		}

		const interval = setInterval(() => {
			setDuration((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning]);

	function formatDuration(seconds: number) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${String(hours).padStart(2, "0")}:${String(
				minutes,
			).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
		}

		return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
			2,
			"0",
		)}`;
	}

	function addExercise() {
		setExercises([
			...exercises,
			{
				name: "",
				notes: "",
				isCustom: false,
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

	const totalVolume = exercises.reduce((workoutTotal, exercise) => {
		const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
			const reps = Number(set.reps) || 0;
			const weight = Number(set.weight) || 0;

			return setTotal + reps * weight;
		}, 0);

		return workoutTotal + exerciseVolume;
	}, 0);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setLoading(true);

		const formData = new FormData(event.currentTarget);

		try {
			const result = await addWorkout(
				clientId,
				formData,
				exercises,
				duration,
				totalSets,
				totalVolume,
			);

			if (result.success) {
				setOpen(false);
				setExercises([]);
				toast.success("Workout saved");
			} else {
				toast.error(result.error ?? "Failed to save workout");
			}
		} finally {
			setLoading(false);
		}
	}

	const today = new Date().toLocaleDateString("en-CA");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="rounded-lg bg-accent hover:bg-accentDark md:py-5">
					<Plus className="mr-1 size-4" />
					Log Workout
				</Button>
			</DialogTrigger>

			<DialogContent className="top-[50%] flex h-[100dvh] max-w-[100dvw] flex-col overflow-hidden rounded-none bg-white p-3 sm:h-[90dvh] sm:max-w-lg sm:rounded-xl md:p-5">
				<DialogHeader className="shrink-0">
					<DialogTitle className="text-start text-xl font-bold">
						<span>Log Workout</span>
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="flex min-h-0 flex-1 flex-col gap-2"
				>
					<div className="flex flex-col gap-2">
						<div className="flex gap-4">
							<div className="flex w-full flex-col gap-1">
								<p className="text-sm font-medium text-muted-foreground">
									Workout Title
								</p>
								<Input
									name="title"
									placeholder="e.g. Upper Body"
									required
									className="w-full rounded-lg text-sm font-semibold shadow-none placeholder:font-medium placeholder:text-gray-400 md:text-base"
								/>
							</div>

							<div className="flex w-full flex-col gap-1">
								<p className="text-sm font-medium text-muted-foreground">
									Date
								</p>
								<Input
									name="date"
									type="date"
									defaultValue={today}
									required
									className="w-full rounded-lg text-sm font-semibold shadow-none md:text-base"
								/>
							</div>
						</div>

						<div className="flex items-center gap-3 rounded-xl bg-gray-100/70 px-4 py-4 sm:px-8">
							<div className="mr-auto flex w-max items-center gap-3">
								<div>
									<p className="text-xl font-bold tabular-nums sm:text-3xl">
										{formatDuration(duration)}
									</p>
								</div>

								<button
									onClick={() =>
										setIsRunning((prev) => !prev)
									}
									className="btn aspect-square bg-gray-200/70 p-2 hover:bg-gray-200"
									type="button"
								>
									{isRunning ? (
										<>
											<LucidePause
												className="hidden sm:block"
												size={20}
												strokeWidth={0}
												fill="#000"
											/>
											<LucidePause
												className="sm:hidden"
												size={16}
												strokeWidth={0}
												fill="#000"
											/>
										</>
									) : (
										<>
											<Play
												className="hidden sm:block"
												size={16}
												strokeWidth={0}
												fill="#000"
											/>
											<Play
												className="sm:hidden"
												size={16}
												strokeWidth={0}
												fill="#000"
											/>
										</>
									)}
								</button>
							</div>

							<div className="flex items-center gap-4 sm:gap-8">
								<div className="flex items-center gap-3 sm:gap-4">
									<Layers
										className="hidden sm:block"
										size={24}
									/>
									<Layers className="sm:hidden" size={20} />

									<div className="flex flex-col">
										<p className="text-[0.65rem] font-medium tracking-widest text-muted-foreground">
											SETS
										</p>

										<p className="text-base font-bold tabular-nums sm:text-lg">
											{totalSets}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3 sm:gap-4">
									<ChartColumnBig
										className="hidden sm:block"
										size={24}
									/>
									<ChartColumnBig
										className="sm:hidden"
										size={20}
									/>

									<div className="flex flex-col">
										<p className="text-[0.65rem] font-medium tracking-widest text-muted-foreground">
											TOTAL VOLUME
										</p>

										<p className="text-base font-bold tabular-nums sm:text-lg">
											{totalVolume} kg
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex min-h-0 flex-1 flex-col gap-2">
						<div className="shrink-0">
							<Separator className="bg-gray-200" />
						</div>

						<div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto">
							{exercises.length !== 0 ? (
								exercises.map((exercise, exerciseIndex) => (
									<div
										key={exerciseIndex}
										className="rounded-xl border border-gray-200 px-4 py-2 sm:p-4"
									>
										<div className="flex items-center justify-between gap-2">
											{exercise.isCustom ? (
												<div className="flex flex-1 items-center gap-2">
													<Input
														placeholder="Custom exercise name"
														value={exercise.name}
														onChange={(e) =>
															updateExercise(
																exerciseIndex,
																"name",
																e.target.value,
															)
														}
														required
														className="h-auto border-none px-0 py-0 font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-xl md:text-xl"
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
														<Dumbbell />
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
														className="grid grid-cols-10 items-center gap-1 overflow-hidden md:gap-2"
													>
														<span className="whitespace-nowrap text-center text-sm font-bold text-muted-foreground">
															{setIndex + 1}
														</span>

														<Input
															type="number"
															step="0.5"
															placeholder="Weight"
															className="col-span-4 rounded-lg text-center text-sm font-semibold shadow-none focus-visible:ring-0 md:text-[1.05rem] md:placeholder:text-[0.85rem]"
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
															className="col-span-4 rounded-lg text-center text-sm font-semibold shadow-none focus-visible:ring-0 md:text-[1.05rem] md:placeholder:text-[0.85rem]"
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
								<>
									<Spinner className="size-4" />
								</>
							) : (
								"Save workout"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
