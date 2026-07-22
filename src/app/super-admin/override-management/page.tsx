import { redirect } from "next/navigation";

const OverrideManagementPage = () => {
  redirect("/super-admin/projects-data-list");
}

export default OverrideManagementPage;