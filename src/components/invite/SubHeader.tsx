// src/components/invite/SubHeader.tsx
'use client';
export default function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 border-t border-gray-200 pt-3 text-[13px] font-medium text-gray-700">
      {children}
    </div>
  );
}