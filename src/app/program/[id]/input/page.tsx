import InputPageClient from "./InputPageClient";

export async function generateStaticParams() {
  // Return a dummy path to satisfy static export requirements
  // Actual routing is handled client-side
  return [
    { id: "dummy" },
  ];
}

export default function InputPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <InputPageClient params={params} />;
}
