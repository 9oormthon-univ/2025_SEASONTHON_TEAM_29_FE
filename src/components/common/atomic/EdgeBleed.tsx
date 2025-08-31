// src/components/common/EdgeBleed.tsx
export default function EdgeBleed({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}