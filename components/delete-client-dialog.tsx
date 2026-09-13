"use client";

import { Trash2 } from "lucide-react";
import { deleteClient } from "@/app/protected/actions";

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

export function DeleteClientDialog({
	clientId,
	clientName,
}: {
	clientId: string;
	clientName: string;
}) {
	async function handleDelete() {
		await deleteClient(clientId);
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" size="sm">
					<Trash2 className="mr-2 size-4" />
					Delete
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete {clientName}?</AlertDialogTitle>

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
