import { OverrideForm } from "./_components/override-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OverrideProjectPage({ params }: Props) {
  const { id } = await params;
  return <OverrideForm projectId={id} />;
}
