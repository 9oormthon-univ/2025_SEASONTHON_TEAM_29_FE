// components/tours/TourItem.tsx
import Image from 'next/image';

type Props = {
  name: string;
  logo: string;
  status: '기록 대기' | '기록 완료';
};

export default function TourItem({ name, logo, status }: Props) {
  const statusClass =
    status === '기록 대기'
      ? 'bg-pink-100 text-pink-600'
      : 'bg-gray-100 text-gray-400';

  return (
    <li className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-3">
        <Image src={logo} alt={name} width={40} height={40} className="rounded-md" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
        {status}
      </span>
    </li>
  );
}