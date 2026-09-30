"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";

import { scheduleWorkout } from "@/app/dashboard/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type ScheduleWorkoutDialogProps = {
	clientId: string;
};

export function ScheduleWorkoutDialog({
	clientId,
}: ScheduleWorkoutDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const today = new Date().toLocaleDateString("en-CA");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setLoading(true);

		const formData = new FormData(event.currentTarget);

		const date = formData.get("date") as string;
		const time = formData.get("time") as string;

		const scheduledAt = new Date(`${date}T${time}`).toISOString();

		formData.set("scheduled_at", scheduledAt);

		try {
			const result = await scheduleWorkout(clientId, formData);

			if (result.success) {
				setOpen(false);

				toast.success("Workout scheduled");
			} else {
				toast.error(result.error ?? "Failed to schedule workout");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="aspect-square rounded-lg bg-white hover:bg-gray-50 sm:aspect-auto"
				>
					<CalendarPlus className="size-4 sm:mr-1" />
					<span className="hidden sm:block">Schedule</span>
				</Button>
			</DialogTrigger>

			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className="bg-white sm:max-w-md"
			>
				<DialogHeader>
					<DialogTitle>Schedule Workout</DialogTitle>
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
							placeholder="e.g. Upper Body"
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
								defaultValue={today}
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
								defaultValue={60}
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
							placeholder="Optional notes..."
							className="resize-none shadow-none"
						/>
					</div>

					<div className="grid grid-cols-2 gap-1">
						<Button
							type="button"
							variant="outline"
							disabled={loading}
							onClick={() => setOpen(false)}
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
								"Schedule"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
