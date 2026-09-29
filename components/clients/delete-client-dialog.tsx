"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteClient } from "@/app/dashboard/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

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
	const router = useRouter();

	const [clientNameInput, setClientNameInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	async function handleDelete() {
		setLoading(true);

		try {
			const result = await deleteClient(clientId);

			if (result.success) {
				setOpen(false);
				toast.success("Client deleted successfully");
				router.push("/dashboard");
			} else {
				toast.error(result.error ?? "Failed to delete client");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					className="aspect-square rounded-lg bg-white text-red-400 hover:bg-gray-50"
					variant="outline"
				>
					<Trash2 className="size-4" />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="w-full text-center">
						Delete client {clientName}?
					</AlertDialogTitle>

					<AlertDialogDescription className="w-full text-center">
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Input
					type="text"
					name="name"
					value={clientNameInput}
					className="text-[16px]"
					placeholder="Enter client's name to confirm"
					onChange={(e) => setClientNameInput(e.target.value)}
					disabled={loading}
				/>

				<AlertDialogFooter className="grid w-full grid-cols-2">
					<AlertDialogCancel
						className="rounded-[0.7em] py-5 hover:bg-gray-100"
						disabled={loading}
					>
						Cancel
					</AlertDialogCancel>

					<Button
						type="button"
						onClick={handleDelete}
						disabled={clientNameInput !== clientName || loading}
						className="rounded-[0.7em] border border-black py-5"
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
