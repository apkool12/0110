import { Suspense } from "react";
import SettingsPageClient from "./SettingsPageClient";

export async function generateStaticParams() {
  // Return a dummy path to satisfy static export requirements
  // Actual routing is handled client-side
  return [{ id: 'dummy' }];
}

export default function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPageClient params={params} />
    </Suspense>
  );
}
