// src/app/(main)/tours/[id]/page.tsx
type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;   // ✅ Promise 해제
  return <main>투어 {id}</main>;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  return { title: `투어 ${id}` };
}