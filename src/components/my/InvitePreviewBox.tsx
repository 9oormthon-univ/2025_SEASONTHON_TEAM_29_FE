'use client';

import Image from 'next/image';
import clsx from 'clsx';

export default function InvitePreviewBox({
  imageUrl,
  className,
}: {
  imageUrl?: string | null;
  className?: string;
}) {
  return (
    <div className={clsx('relative w-40 h-52 rounded-lg', className)}>
      <div className="absolute left-0 top-0 w-40 h-52 bg-white rounded-lg shadow-[1px_4px_7.099999904632568px_1px_rgba(0,0,0,0.07)]" />
      <div className="absolute left-[8px] top-[10px] w-36 h-48 rounded-lg border-[0.50px] border-text-tertiary overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="invitation main"
            fill
            sizes="160px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
    </div>
  );
}
