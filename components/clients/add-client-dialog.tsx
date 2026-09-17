"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { addClient } from "@/app/dashboard/actions";
import { useState } from "react";
import { toast } from "sonner";

export function AddClientDialog() {
	const [open, setOpen] = useState(false);

	async function handleSubmit(formData: FormData) {
		const result = await addClient(formData);

		if (result.success) {
			setOpen(false);
			toast.success("Client added successfully");
		} else {
			toast.error("Failed to add new client");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-emerald-700 hover:bg-emerald-900">
					<Plus className="mr-1 size-4" />
					New Client
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add client</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-4">
					<Input name="name" placeholder="Client name" required />

					<Input name="goal" placeholder="Goal" />

					<Input
						name="year_of_birth"
						type="number"
						placeholder="Year of birth"
						min="1900"
					/>

					<Textarea name="notes" placeholder="Notes" />

					<Button type="submit" className="w-full">
						Add client
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
