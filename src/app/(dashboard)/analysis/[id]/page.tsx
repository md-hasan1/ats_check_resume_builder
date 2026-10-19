import { redirect } from "next/navigation";

export default async function LegacyAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/ats-checker/${id}`);
}
