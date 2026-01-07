export function generateStaticParams() {
  return [{ id: [] }];
}

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

