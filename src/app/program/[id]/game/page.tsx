import GamePageClient from "./GamePageClient";

export async function generateStaticParams() {
  // Return a dummy path to satisfy static export requirements
  // Actual routing is handled client-side
  return [{ id: 'dummy' }];
}

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <GamePageClient params={params} />;
}
