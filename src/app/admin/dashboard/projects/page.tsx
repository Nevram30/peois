import { Suspense } from "react";
import { ProjectsList } from "./_components/projects-list";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <ProjectsList />
    </Suspense>
  );
}
