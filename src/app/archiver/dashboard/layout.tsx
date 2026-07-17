import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { ArchiverShell } from "./_components/archiver-shell";
import { SessionTimeout } from "~/app/_components/session-timeout";

export default async function ArchiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ARCHIVER") {
    redirect("/login");
  }

  return (
    <ArchiverShell user={session.user}>
      <SessionTimeout />
      {children}
    </ArchiverShell>
  );
}
