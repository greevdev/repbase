import ActiveClients from "@/components/clients/active-clients";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import ClientsList from "@/components/clients/clients-list";
import MonthlyRevenue from "@/components/clients/monthly-revenue";
import MonthText from "@/components/month-text";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import RecentActivityBoard from "@/components/workouts/recent-activity-board";
import { User, DollarSign, Users2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function DashboardPage() {
	return (
		<div className="space-y-6 pb-10 md:space-y-8">
			<Suspense
				fallback={
					<div className="mx-auto flex w-max items-center gap-2 text-xl text-muted-foreground">
						<Spinner />
					</div>
				}
			>
				<div className="grid grid-cols-2 items-center gap-2 md:gap-4 lg:grid-cols-4">
					<div className="dashboard-card flex flex-col gap-3">
						<h3 className="flex items-center gap-1 text-xs font-medium text-muted-foreground md:text-sm">
							<User size={20} />
							<span>Active Clients</span>
						</h3>

						<div className="text-2xl font-bold md:text-3xl">
							<ActiveClients />
							<span className="ml-2 text-[0.9rem] font-medium text-accent">
								Clients
							</span>
						</div>
					</div>

					<div className="dashboard-card flex flex-col gap-3">
						<h3 className="flex items-center gap-1 text-xs font-medium text-muted-foreground md:text-sm">
							<DollarSign size={20} />
							<span>Monthly Revenue</span>
						</h3>

						<div className="text-2xl font-bold md:text-3xl">
							€<MonthlyRevenue />
							<span className="ml-1 text-[0.9rem] font-medium text-accent">
								/ <MonthText />
							</span>
						</div>
					</div>

					<div className="dashboard-card h-full" />
					<div className="dashboard-card h-full" />
				</div>

				<RecentActivityBoard />

				<div className="space-y-4">
					<div className="flex items-center justify-between md:gap-7">
						<h3 className="flex items-center gap-2 font-semibold md:text-lg">
							<Users2 className="text-accent" />
							<span className="whitespace-nowrap">
								Manage your clients
							</span>
						</h3>

						<div className="hidden h-px w-full bg-foreground/10 md:block" />

						<div className="flex items-center gap-3">
							<Link
								className="hidden sm:block"
								href="/dashboard/clients"
							>
								<Button className="rounded-lg bg-white px-8 text-foreground hover:bg-gray-100 md:py-5">
									View All
								</Button>
							</Link>

							<AddClientDialog />
						</div>
					</div>

					<ClientsList />

					<Link className="sm:hidden" href="/dashboard/clients">
						<Button className="mt-5 w-full rounded-lg bg-white py-5 text-foreground hover:bg-gray-100">
							View All
						</Button>
					</Link>
				</div>
			</Suspense>
		</div>
	);
}
