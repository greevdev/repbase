"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteWorkoutTemplate } from "@/app/dashboard/actions";

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
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteWorkoutTemplateDialog({
	templateId,
	clientId,
}: {
	templateId: string;
	clientId: string;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		setLoading(true);

		try {
			const result = await deleteWorkoutTemplate(templateId, clientId);

			if (result.success) {
				setOpen(false);

				toast.success("Workout template deleted");
			} else {
				toast.error(
					result.error ?? "Failed to delete workout template",
				);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="flex w-full items-center justify-center gap-2 border-red-300 bg-white px-3 hover:bg-red-100"
				>
					<Trash2 className="size-4 text-red-500" />
					<span className="text-red-500">Delete Template</span>
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="w-full text-center">
						Delete this template?
					</AlertDialogTitle>

					<AlertDialogDescription className="w-full text-balance text-center">
						This will permanently delete the workout template.
						Completed workouts created from it will not be affected.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="grid grid-cols-2 items-center">
					<AlertDialogCancel
						className="w-full rounded-lg py-5 hover:bg-gray-200"
						disabled={loading}
					>
						Cancel
					</AlertDialogCancel>

					<Button
						type="button"
						onClick={handleDelete}
						disabled={loading}
						className="w-full rounded-lg py-5"
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
