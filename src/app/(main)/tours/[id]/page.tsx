// 서버 컴포넌트 (use client 없음)
import DressFittingClient from './page.client';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DressFittingClient id={id} />;
}