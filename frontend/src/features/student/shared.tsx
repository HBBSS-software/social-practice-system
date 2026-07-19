import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { statusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export function StudentPageFrame({
	title,
	description,
	action,
	className,
	children,
}: {
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className={cn("min-w-0 space-y-5 sm:space-y-6", className)}>
			<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
				<div className="space-y-2">
					<h1 className="text-xl font-bold tracking-tight sm:text-2xl">
						{title}
					</h1>
					{description ? (
						<p className="max-w-2xl text-sm text-muted-foreground">
							{description}
						</p>
					) : null}
				</div>
				{action}
			</div>
			{children}
		</div>
	);
}

export function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			{children}
		</div>
	);
}

export function LoadingCard({ label }: { label: string }) {
	return (
		<Card>
			<CardContent className="flex min-h-52 items-center justify-center gap-3 text-sm text-muted-foreground">
				<Spinner />
				{label}
			</CardContent>
		</Card>
	);
}

export function ErrorCard({
	message,
	onRetry,
}: {
	message: string;
	onRetry?: () => void;
}) {
	return (
		<Card>
			<CardContent className="flex min-h-52 flex-col items-center justify-center gap-4 text-center">
				<p className="text-sm text-destructive">{message}</p>
				{onRetry ? (
					<Button variant="secondary" onClick={onRetry}>
						重新加载
					</Button>
				) : null}
			</CardContent>
		</Card>
	);
}

export function StatusBadge({ status }: { status: string }) {
	return (
		<Badge
			variant={
				status === "approved"
					? "default"
					: status === "rejected"
						? "destructive"
						: "outline"
			}
		>
			{statusLabel(status)}
		</Badge>
	);
}
