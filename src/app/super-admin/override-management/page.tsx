import { redirect } from "next/navigation";

export default function OverrideManagementPage() {
  redirect("/super-admin/projects-data-list");
}
