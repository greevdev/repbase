"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { editWorkout } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type Workout = {
	id: string;
	title: string;
	date: string;
	client_id: string;
};

type EditWorkoutDialogProps = {
	workout: Workout;
};

export function EditWorkoutDialog({ workout }: EditWorkoutDialogProps) {
	const [open, setOpen] = useState(false);

	async function handleSubmit(formData: FormData) {
		const result = await editWorkout(
			workout.id,
			workout.client_id,
			formData,
		);

		if (result.success) {
			setOpen(false);
			toast.success("Workout edited successfully");
		} else {
			toast.error(result.error ?? "Failed to edit workout");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					variant="default"
					className=" p-0 aspect-square"
				>
					<Pencil className="size-4" />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit workout</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-4">
					<Input name="title" defaultValue={workout.title} required />

					<Input
						name="date"
						type="date"
						defaultValue={workout.date}
						required
					/>

					<Button type="submit" className="w-full">
						Save changes
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
