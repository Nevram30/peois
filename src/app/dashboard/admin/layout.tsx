import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { AdminShell } from "./_components/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
