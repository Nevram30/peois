import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { NavHeader } from "./_components/nav-header";
import { SessionTimeout } from "~/app/_components/session-timeout";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <SessionTimeout />
      <NavHeader user={session.user} userId={session.user.id}>
        {children}
      </NavHeader>
    </main>
  );
}
