import { EditDocumentForm } from "./_components/edit-document-form";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditDocumentForm documentId={id} />;
}
