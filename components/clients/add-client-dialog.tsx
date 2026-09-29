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
			className="w-full rounded-xl py-6 font-semibold shadow-lg shadow-muted-foreground/5"
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
				<Button className="rounded-lg bg-accent hover:bg-accentDark md:py-5">
					<Plus className="mr-1 size-4" />
					New Client
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-xl">Add client</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="mt-2 space-y-4">
					<Input
						className="text-[16px]"
						name="name"
						placeholder="Client name"
						required
					/>

					<Input
						className="text-[16px]"
						name="goal"
						placeholder="Goal"
					/>

					<Input
						className="text-[16px]"
						name="year_of_birth"
						type="number"
						placeholder="Year of birth"
						min="1900"
					/>

					<Textarea
						className="text-[16px]"
						name="notes"
						placeholder="Notes"
					/>

					<SubmitButton />
				</form>
			</DialogContent>
		</Dialog>
	);
}
