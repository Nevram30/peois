import { ProjectDetail } from "../_components/project-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectViewPage({ params }: Props) {
  const { id } = await params;
  return <ProjectDetail projectId={id} />;
}
