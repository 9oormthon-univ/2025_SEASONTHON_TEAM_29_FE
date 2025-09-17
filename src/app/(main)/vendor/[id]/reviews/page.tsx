// src/app/vendor/[id]/reviews/page.tsx
import VendorReviewsScreen from '@/components/reviews/VendorReviewsScreen';

type Params = { id: string };
export default async function Page({ params }: { params: Promise<Params> }) {
  const p = await params;
  const id = Number(p.id);
  return <VendorReviewsScreen vendorId={id} />;
}