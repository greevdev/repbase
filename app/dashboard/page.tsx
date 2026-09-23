import ActiveClients from "@/components/clients/active-clients";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import ClientsList from "@/components/clients/clients-list";
import MonthlyRevenue from "@/components/clients/monthly-revenue";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import RecentActivityBoard from "@/components/workouts/recent-activity-board";
import { User, DollarSign, Users2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function DashboardPage() {
	return (
		<div className="space-y-6 md:space-y-8 pb-10">
			<Suspense
				fallback={
					<div className="text-muted-foreground w-max mx-auto flex items-center gap-2 text-xl">
						Loading
						<Spinner />
					</div>
				}
			>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 items-center">
					<div className="dashboard-card flex flex-col gap-3">
						<h3 className="font-medium text-muted-foreground text-xs md:text-sm flex items-center gap-1">
							<User size={20} />
							<span>Active Clients</span>
						</h3>

						<div className="text-2xl md:text-3xl font-bold">
							<ActiveClients />
							<span className="text-[0.9rem] ml-2 font-medium text-accent">
								Clients
							</span>
						</div>
					</div>

					<div className="dashboard-card flex flex-col gap-3">
						<h3 className="font-medium text-muted-foreground text-xs md:text-sm flex items-center gap-1">
							<DollarSign size={20} />
							<span>Monthly Revenue</span>
						</h3>

						<div className="text-2xl md:text-3xl font-bold">
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

				<div className="space-y-4">
					<div className="flex items-center justify-between md:gap-7">
						<h3 className="font-semibold md:text-lg flex items-center gap-2">
							<Users2 className="text-accent" />
							<span className="whitespace-nowrap">
								Manage your clients
							</span>
						</h3>

						<div className="h-px w-full bg-foreground/10 hidden md:block" />

						<div className="flex items-center gap-3">
							<Link
								className="hidden sm:block"
								href="/dashboard/clients"
							>
								<Button className="bg-white text-foreground hover:bg-gray-100 md:py-5 px-8 rounded-lg">
									View All
								</Button>
							</Link>

							<AddClientDialog />
						</div>
					</div>

					<ClientsList />

					<Link className="sm:hidden" href="/dashboard/clients">
						<Button className="bg-white w-full mt-5 text-foreground hover:bg-gray-100 py-5 rounded-lg">
							View All
						</Button>
					</Link>
				</div>
			</Suspense>
		</div>
	);
}
