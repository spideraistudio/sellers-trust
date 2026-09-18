"use client";

import type { ReactNode } from "react";
import {
  useWorkspacePageMeta,
  WorkspaceFilters,
  type WorkspaceAction,
} from "@/components/workspace-shell";

/**
 * Registers page title/actions into the second workspace header
 * and portals filters into that same bar.
 */
export function ReportShell({
  title,
  description,
  children,
  admin = false,
  actions,
  filters,
}: {
  title: string;
  description: string;
  children: ReactNode;
  admin?: boolean;
  actions?: WorkspaceAction[];
  filters?: ReactNode;
}) {
  useWorkspacePageMeta({
    title,
    description,
    actions,
  });

  return (
    <>
      {filters ? <WorkspaceFilters>{filters}</WorkspaceFilters> : null}
      <div className="flex h-full min-h-0 flex-col [&_input]:rounded-[12px] [&_select]:rounded-[12px] [&_textarea]:rounded-[12px] [&_button]:rounded-[12px]">
        {children}
      </div>
    </>
  );
}

/** Portal filter controls into the second header bar. */
export function PageFilters({ children }: { children: ReactNode }) {
  return <WorkspaceFilters>{children}</WorkspaceFilters>;
}
