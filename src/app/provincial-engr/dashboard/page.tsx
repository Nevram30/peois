import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { ProvincialEngrDashboard } from "./_components/provincial-engr-dashboard";

export default async function ProvincialEngrPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "PROVINCIAL_ENGR") {
    redirect("/login");
  }

  return <ProvincialEngrDashboard user={session.user} />;
}
