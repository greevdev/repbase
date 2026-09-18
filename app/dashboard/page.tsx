import ActiveClients from "@/components/clients/active-clients";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import ClientsList from "@/components/clients/clients-list";
import MonthlyRevenue from "@/components/clients/monthly-revenue";
import { Spinner } from "@/components/ui/spinner";
import RecentActivityBoard from "@/components/workouts/recent-activity-board";
import { User, DollarSign } from "lucide-react";
import { Suspense } from "react";

export default function DashboardPage() {
	return (
		<div className="space-y-8">
			<Suspense
				fallback={
					<div className="text-muted-foreground w-max mx-auto flex items-center gap-2 text-xl">
						Loading
						<Spinner />
					</div>
				}
			>
				<div className="grid grid-cols-4 gap-4 items-center">
					<div className="dashboard-card flex flex-col gap-3">
						<h3 className="font-medium text-muted-foreground text-sm flex items-center gap-1">
							<User size={20} />
							<span>Active Clients</span>
						</h3>

						<div className="text-3xl font-bold">
							<ActiveClients />
							<span className="text-[0.9rem] ml-2 font-medium text-accent">
								Clients
							</span>
						</div>
					</div>

					<div className="dashboard-card flex flex-col gap-3">
						<h3 className="font-medium text-muted-foreground text-sm flex items-center gap-1">
							<DollarSign size={20} />
							<span>Monthly Revenue</span>
						</h3>

						<div className="text-3xl font-bold">
							€<MonthlyRevenue />
							<span className="text-[0.9rem] ml-1 font-medium text-accent">
								/ month
							</span>
						</div>
					</div>

					<div className="dashboard-card h-full" />
					<div className="dashboard-card h-full" />
				</div>

				<RecentActivityBoard />

				<ClientsList />
			</Suspense>
		</div>
	);
}
