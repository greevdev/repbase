import { Suspense } from "react";
import ClientDetails from "@/components/clients/client-details";
import { Spinner } from "@/components/ui/spinner";

export default function ClientPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return (
		<Suspense
			fallback={
				<div className="text-muted-foreground w-max mx-auto flex items-center gap-2 text-xl">
					Loading
					<Spinner />
				</div>
			}
		>
			<ClientDetails params={params} />
		</Suspense>
	);
}
