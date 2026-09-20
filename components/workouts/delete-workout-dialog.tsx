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
import { useRouter } from "next/navigation";

export function DeleteWorkoutDialog({
	clientId,
	workoutId,
}: {
	clientId: string;
	workoutId: string;
}) {
	const router = useRouter();

	async function handleDelete() {
		const result = await deleteWorkout(workoutId, clientId);

		if (result.success) {
			toast.success("Workout deleted successfully");
			router.push(`/dashboard/clients/${clientId}`);
		} else {
			toast.error(result.error ?? "Failed to delete workout");
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" size="sm">
					<Trash2 className="mr-1 size-4" />
					<span>Delete</span>
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-center w-full">
						Delete this workout?
					</AlertDialogTitle>

					<AlertDialogDescription className="mx-auto text-center">
						You'll lose the sets, reps and weights logged for this
						session.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="mt-3">
					<AlertDialogCancel className="w-full hover:bg-foreground/10">
						Cancel
					</AlertDialogCancel>

					<AlertDialogAction
						className="w-full"
						onClick={handleDelete}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
