"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { PREDEFINED_EXERCISES } from "@/lib/exercises";

type ExerciseSelectorProps = {
	value: string;
	onSelect: (name: string) => void;
	onCustom: () => void;
};

export function ExerciseSelector({
	value,
	onSelect,
	onCustom,
}: ExerciseSelectorProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					role="combobox"
					aria-expanded={open}
					className="h-auto justify-between px-0 text-xl font-semibold hover:bg-transparent"
				>
					{value || (
						<span className="text-gray-600">Select exercise</span>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent
				className="z-[100] w-full p-0 md:w-[400px]"
				align="start"
			>
				<Command>
					<CommandInput
						className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						placeholder="Search exercises..."
					/>

					<CommandList
						className="overflow-y-scroll overscroll-contain"
						onWheel={(e) => e.stopPropagation()}
					>
						<CommandEmpty>No exercise found.</CommandEmpty>

						<CommandGroup>
							<CommandItem
								className="transition duration-75 data-[selected=true]:bg-gray-200"
								onSelect={() => {
									onCustom();
									setOpen(false);
								}}
							>
								<Plus className="mr-2 size-4" />
								Custom exercise
							</CommandItem>
						</CommandGroup>

						<CommandGroup>
							{PREDEFINED_EXERCISES.map((exercise) => (
								<CommandItem
									key={`${exercise.name}-${exercise.equipment}`}
									value={exercise.name}
									onSelect={() => {
										onSelect(exercise.name);
										setOpen(false);
									}}
									className="transition duration-75 data-[selected=true]:bg-gray-200"
								>
									<div className="flex flex-1 flex-col">
										<span>{exercise.name}</span>

										<span className="text-xs text-muted-foreground">
											{exercise.category} ·{" "}
											{exercise.equipment}
										</span>
									</div>

									{value === exercise.name && (
										<Check className="size-4" />
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
