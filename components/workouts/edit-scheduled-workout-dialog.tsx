"use client";

import { useState } from "react";
import { toast } from "sonner";

import { editScheduledWorkout } from "@/app/dashboard/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type ScheduledWorkout = {
	id: string;
	title: string;
	scheduled_at: string;
	duration_minutes: number;
	notes: string | null;
};

type EditScheduledWorkoutDialogProps = {
	workout: ScheduledWorkout;
	clientId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function EditScheduledWorkoutDialog({
	workout,
	clientId,
	open,
	onOpenChange,
}: EditScheduledWorkoutDialogProps) {
	const [loading, setLoading] = useState(false);

	const scheduledDate = new Date(workout.scheduled_at);

	const defaultDate = `${scheduledDate.getFullYear()}-${String(
		scheduledDate.getMonth() + 1,
	).padStart(2, "0")}-${String(scheduledDate.getDate()).padStart(2, "0")}`;

	const defaultTime = `${String(scheduledDate.getHours()).padStart(
		2,
		"0",
	)}:${String(scheduledDate.getMinutes()).padStart(2, "0")}`;

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setLoading(true);

		const formData = new FormData(event.currentTarget);

		const date = formData.get("date") as string;
		const time = formData.get("time") as string;

		const scheduledAt = new Date(`${date}T${time}`).toISOString();

		formData.set("scheduled_at", scheduledAt);

		try {
			const result = await editScheduledWorkout(
				workout.id,
				clientId,
				formData,
			);

			if (result.success) {
				onOpenChange(false);

				toast.success("Scheduled workout updated");
			} else {
				toast.error(
					result.error ?? "Failed to update scheduled workout",
				);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className="bg-white sm:max-w-md"
			>
				<DialogHeader>
					<DialogTitle>Edit Scheduled Workout</DialogTitle>
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
					className="space-y-6"
				>
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							Workout Title
						</p>

						<Input
							name="title"
							defaultValue={workout.title}
							required
							className="text-base font-semibold shadow-none"
						/>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								Date
							</p>

							<Input
								name="date"
								type="date"
								defaultValue={defaultDate}
								required
								className="h-full w-full appearance-none text-base font-semibold shadow-none"
							/>
						</div>

						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								Time
							</p>

							<Input
								name="time"
								type="time"
								defaultValue={defaultTime}
								required
								className="h-full w-full appearance-none text-base font-semibold shadow-none"
							/>
						</div>
					</div>

					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							Duration
						</p>

						<div className="relative">
							<Input
								name="duration_minutes"
								type="number"
								min={1}
								defaultValue={workout.duration_minutes}
								inputMode="numeric"
								required
								className="pr-14 text-base font-semibold shadow-none"
							/>

							<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
								min
							</span>
						</div>
					</div>

					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							Notes
						</p>

						<Textarea
							name="notes"
							defaultValue={workout.notes ?? ""}
							placeholder="Optional notes..."
							className="resize-none shadow-none"
						/>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<Button
							type="button"
							variant="outline"
							disabled={loading}
							onClick={() => onOpenChange(false)}
							className="rounded-lg py-6 hover:bg-gray-200"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={loading}
							className="rounded-lg py-6"
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
