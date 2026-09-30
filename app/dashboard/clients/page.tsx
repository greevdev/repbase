import ClientsDetails from "@/components/clients/clients-details";
import { Spinner } from "@/components/ui/spinner";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function DashboardPage() {
	return (
		<div className="space-y-6 md:space-y-8">
			<Suspense
				fallback={
					<div className="mx-auto flex w-max items-center gap-2 text-xl text-muted-foreground">
						<Spinner />
					</div>
				}
			>
				<div className="flex items-center gap-1 text-sm text-muted-foreground">
					<Link
						href="/dashboard"
						className="underline transition hover:text-black"
					>
						Dashboard
					</Link>
					<ChevronRight className="text-foreground/30" size={16} />
					<p className="font-semibold text-foreground">Clients</p>
				</div>

				<ClientsDetails />
			</Suspense>
		</div>
	);
}
