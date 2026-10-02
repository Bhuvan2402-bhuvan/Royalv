import React from "react";
import { Badge } from "@/components/ui/badge";
import { PropertyWorkflowStatus, UserRole } from "@prisma/client";

interface WorkflowStatusBadgeProps {
  status: PropertyWorkflowStatus;
}

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  switch (status) {
    case "PUBLISHED":
      return <Badge variant="success">Published</Badge>;
    case "APPROVED":
      return <Badge variant="gold">Approved (Ready to Publish)</Badge>;
    case "PENDING_APPROVAL":
      return <Badge variant="warning">Pending Approval</Badge>;
    case "DRAFT":
      return <Badge variant="default">Draft</Badge>;
    case "REJECTED":
      return <Badge variant="danger">Rejected</Badge>;
    case "SOLD":
      return <Badge variant="slate">Sold</Badge>;
    case "UNAVAILABLE":
      return <Badge variant="outline">Unavailable</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}

interface RoleBadgeProps {
  role: UserRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  switch (role) {
    case "SUPER_ADMIN":
      return <Badge variant="gold">Super Admin</Badge>;
    case "ADMIN":
      return <Badge variant="slate">Admin</Badge>;
    case "PROPERTY_MANAGER":
      return <Badge variant="warning">Property Manager</Badge>;
    case "CUSTOMER":
      return <Badge variant="default">Customer</Badge>;
    default:
      return <Badge variant="default">{role}</Badge>;
  }
}
