import ProgramDetailClient from "./ProgramDetailClient";

export function generateStaticParams() {
  return [];
}

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProgramDetailClient params={params} />;
}
