"use client";
import { CalendarDays } from "lucide-react";

export default function CurrentDateBadge() {
	const today = new Date();
	const currentDayOfMonth = today.getDate();
	const currentMonth = Number(today.getMonth());
	const currentDayOfWeek = today.getDay();

	const monthsArray = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const daysArray = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	return (
		<div className="bg-emerald-100 px-3 py-2 text-emerald-900 font-semibold rounded-lg flex w-max space-x-2 items-center">
			<span>{<CalendarDays size={20} />}</span>
			<span>
				Today is {currentDayOfMonth} {monthsArray[currentMonth]}.{" "}
				{daysArray[currentDayOfWeek]}
			</span>
		</div>
	);
}
3