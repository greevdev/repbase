"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteWorkout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import clsx from "clsx";

export function DeleteWorkoutDialog({
	clientId,
	workoutId,
	className,
}: {
	clientId: string;
	workoutId: string;
	className: string;
}) {
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		setLoading(true);

		try {
			const result = await deleteWorkout(workoutId, clientId);

			if (result.success) {
				setOpen(false);
				toast.success("Workout deleted successfully");
				router.push(`/dashboard/clients/${clientId}`);
			} else {
				toast.error(result.error ?? "Failed to delete workout");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					className={clsx(
						"rounded-lg border border-foreground/10 bg-white text-foreground hover:bg-background",
						className,
					)}
				>
					<Trash2 className="mr-1 size-4 text-red-500" />
					<span>Delete</span>
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="w-full text-center">
						Delete this workout?
					</AlertDialogTitle>

					<AlertDialogDescription className="mx-auto text-center">
						You'll lose the sets, reps and weights logged for this
						session.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="mt-3 flex flex-row">
					<AlertDialogCancel
						className="w-full rounded-lg py-5 hover:bg-foreground/10"
						size="lg"
						disabled={loading}
					>
						Cancel
					</AlertDialogCancel>

					<Button
						type="button"
						size="lg"
						className="w-full rounded-lg py-5"
						onClick={handleDelete}
						disabled={loading}
					>
						{loading ? (
							<>
								<Spinner className="size-4" />
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
