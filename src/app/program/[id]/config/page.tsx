import ConfigPageClient from "./ConfigPageClient";

export function generateStaticParams() {
  return [];
}

export default function ConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ConfigPageClient params={params} />;
}
