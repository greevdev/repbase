"use client";

import { Trash2 } from "lucide-react";
import { deleteClient } from "@/app/dashboard/actions";

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
import { Input } from "../ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteClientDialog({
	clientId,
	clientName,
}: {
	clientId: string;
	clientName: string;
}) {
	const router = useRouter();

	async function handleDelete() {
		const result = await deleteClient(clientId);

		if (result.success) {
			toast.success("Client deleted successfully");
			router.push("/dashboard");
		} else {
			toast.error(result.error ?? "Failed to delete client");
		}
	}

	const [clientNameInput, setClientNameInput] = useState("");

	function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setClientNameInput(event.target.value);
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					className="rounded-lg aspect-square bg-white text-red-400 hover:bg-gray-50"
					variant="outline"
				>
					<Trash2 className="size-4" />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-center w-full">
						Delete client {clientName}?
					</AlertDialogTitle>

					<AlertDialogDescription className="text-center w-full">
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Input
					type="text"
					name="name"
					value={clientNameInput}
					placeholder="Enter client's name to confirm deletion."
					onChange={handleChange}
				/>

				<AlertDialogFooter className="w-full grid grid-cols-2">
					<AlertDialogCancel className="py-5 rounded-[0.7em] hover:bg-gray-100">
						Cancel
					</AlertDialogCancel>

					<AlertDialogAction
						className="disabled:bg-foreground/95 py-5 border border-black rounded-[0.7em] disabled:border-foreground/95"
						onClick={handleDelete}
						disabled={clientNameInput != clientName}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
