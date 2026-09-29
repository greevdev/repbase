"use client";

export default function MonthText() {
	const months = [
		"Jan.",
		"Feb.",
		"Mar.",
		"Apr.",
		"May",
		"Jun.",
		"Jul.",
		"Aug.",
		"Sep.",
		"Oct.",
		"Nov.",
		"Dec.",
	];

	const currentMonth = Number(new Date().getMonth());

	return months[currentMonth];
}
