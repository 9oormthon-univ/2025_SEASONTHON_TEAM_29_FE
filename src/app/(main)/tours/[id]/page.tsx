// src/app/(main)/tours/[id]/page.tsx
import DressFittingClient from './DressFittingClient';

export default function Page({ params }: { params: { id: string } }) {
  return <DressFittingClient id={params.id} />;
}