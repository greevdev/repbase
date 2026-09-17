import { Suspense } from "react";
import ClientDetails from "@/components/clients/client-details";

export default function ClientPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return (
		<Suspense fallback={<p>Loading client...</p>}>
			<ClientDetails params={params} />
		</Suspense>
	);
}
