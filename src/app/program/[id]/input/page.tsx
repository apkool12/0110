import InputPageClient from "./InputPageClient";

export function generateStaticParams() {
  return [];
}

export default function InputPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <InputPageClient params={params} />;
}
