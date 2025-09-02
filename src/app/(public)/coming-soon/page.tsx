import Image from "next/image";

//src/app/(public)/coming-soon/page.tsx
export default function ComingSoonPage() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <Image
          src="/lock.png"
          alt="준비중"
          className="h-40 w-auto"
        />
        <p className="mt-6 text-lg font-semibold text-gray-700">준비중입니다!</p>
        <p className="mt-2 text-sm text-gray-500">
          더 나은 서비스로 곧 찾아올게요.
        </p>
      </div>
    </main>
  );
}