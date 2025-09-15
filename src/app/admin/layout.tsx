'use client';

import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-48 border-r bg-gray-50 p-4">
        <h2 className="mb-4 text-lg font-bold">Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/vendor">Vendor</Link>
          <Link href="/admin/product">Product</Link>
          <Link href="/admin/consultation-slots">상담 가능 시간 추가</Link>
          <Link href="/admin/contract-slots">계약 가능 시간 추가</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}