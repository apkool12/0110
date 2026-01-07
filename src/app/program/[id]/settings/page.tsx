import SettingsPageClient from "./SettingsPageClient";

export async function generateStaticParams() {
  return [];
}

export default function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <SettingsPageClient params={params} />;
}
