import { UserProjectDetail } from "./_components/project-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserProjectViewPage({ params }: Props) {
  const { id } = await params;
  return <UserProjectDetail projectId={id} />;
}
