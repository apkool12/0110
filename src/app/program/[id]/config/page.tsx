import ConfigPageClient from "./ConfigPageClient";

export async function generateStaticParams() {
  // Return a dummy path to satisfy static export requirements
  // Actual routing is handled client-side
  return [{ id: "dummy" }];
}

export default function ConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ConfigPageClient params={params} />;
}
