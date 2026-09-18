import { WorkspaceShell } from "@/components/workspace-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell admin>{children}</WorkspaceShell>;
}
