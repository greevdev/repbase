import ActiveClients from "@/components/clients/active-clients";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import ClientsList from "@/components/clients/clients-list";
import RecentActivityBoard from "@/components/workouts/recent-activity-board";
import { User } from "lucide-react";
import { Suspense } from "react";

export default function DashboardPage() {
	return (
		<div className="space-y-8">
			<div className="grid grid-cols-4 gap-4 items-center">
				<div className="dashboard-card flex flex-col gap-3">
					<h3 className="font-medium text-muted-foreground text-sm flex items-center gap-1">
						<User size={20} />
						<span>Active Clients</span>
					</h3>

					<div className="text-3xl font-bold">
						<Suspense
							fallback={
								<p className="text-sm text-muted-foreground">
									Loading Clients
								</p>
							}
						>
							<ActiveClients />
							<span className="text-[0.9rem] ml-2 font-medium text-accent">
								Clients
							</span>
						</Suspense>
					</div>
				</div>

				<div className="dashboard-card h-full" />
				<div className="dashboard-card h-full" />
				<div className="dashboard-card h-full" />
			</div>

			<Suspense fallback={<p>Loading...</p>}>
				<RecentActivityBoard />
			</Suspense>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Suspense fallback={<p>Loading...</p>}>
					<ClientsList />
				</Suspense>
			</div>
		</div>
	);
}
