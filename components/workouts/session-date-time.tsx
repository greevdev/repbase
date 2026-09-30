"use client";

export function SessionDateTime({ scheduledAt }: { scheduledAt: string }) {
	const date = new Date(scheduledAt);

	const formattedDate = date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	const formattedTime = date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<>
			<span>{formattedDate}</span>
			<span>{formattedTime}</span>
		</>
	);
}
