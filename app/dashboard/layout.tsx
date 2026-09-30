import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users } from "lucide-react";
import dumbbellsvg from "@/public/dumbbell.svg";
import Image from "next/image";
import { Suspense } from "react";
import CurrentDateBadge from "@/components/current-date-badge";
import Greeting from "@/components/greeting";
import MobileMenu from "@/components/mobile-menu";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Suspense fallback={null}>
				<ScrollToTop />
			</Suspense>

			<div className="flex min-h-screen bg-muted/20">
				<aside className="sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-white md:flex md:w-48 lg:w-52 xl:w-64">
					<div className="flex h-16 items-center border-b px-6">
						<Link
							href="/dashboard"
							className="flex items-center gap-1 text-xl font-bold lg:text-[1.4rem]"
						>
							<Image alt="dumbbell" src={dumbbellsvg} />
							RepBase
						</Link>
					</div>

					<nav className="flex-1 space-y-2 overflow-y-auto p-4 text-foreground/80">
						<Link
							href="/dashboard"
							className="btn flex items-center gap-3"
						>
							<LayoutDashboard className="size-5" />
							Dashboard
						</Link>

						<Link
							href="/dashboard/clients"
							className="btn flex items-center gap-3"
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
					<header className="sticky top-0 z-20 h-16 border-b bg-white">
						<div className="hidden h-full items-center justify-between px-6 md:flex">
							<Greeting />

							<Suspense>
								<CurrentDateBadge />
							</Suspense>
						</div>

						<div className="flex h-full items-center justify-between px-4 md:hidden">
							<Link
								href="/dashboard"
								className="flex items-center gap-1 text-xl font-bold lg:text-[1.4rem]"
							>
								<Image alt="dumbbell" src={dumbbellsvg} />
								RepBase
							</Link>

							<MobileMenu />
						</div>
					</header>

					<main className="flex-1 p-4 md:p-8">
						<div className="mx-auto max-w-6xl">{children}</div>
					</main>
				</div>
			</div>
		</>
	);
}
