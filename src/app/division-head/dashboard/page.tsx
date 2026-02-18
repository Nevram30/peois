import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { DivisionHeadDashboard } from "./_components/division-head-dashboard";

export default async function DivisionHeadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "DIVISION_HEAD") {
    redirect("/login");
  }

  return <DivisionHeadDashboard user={session.user} />;
}
