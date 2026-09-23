"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { editClient } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
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

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			className="w-full rounded-lg"
			size="lg"
			disabled={pending}
		>
			{pending ? (
				<>
					<Spinner className="size-4" />
				</>
			) : (
				"Save changes"
			)}
		</Button>
	);
}

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
				<Button
					variant="outline"
					className="bg-white hover:bg-gray-50 rounded-lg"
				>
					Edit Client
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit client</DialogTitle>
				</DialogHeader>

				<form action={handleSubmit} className="space-y-4 mt-2">
					<Input
						name="name"
						defaultValue={client.name}
						placeholder="Client name"
						className="text-sm"
						required
					/>

					<Input
						name="goal"
						defaultValue={client.goal ?? ""}
						className="text-sm"
						placeholder="Goal"
					/>

					<Input
						name="year_of_birth"
						type="number"
						className="text-sm"
						min="1900"
						defaultValue={client.year_of_birth ?? ""}
						placeholder="Year of birth"
					/>

					<Textarea
						className="text-sm"
						name="notes"
						defaultValue={client.notes ?? ""}
						placeholder="Notes"
					/>

					<SubmitButton />
				</form>
			</DialogContent>
		</Dialog>
	);
}
