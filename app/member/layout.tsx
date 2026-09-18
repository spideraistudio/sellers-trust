import { WorkspaceShell } from "@/components/workspace-shell";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
