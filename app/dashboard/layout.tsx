import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users } from "lucide-react";
import dumbbellsvg from "@/public/dumbbell.svg";
import Image from "next/image";
import { Suspense } from "react";
import CurrentDateBadge from "@/components/current-date-badge";
import Greeting from "@/components/greeting";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen bg-muted/20">
			<aside className="sticky top-0 h-screen hidden md:w-48 lg:w-52 xl:w-64 shrink-0 border-r bg-white md:flex flex-col">
				<div className="flex h-16 items-center border-b px-6">
					<Link
						href="/dashboard"
						className="text-xl lg:text-[1.4rem] font-bold flex items-center gap-1"
					>
						<Image alt="dumbbell" src={dumbbellsvg} />
						RepBase
					</Link>
				</div>

				<nav className="p-4 space-y-2 text-foreground/80 flex-1 overflow-y-auto">
					<Link
						href="/dashboard"
						className="flex items-center gap-3 btn"
					>
						<LayoutDashboard className="size-5" />
						Dashboard
					</Link>

					<Link
						href="/dashboard"
						className="flex items-center gap-3 btn"
					>
						<Users className="size-5" />
						Clients
					</Link>
				</nav>

				<div className="mt-auto p-4">
					<form action={logout}>
						<Button
							type="submit"
							variant="secondary"
							className="w-full"
						>
							Logout
						</Button>
					</form>
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="h-16 border-b bg-white sticky top-0 z-20">
					<div className="hidden md:flex h-full items-center justify-between px-6">
						<Greeting />

						<Suspense>
							<CurrentDateBadge />
						</Suspense>
					</div>

					<div className="md:hidden flex h-full items-center justify-between px-4">
						<Link
							href="/dashboard"
							className="text-xl lg:text-[1.4rem] font-bold flex items-center gap-1"
						>
							<Image alt="dumbbell" src={dumbbellsvg} />
							RepBase
						</Link>
					</div>
				</header>

				<main className="flex-1 p-4 md:p-8">
					<div className="mx-auto max-w-6xl">{children}</div>
				</main>
			</div>
		</div>
	);
}
