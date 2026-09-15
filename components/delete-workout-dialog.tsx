"use client";

import { Trash2 } from "lucide-react";
import { deleteWorkout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeleteWorkoutDialog({
	clientId,
	workoutId,
}: {
	clientId: string;
	workoutId: string;
}) {
	async function handleDelete() {
		const result = await deleteWorkout(workoutId, clientId);

		if (result.success) {
			toast.success("Workout deleted successfully");
		} else {
			toast.error(result.error ?? "Failed to delete workout");
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					className="aspect-square p-0"
					size="sm"
				>
					<Trash2 className="size-4" />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete the workout?
					</AlertDialogTitle>

					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<AlertDialogAction onClick={handleDelete}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
