import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { AdminAssistantDashboard } from "./_components/admin-assistant-dashboard";

export default async function AdminAssistantPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN_ASSISTANT") {
    redirect("/login");
  }

  return <AdminAssistantDashboard user={session.user} />;
}
