import { UserProjectDetail } from "./_components/project-detail";

interface Props {
  params: Promise<{ id: string }>;
}

const UserProjectViewPage = async ({ params }: Props) => {
  const { id } = await params;
  return <UserProjectDetail projectId={id} />;
}

export default UserProjectViewPage;