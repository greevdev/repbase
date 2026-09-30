"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { LayoutDashboard, Menu, Users } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { useState } from "react";

const MobileMenu = () => {
	const [open, setOpen] = useState(false);

	const closeMenu = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					className="aspect-square bg-white hover:bg-gray-200"
					variant="outline"
				>
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent showCloseButton={false} side="left">
				<SheetHeader className="pb-0">
					<SheetTitle className="text-2xl">Menu</SheetTitle>
				</SheetHeader>

				<div className="mx-auto h-px w-full bg-gray-300" />

				<nav className="flex-1 space-y-2 overflow-y-auto p-4 text-foreground/80">
					<Link
						href="/dashboard"
						className="btn flex items-center gap-3"
						onClick={closeMenu}
					>
						<LayoutDashboard className="size-5" />
						Dashboard
					</Link>

					<Link
						href="/dashboard/clients"
						className="btn flex items-center gap-3"
						onClick={closeMenu}
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
							onClick={closeMenu}
						>
							Logout
						</Button>
					</form>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileMenu;
