import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { NavHeader } from "./_components/nav-header";

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
      <NavHeader user={session.user} />
      <div className="px-6 pb-6">
        {children}
      </div>
    </main>
  );
}
