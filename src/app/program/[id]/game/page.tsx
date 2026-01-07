import GamePageClient from './GamePageClient';

export function generateStaticParams() {
  return [];
}

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <GamePageClient params={params} />;
}
