import { ProjectDetail } from "../_components/project-detail";

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectViewPage = async ({ params }: Props) => {
  const { id } = await params;
  return <ProjectDetail projectId={id} />;
}

export default ProjectViewPage;