import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "RepBase | Personal Training Management",
	description:
		"Manage clients, workouts, training templates, and scheduled sessions in one simple workspace for personal trainers.",
};

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

const inter = Inter({
	variable: "--font-inter",
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} text-foreground antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster duration={2500} />
				</ThemeProvider>
			</body>
		</html>
	);
}
