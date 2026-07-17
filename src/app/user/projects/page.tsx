import { Suspense } from "react";
import { UserProjectsList } from "./_components/projects-list";

export default function UserProjectsPage() {
  return (
    <Suspense>
      <UserProjectsList />
    </Suspense>
  );
}
