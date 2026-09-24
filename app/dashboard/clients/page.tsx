import ClientsDetails from "@/components/clients/clients-details";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function DashboardPage() {
	return (
		<div className="space-y-6 md:space-y-8">
			<Suspense
				fallback={
					<div className="mx-auto flex w-max items-center gap-2 text-xl text-muted-foreground">
						Loading
						<Spinner />
					</div>
				}
			>
				<ClientsDetails />
			</Suspense>
		</div>
	);
}
