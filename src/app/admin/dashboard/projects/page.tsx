import { Suspense } from "react";
import { ProjectsList } from "./_components/projects-list";

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 " />
        <div className="p-8 text-center text-gray-500">Loading...</div>
      </>
    }>
      <ProjectsList />
    </Suspense>
  );
}
