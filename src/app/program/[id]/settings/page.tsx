import SettingsPageClient from "./SettingsPageClient";

export function generateStaticParams() {
  return [];
}

export default function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <SettingsPageClient params={params} />;
}
