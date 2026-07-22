import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { UserShell } from "./_components/user-shell";
import { SessionTimeout } from "~/app/_components/session-timeout";

const UserLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "USER") {
    redirect("/login");
  }

  return (
    <UserShell user={session.user}>
      <SessionTimeout />
      {children}
    </UserShell>
  );
}

export default UserLayout;