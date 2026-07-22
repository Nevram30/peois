import { EditProjectForm } from "./edit/_components/edit-project-form";

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectEditPage = async ({ params }: Props) => {
  const { id } = await params;
  return <EditProjectForm projectId={id} />;
}

export default ProjectEditPage;