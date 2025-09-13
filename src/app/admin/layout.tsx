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
          {/* 필요한 도메인 추가 */}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}