import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { DeleteWorkoutTemplateDialog } from "./delete-workout-template-dialog";
import { EditWorkoutTemplateDialog } from "./edit-workout-template-dialog";

type TemplateSet = {
	id: string;
	set_number: number;
};

type TemplateExercise = {
	id: string;
	name: string;
	notes: string | null;
	position: number;
	workout_template_sets: TemplateSet[];
};

type WorkoutTemplate = {
	id: string;
	title: string;
	workout_template_exercises: TemplateExercise[];
};

interface WorkoutTemplateOptionsProps {
	template: WorkoutTemplate;
	clientId: string;
}

export default function WorkoutTemplateOptionsPopover({
	template,
	clientId,
}: WorkoutTemplateOptionsProps) {
	return (
		<Popover>
			<PopoverTrigger className="mt-0 w-max justify-self-start rounded-lg p-2 transition hover:bg-gray-100/80">
				<MoreHorizontal className="size-5" />
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="rounded-lg shadow-lg shadow-muted-foreground/20"
			>
				<PopoverHeader>
					<PopoverDescription className="flex flex-col gap-2">
						<EditWorkoutTemplateDialog
							template={template}
							clientId={clientId}
						/>

						<DeleteWorkoutTemplateDialog
							templateId={template.id}
							clientId={clientId}
						/>
					</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	);
}
