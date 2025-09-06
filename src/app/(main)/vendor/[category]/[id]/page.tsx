import VendorDetailScreen from '@/components/vendor/VendorDetailScreen';
import { getVendorDetail } from '@/services/vendor.api';

type Params = { category: string; id: string };

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<Params>; // ✅ Next 15: Promise 타입
}) {
  const p = await params;            // ✅ 먼저 await
  const id = Number(p.id);

  if (!Number.isFinite(id)) {
    return (
      <main className="mx-auto w-full max-w-[420px] h-dvh grid place-items-center">
        <div className="text-sm text-gray-500">잘못된 업체 ID 입니다.</div>
      </main>
    );
  }

  try {
    const vendor = await getVendorDetail(id);
    return <VendorDetailScreen vendor={vendor} />;
  } catch {
    return (
      <main className="mx-auto w-full max-w-[420px] h-dvh grid place-items-center">
        <div className="text-sm text-gray-500">업체를 찾을 수 없습니다.</div>
      </main>
    );
  }
}