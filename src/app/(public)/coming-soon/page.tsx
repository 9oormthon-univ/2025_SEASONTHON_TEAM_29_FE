import Image from 'next/image';

export default function ComingSoonPage() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <Image
          src="/lock.png"
          alt="곧 만나요"
          width={158}
          height={218}
          className="w-40 h-56"
        />
        <p className="mt-6 text-2xl font-bold text-text--default">곧 만나요!</p>
        <p className="mt-2 text-sm text-text--default text-center">
          당신의 결혼 준비에 작은 기쁨을 더해드릴게요.
        </p>
      </div>
    </main>
  );
}
