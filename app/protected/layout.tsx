import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-muted/30">
			<header className="border-b bg-background">
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
					<Link href="/protected" className="text-lg font-semibold">
						RepBase
					</Link>

					<div className="flex items-center space-x-5">
						<div className="text-sm text-muted-foreground">
							Georgi
						</div>

						<form action={logout}>
							<Button type="submit" variant="outline">
								Logout
							</Button>
						</form>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
		</div>
	);
}
