import { Suspense } from "react";
import { UserProjectsList } from "./_components/projects-list";

const UserProjectsPage = () => {
  return (
    <Suspense>
      <UserProjectsList />
    </Suspense>
  );
}

export default UserProjectsPage;