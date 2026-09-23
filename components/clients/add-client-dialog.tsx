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
import { Spinner } from "../ui/spinner";
import { useFormStatus } from "react-dom";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			className="w-full rounded-xl font-semibold shadow-lg shadow-muted-foreground/5 py-6"
		>
			{pending ? <Spinner className="size-4" /> : "Add client"}
		</Button>
	);
}

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
				<Button className="bg-accent hover:bg-accentDark py-5 rounded-lg">
					<Plus className="mr-1 size-4" />
					New Client
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-xl">Add client</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-4 mt-2">
					<Input
						className="text-sm"
						name="name"
						placeholder="Client name"
						required
					/>

					<Input className="text-sm" name="goal" placeholder="Goal" />

					<Input
						className="text-sm"
						name="year_of_birth"
						type="number"
						placeholder="Year of birth"
						min="1900"
					/>

					<Textarea
						className="text-sm"
						name="notes"
						placeholder="Notes"
					/>

					<SubmitButton />
				</form>
			</DialogContent>
		</Dialog>
	);
}
