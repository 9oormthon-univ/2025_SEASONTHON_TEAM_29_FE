// src/app/(main)/tours/[id]/page.tsx
import DressFittingClient from './DressFittingClient';

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params; // ✅ Promise 해제
  return <DressFittingClient id={id} />;
}