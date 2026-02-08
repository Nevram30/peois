import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { SuperAdminDashboard } from "./_components/super-admin-dashboard";

export default async function SuperAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return <SuperAdminDashboard user={session.user} />;
}
