"use client";

type NextSessionContentProps = {
	scheduledAt: string;
};

export function NextSessionContent({ scheduledAt }: NextSessionContentProps) {
	const date = new Date(scheduledAt);
	const now = new Date();

	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	const sessionDay = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);

	const difference = Math.round(
		(sessionDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);

	let dateLabel: string;

	if (difference === 0) {
		dateLabel = "Today";
	} else if (difference === 1) {
		dateLabel = "Tomorrow";
	} else {
		dateLabel = date.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
		});
	}

	const time = date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<p className="text-2xl font-bold">
			{dateLabel}
			<span className="ml-3 text-[0.9rem] font-medium text-accent">
				{time}
			</span>
		</p>
	);
}
