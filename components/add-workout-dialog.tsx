"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addWorkout } from "@/app/dashboard/actions";
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

export function AddWorkoutDialog({ clientId }: { clientId: string }) {
	const [open, setOpen] = useState(false);

	async function handleSubmit(formData: FormData) {
		const result = await addWorkout(clientId, formData);

		if (result.success) {
			setOpen(false);
			toast.success("Workout added successfully");
		} else {
			toast.error(result.error ?? "Failed to add workout");
		}
	}

	const today = new Date().toLocaleDateString("en-CA");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-emerald-700 hover:bg-emerald-900">
					<Plus className="mr-2 size-4" />
					Log workout
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Log workout</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-4">
					<Input name="title" placeholder="Workout title" required />

					<Textarea name="notes" placeholder="Notes" />

					<Input
						name="date"
						type="date"
						required
						defaultValue={today}
					/>

					<Button type="submit" className="w-full">
						Add workout
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
