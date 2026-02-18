import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { DivisionClerkDashboard } from "./_components/division-clerk-dashboard";

export default async function DivisionClerkPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "DIVISION_CLERK") {
    redirect("/login");
  }

  return <DivisionClerkDashboard user={session.user} />;
}
