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
import { addClient } from "@/app/protected/actions";
import { useState } from "react";

export function AddClientDialog() {
	const [open, setOpen] = useState(false);

	async function handleSubmit(formData: FormData) {
		const result = await addClient(formData);

		if (result.success) {
			setOpen(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 size-4" />
					Add client
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
