import GamePageClient from "./GamePageClient";

export async function generateStaticParams() {
  return [];
}

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <GamePageClient params={params} />;
}
