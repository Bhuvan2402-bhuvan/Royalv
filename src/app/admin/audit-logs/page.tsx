import { Metadata } from "next";
import Link from "next/link";
import { getAdminAuditLogs } from "@/lib/queries/admin";
import { formatDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Audit Logs",
  description: "View system audit logs and team activity history.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminAuditLogsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminAuditLogsPage({ searchParams }: AdminAuditLogsPageProps) {
  const resolvedSearchParams = await searchParams;
  const action = typeof resolvedSearchParams.action === "string" ? resolvedSearchParams.action : undefined;
  const entity = typeof resolvedSearchParams.entity === "string" ? resolvedSearchParams.entity : undefined;
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;

  const { logs, total, totalPages } = await getAdminAuditLogs({
    action,
    entity,
    page,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-5 w-5 text-emerald-800" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Audit Logs & Traceability ({total})
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Immutable timeline of all operational mutations across properties, leads, approvals, and user accounts.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No audit logs found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              System actions will automatically be recorded here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Details / Metadata</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                        {log.action}
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-700">
                        {log.entity} {log.entityId ? `(#${log.entityId.substring(0, 6)})` : ""}
                      </span>
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.user ? (
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{log.user.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{log.user.role}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">System / Unauthenticated</span>
                      )}
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 max-w-md">
                      {log.details ? (
                        <pre className="font-mono text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 overflow-x-auto max-h-16">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right text-slate-400 text-[11px]">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">
              Page {page} of {totalPages} ({total} logs)
            </span>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/audit-logs?${new URLSearchParams({
                    ...(action ? { action } : {}),
                    ...(entity ? { entity } : {}),
                    page: String(page - 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Button>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/audit-logs?${new URLSearchParams({
                    ...(action ? { action } : {}),
                    ...(entity ? { entity } : {}),
                    page: String(page + 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
