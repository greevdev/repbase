"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { EditScheduledWorkoutDialog } from "./edit-scheduled-workout-dialog";
import { DeleteScheduledWorkoutDialog } from "./delete-scheduled-workout-dialog";

type ScheduledWorkout = {
	id: string;
	title: string;
	scheduled_at: string;
	duration_minutes: number;
	notes: string | null;
};

export default function ScheduledWorkoutOptionsPopover({
	workout,
	clientId,
}: {
	workout: ScheduledWorkout;
	clientId: string;
}) {
	const [popoverOpen, setPopoverOpen] = useState(false);

	const [editOpen, setEditOpen] = useState(false);

	const [deleteOpen, setDeleteOpen] = useState(false);

	function handleEdit() {
		setPopoverOpen(false);
		setEditOpen(true);
	}

	function handleDelete() {
		setPopoverOpen(false);
		setDeleteOpen(true);
	}

	return (
		<>
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="hover:bg-gray-100/80"
					>
						<MoreHorizontal className="size-5" />
					</Button>
				</PopoverTrigger>

				<PopoverContent align="end" className="w-40 p-1">
					<Button
						type="button"
						variant="ghost"
						onClick={handleEdit}
						className="w-full justify-start hover:bg-gray-200"
					>
						<Pencil className="mr-2 size-4" />
						Edit
					</Button>

					<Button
						type="button"
						variant="ghost"
						onClick={handleDelete}
						className="w-full justify-start text-destructive hover:bg-gray-200 hover:text-destructive"
					>
						<Trash2 className="mr-2 size-4" />
						Delete
					</Button>
				</PopoverContent>
			</Popover>

			<EditScheduledWorkoutDialog
				workout={workout}
				clientId={clientId}
				open={editOpen}
				onOpenChange={setEditOpen}
			/>

			<DeleteScheduledWorkoutDialog
				scheduledWorkoutId={workout.id}
				clientId={clientId}
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
			/>
		</>
	);
}
