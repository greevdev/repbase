"use client";

import { useEffect, useState } from "react";

export default function Greeting() {
	const [greeting, setGreeting] = useState("Hello");

	useEffect(() => {
		const hour = new Date().getHours();

		if (hour < 4) {
			setGreeting("Good Night");
		} else if (hour < 12) {
			setGreeting("Good Morning");
		} else if (hour < 18) {
			setGreeting("Good Afternoon");
		} else if (hour < 22) {
			setGreeting("Good Evening");
		} else {
			setGreeting("Good Night");
		}
	}, []);

	return <h1 className="text-xl font-semibold">{greeting}, Coach</h1>;
}
