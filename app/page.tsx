import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { Suspense } from "react";

export default async function HomePage() {
	async function AuthRedirect() {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (user) {
			redirect("/dashboard");
		}

		return null;
	}

	return (
		<>
			<Suspense fallback={null}>
				<AuthRedirect />
			</Suspense>

			<main className="flex min-h-screen items-center justify-center bg-background px-6">
				<div className="w-full max-w-xl text-center">
					<div className="mx-auto flex w-max items-center gap-3">
						<div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-white">
							<Dumbbell className="size-8" />
						</div>

						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
							RepBase
						</h1>
					</div>

					<p className="mx-auto mt-4 text-balance text-sm leading-7 text-muted-foreground sm:max-w-lg sm:text-lg">
						A simple workspace for personal trainers to manage
						clients, log workouts, create templates, and schedule
						sessions.
					</p>

					<div className="mt-8 flex justify-center">
						<Button asChild size="lg" className="rounded-xl px-8">
							<Link href="/auth/login">Get Started</Link>
						</Button>
					</div>

					<p className="mt-6 text-sm text-muted-foreground">
						A simpler way to manage your coaching business.
					</p>
				</div>
			</main>
		</>
	);
}
