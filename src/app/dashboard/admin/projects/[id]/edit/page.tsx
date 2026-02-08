import { EditProjectForm } from "./_components/edit-project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProjectForm projectId={id} />;
}
