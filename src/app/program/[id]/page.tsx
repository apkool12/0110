import ProgramDetailClient from "./ProgramDetailClient";

export async function generateStaticParams() {
  return [];
}

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProgramDetailClient params={params} />;
}
