"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { editClient } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type Client = {
	id: string;
	name: string;
	goal: string | null;
	year_of_birth: number | null;
	notes: string | null;
};

export function EditClientDialog({ client }: { client: Client }) {
	const [open, setOpen] = useState(false);

	async function handleSubmit(formData: FormData) {
		const result = await editClient(client.id, formData);

		if (result.success) {
			setOpen(false);
			toast.success("Client edited successfully");
		} else {
			toast.error(result.error ?? "Failed to edit client");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Pencil className="mr-2 size-4" />
					Edit
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit client</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-4">
					<Input
						name="name"
						defaultValue={client.name}
						placeholder="Client name"
						required
					/>

					<Input
						name="goal"
						defaultValue={client.goal ?? ""}
						placeholder="Goal"
					/>

					<Input
						name="year_of_birth"
						type="number"
						min="1900"
						defaultValue={client.year_of_birth ?? ""}
						placeholder="Year of birth"
					/>

					<Textarea
						name="notes"
						defaultValue={client.notes ?? ""}
						placeholder="Notes"
					/>

					<Button type="submit" className="w-full">
						Save changes
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
