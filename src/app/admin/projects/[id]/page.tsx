import { EditProjectForm } from "./edit/_components/edit-project-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectEditPage({ params }: Props) {
  const { id } = await params;
  return <EditProjectForm projectId={id} />;
}
