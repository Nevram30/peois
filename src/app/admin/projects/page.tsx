import { Suspense } from "react";
import ProjectsList from "./_components/projects-list";

const ProjectsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    }>
      <ProjectsList />
    </Suspense>
  );
}

export default ProjectsPage;