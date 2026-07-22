import { EditProjectForm } from "./_components/edit-project-form";

const EditProjectPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <EditProjectForm projectId={id} />;
}

export default EditProjectPage;