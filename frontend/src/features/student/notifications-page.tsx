import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ApiResponseError, createApiClient, unwrapResponse } from "@/lib/api";
import { useSession } from "@/lib/auth";
import { formatDateTime, notificationLabel } from "@/lib/format";
import { useRuntimeConfig } from "@/lib/runtime-config";
import type { AppNotification } from "@/lib/types";
import { EmptyState } from "@/shared/empty-state";
import { ErrorCard, LoadingCard, StudentPageFrame } from "./shared";

export function StudentNotificationsPage() {
	const { signOut, setNotificationCount } = useSession();
	const { client_time_offset_ms: clientOffsetMs } = useRuntimeConfig();
	const [notifications, setNotifications] = useState<AppNotification[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		unwrapResponse<{ notifications: AppNotification[]; unreadCount: number }>(
			createApiClient().student.notifications.get(),
		)
			.then(async (data) => {
				setNotifications(data.notifications);
				setNotificationCount(0);
				if (data.unreadCount > 0) {
					await unwrapResponse(
						createApiClient().student.notifications.read.post(),
					);
				}
			})
			.catch((nextError) => {
				if (nextError instanceof ApiResponseError && nextError.status === 401) {
					signOut();
					return;
				}
				setError(
					nextError instanceof Error ? nextError.message : "加载通知失败。",
				);
			})
			.finally(() => setLoading(false));
	}, [setNotificationCount, signOut]);

	return (
		<StudentPageFrame title="消息通知">
			{loading ? (
				<LoadingCard label="正在同步通知..." />
			) : error ? (
				<ErrorCard message={error} />
			) : notifications.length === 0 ? (
				<EmptyState title="暂无通知" />
			) : (
				<div className="space-y-4">
					{notifications.map((notification) => (
						<Card
							key={notification.id}
							variant={notification.is_read ? "default" : "selected"}
						>
							<CardContent className="flex flex-col gap-3">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div className="flex items-center gap-2">
										<Badge
											variant={
												notification.type === "approved"
													? "default"
													: notification.type === "rejected" ||
															notification.type === "deleted"
														? "destructive"
														: "secondary"
											}
										>
											{notificationLabel(notification.type)}
										</Badge>
										{!notification.is_read ? (
											<Badge variant="default">未读</Badge>
										) : null}
									</div>
									<p className="text-sm text-muted-foreground">
										{formatDateTime(
											notification.created_at,
											"-",
											clientOffsetMs,
										)}
									</p>
								</div>
								<p className="text-sm leading-7 text-muted-foreground">
									{notification.message}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</StudentPageFrame>
	);
}
