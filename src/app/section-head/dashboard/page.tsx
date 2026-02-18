import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { SectionHeadDashboard } from "./_components/section-head-dashboard";

export default async function SectionHeadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SECTION_HEAD") {
    redirect("/login");
  }

  return <SectionHeadDashboard user={session.user} />;
}
