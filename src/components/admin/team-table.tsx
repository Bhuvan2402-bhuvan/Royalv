"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTeamMemberAction, updateTeamMemberRoleAction, deleteTeamMemberAction } from "@/lib/actions/admin";
import { sendStaffPasswordResetAction } from "@/lib/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils/formatters";
import {
  Users,
  Plus,
  Phone,
  Mail,
  Edit,
  Loader2,
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { UserRole, UserStatus } from "@prisma/client";

export interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  _count: {
    assignedProperties: number;
    assignedEnquiries: number;
  };
}

interface TeamTableProps {
  team: AdminTeamMember[];
  canManageUsers: boolean;
}

export function TeamTable({ team, canManageUsers }: TeamTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMember, setEditMember] = useState<AdminTeamMember | null>(null);
  const [deleteMember, setDeleteMember] = useState<AdminTeamMember | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [generatedResetLink, setGeneratedResetLink] = useState<{ name: string; url: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Member Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.FIELD_AGENT);

  // Edit Member State
  const [editRole, setEditRole] = useState<UserRole>(UserRole.FIELD_AGENT);
  const [editStatus, setEditStatus] = useState<UserStatus>(UserStatus.ACTIVE);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const res = await createTeamMemberAction({
        name,
        email,
        phone,
        password,
        role,
      });

      if (res.success) {
        setShowAddModal(false);
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setSuccessMsg(res.message || "Team member created successfully.");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to create team member.");
      }
    });
  };

  const handleUpdateRole = () => {
    if (!editMember) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const res = await updateTeamMemberRoleAction(editMember.id, {
        role: editRole,
        status: editStatus,
      });

      if (res.success) {
        setEditMember(null);
        setSuccessMsg(res.message || "Team member updated successfully.");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to update member.");
      }
    });
  };

  const handleDelete = () => {
    if (!deleteMember) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const res = await deleteTeamMemberAction(deleteMember.id);
      if (res.success) {
        setDeleteMember(null);
        setSuccessMsg(res.message || `Team member ${deleteMember.name} deleted successfully.`);
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to delete team member.");
      }
    });
  };

  const handleSendPasswordReset = (member: AdminTeamMember) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGeneratedResetLink(null);
    startTransition(async () => {
      const res = await sendStaffPasswordResetAction(member.id);
      if (res.success) {
        setSuccessMsg(res.message || `Password reset link generated for ${member.name}.`);
        if (res.data?.resetLink) {
          setGeneratedResetLink({ name: member.name, url: res.data.resetLink });
        }
      } else {
        setErrorMsg(res.message || "Failed to initiate password reset.");
      }
    });
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const roleColors: Record<string, "gold" | "success" | "info" | "default"> = {
    SUPER_ADMIN: "gold",
    ADMIN: "gold",
    PROPERTY_MANAGER: "info",
    FIELD_AGENT: "success",
    CUSTOMER: "default",
  };

  const getRoleDisplayName = (userRole: UserRole) => {
    switch (userRole) {
      case UserRole.SUPER_ADMIN:
        return "Executive Admin (Royal V)";
      case UserRole.ADMIN:
        return "Operations Admin";
      case UserRole.PROPERTY_MANAGER:
        return "Property Manager";
      case UserRole.FIELD_AGENT:
        return "Field Agent";
      default:
        return "Customer";
    }
  };

  return (
    <>
      {/* Success Notification Banner */}
      {successMsg && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 p-1">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Generated Password Reset Link Card */}
      {generatedResetLink && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-xs text-amber-900 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-amber-700" />
              <span className="font-bold text-slate-900">
                Password Reset Link for {generatedResetLink.name}
              </span>
            </div>
            <button onClick={() => setGeneratedResetLink(null)} className="text-amber-700 hover:text-amber-900 p-1">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600">
            Copy and securely share this single-use recovery link with the staff member (valid for 24 hours):
          </p>
          <div className="flex items-center gap-2 bg-white border border-amber-300 rounded-lg p-2 font-mono text-[11px] text-slate-800 break-all">
            <span className="flex-1">{typeof window !== "undefined" ? `${window.location.origin}${generatedResetLink.url}` : generatedResetLink.url}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(generatedResetLink.url)}
              className="shrink-0 h-7 text-[10px] gap-1 font-sans"
            >
              {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              {copiedLink ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-700 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-700 hover:text-rose-900 p-1">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pb-4">
        <p className="text-xs text-slate-500 font-medium">
          Operational users with administrative, property management, or field agent privileges.
        </p>
        {canManageUsers && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setErrorMsg(null);
              setShowAddModal(true);
            }}
            className="gap-1.5 text-xs shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Staff Member
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Role & Designation</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4">Assigned Workload</th>
              <th className="py-3 px-4">Joined Date</th>
              {canManageUsers && <th className="py-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Member Name */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{member.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">ID: {member.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="space-y-0.5 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3 text-blue-600" />
                      <span>{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-emerald-600" />
                        <span className="font-mono">{member.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Role */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="space-y-0.5">
                    <Badge variant={roleColors[member.role] || "default"} className="text-[10px]">
                      {member.role.replace(/_/g, " ")}
                    </Badge>
                    <p className="text-[10px] text-slate-500 font-medium">{getRoleDisplayName(member.role)}</p>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge
                    variant={member.status === "ACTIVE" ? "success" : "danger"}
                    className="text-[10px]"
                  >
                    {member.status}
                  </Badge>
                </td>

                {/* Workload */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {member._count.assignedProperties} props
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {member._count.assignedEnquiries} leads
                    </span>
                  </div>
                </td>

                {/* Created */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                  {formatDate(member.createdAt)}
                </td>

                {/* Actions */}
                {canManageUsers && (
                  <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendPasswordReset(member)}
                      disabled={isPending}
                      className="h-7 text-[11px] px-2 text-slate-600 hover:text-amber-800"
                      title="Send secure password reset link"
                    >
                      <KeyRound className="h-3 w-3 mr-1 text-amber-600" />
                      Reset Pass
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setErrorMsg(null);
                        setEditMember(member);
                        setEditRole(member.role);
                        setEditStatus(member.status);
                      }}
                      className="h-7 text-[11px] px-2.5"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Role
                    </Button>
                    {member.role !== UserRole.SUPER_ADMIN && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setErrorMsg(null);
                          setDeleteMember(member);
                        }}
                        className="h-7 text-[11px] px-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border-rose-200"
                        title="Delete staff account"
                      >
                        <Trash2 className="h-3 w-3 mr-1 text-rose-600" />
                        Delete
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">Add Operational Staff</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Babu"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@royalvproperties.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9848012345"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password *</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  <option value={UserRole.FIELD_AGENT}>Field Agent (Field Work, Site Visits & Direct Publishing)</option>
                  <option value={UserRole.PROPERTY_MANAGER}>Property Manager (Inventory, Approvals & Publishing)</option>
                  <option value={UserRole.ADMIN}>Operations Admin (Office Operations, Leads & Team)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  disabled={isPending}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isPending}
                  className="text-xs gap-1.5 font-bold shadow-sm"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create Staff Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Role & Status: {editMember.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{editMember.email}</p>
              </div>
              <button
                onClick={() => setEditMember(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">User Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  <option value={UserRole.FIELD_AGENT}>Field Agent</option>
                  <option value={UserRole.PROPERTY_MANAGER}>Property Manager</option>
                  <option value={UserRole.ADMIN}>Operations Admin</option>
                  <option value={UserRole.SUPER_ADMIN}>Executive Admin (Super Admin)</option>
                  <option value={UserRole.CUSTOMER}>Demote to Customer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as UserStatus)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  <option value={UserStatus.ACTIVE}>Active</option>
                  <option value={UserStatus.INACTIVE}>Inactive</option>
                  <option value={UserStatus.SUSPENDED}>Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMember(null)}
                  disabled={isPending}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleUpdateRole}
                  disabled={isPending}
                  className="text-xs gap-1.5 font-bold shadow-sm"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Staff Member Confirmation Modal */}
      {deleteMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-700">
                <Trash2 className="h-5 w-5" />
                <h3 className="text-base font-bold text-slate-900">Delete Staff Account</h3>
              </div>
              <button
                onClick={() => setDeleteMember(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Are you sure you want to permanently delete the staff account for:
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="font-bold text-slate-900 text-sm">{deleteMember.name}</p>
                <p className="text-slate-500 font-mono text-[11px]">{deleteMember.email}</p>
                <p className="text-emerald-800 font-semibold text-[11px] mt-1">Role: {deleteMember.role.replace(/_/g, " ")}</p>
              </div>
              <p className="text-rose-700 font-medium">
                Warning: This action cannot be undone. All currently assigned properties, leads, and review queues will be safely unassigned.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteMember(null)}
                disabled={isPending}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs gap-1.5 font-bold shadow-sm bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Permanently Delete Staff
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
