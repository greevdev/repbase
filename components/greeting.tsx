"use client";

import { useEffect, useState } from "react";

export default function Greeting() {
	const [greeting, setGreeting] = useState("Hello");

	useEffect(() => {
		const hour = new Date().getHours();

		if (hour < 12) {
			setGreeting("Good Morning");
		} else if (hour < 18) {
			setGreeting("Good Afternoon");
		} else {
			setGreeting("Good Evening");
		}
	}, []);

	return <h1 className="text-xl font-semibold">{greeting}, Coach</h1>;
}
