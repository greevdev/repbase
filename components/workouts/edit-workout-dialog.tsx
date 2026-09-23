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
                        weight:
                            set.weight !== null ? String(set.weight) : "",
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
                          sets: [
                              ...exercise.sets,
                              { reps: "", weight: "" },
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
                <Button className="bg-white rounded-lg text-foreground border border-foreground/10 hover:bg-background">
                    <Pencil className="mr-1 size-4" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="top-[50%] h-[90dvh] bg-white flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-xl font-bold">
                        Edit Workout
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="mt-3 flex-1 min-h-0 flex flex-col gap-6"
                >
                    <div className="flex-1 min-h-0 flex flex-col gap-6">
                        {/* Workout details */}
                        <div className="shrink-0 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    name="title"
                                    defaultValue={workout.title}
                                    required
                                    className="shadow-none rounded-lg font-semibold md:text-[1.05rem]"
                                />

                                <Input
                                    name="date"
                                    type="date"
                                    defaultValue={workout.date}
                                    required
                                    className="shadow-none rounded-lg font-semibold"
                                />
                            </div>

                            <Separator className="bg-gray-200" />
                        </div>

                        {/* Scrollable exercises */}
                        <div className="flex-1 min-h-0 space-y-8 overflow-y-auto custom-scrollbar">
                            {exercises.length !== 0 ? (
                                exercises.map(
                                    (exercise, exerciseIndex) => (
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
                                                className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 text-muted-foreground font-medium"
                                            />

                                            <div className="grid grid-cols-10 mt-3 items-center gap-2 text-[0.7rem] font-bold tracking-widest text-foreground/50">
                                                <p className="text-center">
                                                    SET
                                                </p>

                                                <p className="col-span-4 text-center">
                                                    WEIGHT (KG)
                                                </p>

                                                <p className="col-span-4 text-center">
                                                    REPS
                                                </p>

                                                <div />
                                            </div>

                                            <div className="space-y-2 mt-3">
                                                {exercise.sets.map(
                                                    (set, setIndex) => (
                                                        <div
                                                            key={setIndex}
                                                            className="grid grid-cols-10 items-center gap-2"
                                                        >
                                                            <span className="text-sm whitespace-nowrap text-center font-bold text-muted-foreground">
                                                                {setIndex + 1}
                                                            </span>

                                                            <Input
                                                                type="number"
                                                                step="0.5"
                                                                placeholder="Weight"
                                                                className="col-span-4 shadow-none rounded-lg md:font-semibold text-center md:text-[1.05rem] md:placeholder:text-[0.85rem]"
                                                                value={
                                                                    set.weight
                                                                }
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
                                                                className="col-span-4 shadow-none rounded-lg md:font-semibold text-center md:text-[1.05rem] md:placeholder:text-[0.85rem]"
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
                                                className="w-full mt-4 border-none shadow-none text-muted-foreground bg-background rounded-xl hover:bg-slate-200"
                                                onClick={() =>
                                                    addSet(exerciseIndex)
                                                }
                                            >
                                                + Add set
                                            </Button>
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="text-center font-semibold text-muted-foreground">
                                    No exercises
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bottom buttons */}
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addExercise}
                            disabled={loading}
                            className="w-full bg-white rounded-xl text-muted-foreground font-semibold shadow-lg shadow-muted-foreground/5 py-6 hover:bg-gray-50"
                        >
                            <Plus className="mr-2 size-4" />
                            Add exercise
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl font-semibold shadow-lg shadow-muted-foreground/5 py-6"
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