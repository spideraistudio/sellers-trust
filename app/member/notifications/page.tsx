import { requireApprovedMember } from "@/lib/member-session";
import { listNotifications } from "@/lib/notifications";
import { NotificationList } from "@/components/notification-list";
import { ReportShell } from "@/components/report-shell";
export const dynamic="force-dynamic";
export default async function Page(){const member=await requireApprovedMember();const items=await listNotifications("member",member.id);return <ReportShell title="Notifications" description="Updates about your membership, reports, corrections, resolutions and account security."><NotificationList initial={items}/></ReportShell>;}
