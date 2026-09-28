import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { EllipsisIcon } from "lucide-react";
import { DeleteWorkoutTemplateDialog } from "./delete-workout-template-dialog";

interface WorkoutTemplateOptionsProps {
	templateId: string;
	clientId: string;
}

export default function WorkoutTemplateOptionsPopover({
	templateId,
	clientId,
}: WorkoutTemplateOptionsProps) {
	return (
		<Popover>
			<PopoverTrigger className="mt-0 w-max justify-self-start rounded-lg border border-muted-foreground/30 p-1 text-muted-foreground/70 transition hover:bg-gray-100/80">
				<EllipsisIcon />
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="rounded-lg shadow-lg shadow-muted-foreground/20"
			>
				<PopoverHeader>
					<PopoverDescription>
						<DeleteWorkoutTemplateDialog
							templateId={templateId}
							clientId={clientId}
						/>
					</PopoverDescription>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	);
}
