import ProgramDetailClient from "./ProgramDetailClient";

export async function generateStaticParams() {
  // Return a dummy path to satisfy static export requirements
  // Actual routing is handled client-side
  return [{ id: 'dummy' }];
}

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProgramDetailClient params={params} />;
}
