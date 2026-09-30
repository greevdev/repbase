"use client";

import { useState } from "react";
import { toast } from "sonner";

import { deleteScheduledWorkout } from "@/app/dashboard/actions";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteScheduledWorkoutDialogProps = {
	scheduledWorkoutId: string;
	clientId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function DeleteScheduledWorkoutDialog({
	scheduledWorkoutId,
	clientId,
	open,
	onOpenChange,
}: DeleteScheduledWorkoutDialogProps) {
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		setLoading(true);

		try {
			const result = await deleteScheduledWorkout(
				scheduledWorkoutId,
				clientId,
			);

			if (result.success) {
				onOpenChange(false);

				toast.success("Scheduled workout deleted");
			} else {
				toast.error(
					result.error ?? "Failed to delete scheduled workout",
				);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="w-full text-center">
						Delete scheduled workout?
					</AlertDialogTitle>

					<AlertDialogDescription className="w-full text-balance text-center">
						This scheduled session will be permanently deleted.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="grid grid-cols-2">
					<AlertDialogCancel
						disabled={loading}
						className="hover:bg-gray-200"
					>
						Cancel
					</AlertDialogCancel>

					<Button
						type="button"
						variant="destructive"
						disabled={loading}
						onClick={handleDelete}
					>
						{loading ? (
							<>
								<Spinner className="mr-2 size-4" />
							</>
						) : (
							"Delete"
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
