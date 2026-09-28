"use client";

export default function MonthText() {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const currentMonth = Number(new Date().getMonth());

	return months[currentMonth];
}
