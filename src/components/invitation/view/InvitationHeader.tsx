// src/components/invitation/InvitationHeader.tsx
'use client';

import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';

type Props = {
  year?: string | number;
  month?: string | number;
  day?: string | number;
  className?: string;
};

export default function InvitationHeader({
  year = 2026,
  month = 5,
  day = 16,
  className,
}: Props) {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const CONTAINER_W = 360;
  const YEAR_FS = 64;
  const DATE_FS = 64;
  const REC_W = 180,
    REC_H = 80;
  const TALK_W = 80,
    TALK_H = 32;
  const TALK_SHIFT_R = 70;
  const GAP_MAIN = 6;
  const DATE_SHIFT_L = 2;

  return (
    <header
      className={clsx('mx-auto', className)}
      aria-label="Invitation Header"
      style={{
        width: CONTAINER_W,
        color: 'var(--color-primary-500)',
        padding: '24px 0',
      }}
    >
      {/* ✅ 세 칸 모두 auto 로 붙이고, columnGap을 작게 */}
      <div
        className="grid items-start"
        style={{ gridTemplateColumns: 'auto auto auto', columnGap: GAP_MAIN }}
      >
        {/* 연도 */}
        <div
          className="shrink-0 leading-none"
          style={{
            fontFamily: 'OG, serif',
            fontSize: YEAR_FS,
            letterSpacing: '0.02em',
          }}
        >
          {year}
        </div>

        {/* REC (고정 px) */}
        <div
          className="flex items-start justify-center"
          style={{ paddingTop: 6 }}
        >
          <SvgObject
            src="/Rec.svg"
            alt="REC"
            width={REC_W}
            height={REC_H}
            className="block"
            style={{ width: REC_W, height: REC_H, display: 'block' }}
          />
        </div>

        {/* 날짜 + 멘트 (날짜를 왼쪽으로 당김) */}
        <div
          className="shrink-0 text-right"
          style={{ transform: `translateX(${DATE_SHIFT_L}px)` }}
        >
          <div
            className="leading-none"
            style={{
              fontFamily: 'OG, serif',
              fontSize: DATE_FS,
              letterSpacing: '0.02em',
            }}
          >
            {mm}.{dd}
          </div>

          {/* 멘트 SVG: 오른쪽으로 밀기 */}
          <div
            style={{
              marginTop: 12,
              transform: `translateX(${TALK_SHIFT_R}px)`,
            }}
          >
            <SvgObject
              src="/invitationTalk.svg"
              alt="forever our love, wedding story"
              width={TALK_W}
              height={TALK_H}
              className="block"
              style={{ width: TALK_W, height: TALK_H, display: 'block' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
