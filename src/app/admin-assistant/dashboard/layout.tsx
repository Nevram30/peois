import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { AdminAssistantShell } from "./_components/admin-assistant-shell";

export default async function AdminAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN_ASSISTANT") {
    redirect("/login");
  }

  return <AdminAssistantShell user={session.user}>{children}</AdminAssistantShell>;
}
