type GoogleCalendarEvent = {
	title: string;
	start: Date;
	durationMinutes: number;
	clientName: string;
	notes?: string | null;
};

export function createGoogleCalendarUrl({
	title,
	start,
	durationMinutes,
	clientName,
	notes,
}: GoogleCalendarEvent) {
	const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

	function formatGoogleDate(date: Date) {
		return date
			.toISOString()
			.replace(/[-:]/g, "")
			.replace(/\.\d{3}Z$/, "Z");
	}

	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: `${title} - ${clientName}`,
		dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
		details: notes ?? "",
	});

	return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
