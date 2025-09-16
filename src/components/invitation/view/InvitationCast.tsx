'use client';

import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';

type Props = {
  groomName: string;
  brideName: string;
  groomFatherName: string;
  groomMotherName: string;
  brideFatherName: string;
  brideMotherName: string;
  className?: string;
};

export default function InvitationCast({
  groomName,
  brideName,
  groomFatherName,
  groomMotherName,
  brideFatherName,
  brideMotherName,
  className,
}: Props) {
  const groomLine = `${groomFatherName} | ${groomMotherName}의 아들`;
  const brideLine = `${brideFatherName} | ${brideMotherName}의 딸`;

  return (
    <section
      className={clsx('mx-auto w-[90%] max-w-[760px]', className)}
      aria-label="Invitation Cast"
    >
      <div className="flex items-center justify-center mb-12">
        <SvgObject
          src="/Cast.svg"
          alt="Cast"
          width={70}
          height={72}
          className="block h-auto w-[120px] select-none"
        />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-8">
        <div className="text-center">
          <p
            className="text-sm leading-tight text-primary-200 whitespace-nowrap"
            style={{ fontFamily: 'DI, serif' }}
          >
            {groomLine}
          </p>
          <div
            className="mt-6 text-3xl leading-snug text-[#FAFAFA]"
            style={{ fontFamily: 'DI, serif' }}
          >
            {groomName}
          </div>
        </div>
        <div className="text-center">
          <p
            className="text-sm leading-tight text-primary-200 whitespace-nowrap"
            style={{ fontFamily: 'DI, serif' }}
          >
            {brideLine}
          </p>
          <div
            className="mt-6 text-3xl leading-snug text-[#FAFAFA]"
            style={{ fontFamily: 'DI, serif' }}
          >
            {brideName}
          </div>
        </div>
      </div>
    </section>
  );
}
