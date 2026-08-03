import { Suspense } from "react";
import ProjectsList from "./_components/projects-list";
import { HardHat } from "lucide-react";

const ProjectsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="relative h-12 w-12">
          <svg className="h-12 w-12 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <HardHat className="absolute inset-0 m-auto h-6 w-6 text-amber-600" />
        </div>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    }>
      <ProjectsList />
    </Suspense>
  );
}

export default ProjectsPage;