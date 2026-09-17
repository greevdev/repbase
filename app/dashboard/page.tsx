import { AddClientDialog } from "@/components/clients/add-client-dialog";
import ClientsList from "@/components/clients/clients-list";
import CurrentDateBadge from "@/components/current-date-badge";
import { Suspense } from "react";

export default function DashboardPage() {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<Suspense>
						<CurrentDateBadge />
					</Suspense>

					<h1 className="text-3xl font-bold mt-3">
						Good Morning, Coach Georgi
					</h1>

					<p className="mt-1 text-muted-foreground">
						Manage your clients and their training programs.
					</p>
				</div>

				<AddClientDialog />
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Suspense fallback={<p>Loading...</p>}>
					<ClientsList />
				</Suspense>
			</div>
		</div>
	);
}
