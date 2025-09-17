'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

type Mode = 'color' | 'photo';

type Props = {
  imageUrl?: string | null;
  dayText?: string;
  dateText?: string;
  timeText?: string;
  placeLine1?: string;
  placeLine2?: string;
  defaultMode?: Mode;
  disableToggle?: boolean;
  className?: string;
};

export default function TicketImage({
  imageUrl,
  dayText = 'SAT',
  dateText = '2026.05.16',
  timeText = 'P.M. 1:30',
  placeLine1 = '서울 강남구 테헤란로 322',
  placeLine2 = '아펠가모 선릉홀 4층',
  defaultMode,
  disableToggle,
  className,
}: Props) {
  const hasPhoto = useMemo(() => Boolean(imageUrl), [imageUrl]);
  const isExternal = useMemo(
    () => !!imageUrl && /^https?:\/\//i.test(imageUrl),
    [imageUrl],
  );
  const [mode, setMode] = useState<Mode>(
    defaultMode ?? (hasPhoto ? 'photo' : 'color'),
  );

  useEffect(() => {
    if (!hasPhoto) setMode('color');
    else if (defaultMode) setMode(defaultMode);
  }, [hasPhoto, defaultMode]);

  const toggleMode = () => {
    if (disableToggle || !hasPhoto) return;
    setMode((m) => (m === 'color' ? 'photo' : 'color'));
  };

  return (
    <div
      className={clsx(
        'relative mx-auto w-45 md:w-80 aspect-[185/370] select-none',
        className,
      )}
      onClick={!disableToggle && hasPhoto ? toggleMode : undefined}
      aria-label="티켓 보기 전환"
    >
      <div style={{ perspective: '1200px' }} className="absolute inset-0">
        <div
          className="h-full w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: mode === 'photo' ? 'rotateY(180deg)' : 'rotateY(0deg)',
            willChange: 'transform',
          }}
        >
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <Image
              src="/ticketColor.svg"
              alt="ticket color"
              fill
              priority
              className="object-contain"
              sizes="(max-width:768px) 45vw, 80vw"
            />
            <svg
              viewBox="0 0 185 370"
              className="absolute inset-0 block h-full w-full"
            >
              <text
                x="50%"
                y="130"
                textAnchor="middle"
                fontFamily="OG, serif"
                fontSize="36"
                fill="#FFFFFF"
                style={{ letterSpacing: '0.04em' }}
              >
                {dayText}
              </text>
              <text
                x="50%"
                y="160"
                textAnchor="middle"
                fontFamily="OG, serif"
                fontSize={23}
                fill="#FFFFFF"
                style={{ letterSpacing: '0.08em' }}
              >
                {dateText}
              </text>
              <text
                x="50%"
                y="190"
                textAnchor="middle"
                fontFamily="OG, serif"
                fontSize="23"
                fill="#FFFFFF"
                style={{ letterSpacing: '0.08em' }}
              >
                {timeText}
              </text>
              <foreignObject
                x="53"
                y="278"
                width="141"
                height="60"
                pointerEvents="none"
              >
                <div
                  style={{
                    width: 121,
                    fontFamily: 'di, serif',
                    fontSize: 9,
                    lineHeight: 1.5,
                    letterSpacing: '.02em',
                    color: '#fff',
                    textAlign: 'left',
                    whiteSpace: 'normal',
                    wordBreak: 'keep-all',
                  }}
                >
                  <div>{placeLine1}</div>
                  <div>{placeLine2}</div>
                </div>
              </foreignObject>
            </svg>
          </div>
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <svg
              viewBox="0 0 185 370"
              className="block h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <clipPath id="ticketClip">
                  <path d="M32.4336 0C32.4336 3.467 35.2439 6.27734 38.7109 6.27734C42.1779 6.27728 44.9883 3.46696 44.9883 0H52.3125C52.3125 3.46688 55.123 6.27716 58.5898 6.27734C61.9485 6.27734 64.6912 3.64011 64.8594 0.323242L64.8682 0H72.1924C72.1924 3.467 75.0027 6.27734 78.4697 6.27734C81.9367 6.27725 84.7471 3.46694 84.7471 0H92.0713C92.0713 3.4669 94.8818 6.27719 98.3486 6.27734C101.707 6.27734 104.45 3.64011 104.618 0.323242L104.627 0H111.948C111.948 3.46685 114.759 6.2771 118.226 6.27734C121.584 6.27734 124.327 3.64011 124.495 0.323242L124.504 0H131.828C131.828 3.467 134.638 6.27734 138.105 6.27734C141.572 6.27731 144.383 3.46698 144.383 0H151.707C151.707 3.46686 154.518 6.27712 157.984 6.27734C161.343 6.27734 164.086 3.64011 164.254 0.323242L164.263 0H168.448C168.448 9.11504 175.305 16.6272 184.142 17.6631V351.666C175.305 352.702 168.448 360.215 168.448 369.33H164.263C164.263 365.863 161.451 363.053 157.984 363.053C154.518 363.053 151.707 365.863 151.707 369.33H144.383C144.383 365.863 141.572 363.053 138.105 363.053C134.638 363.053 131.828 365.863 131.828 369.33H124.504C124.504 365.863 121.693 363.053 118.226 363.053C114.759 363.053 111.948 365.863 111.948 369.33H104.627C104.627 365.863 101.816 363.053 98.3486 363.053C94.8818 363.053 92.0713 365.863 92.0713 369.33H84.7471C84.7471 365.863 81.9367 363.053 78.4697 363.053C75.0027 363.053 72.1924 365.863 72.1924 369.33H64.8682C64.8682 365.863 62.0568 363.053 58.5898 363.053C55.123 363.053 52.3125 365.863 52.3125 369.33H44.9883C44.9883 365.863 42.1779 363.053 38.7109 363.053C35.2439 363.053 32.4336 365.863 32.4336 369.33H19.8779C19.8779 359.507 11.9149 351.543 2.0918 351.543C1.38414 351.543 0.686072 351.586 0 351.666V17.6631C0.686103 17.7435 1.38411 17.7861 2.0918 17.7861C11.9149 17.786 19.8779 9.82311 19.8779 0H32.4336Z" />
                </clipPath>
              </defs>

              <g clipPath="url(#ticketClip)">
                {hasPhoto ? (
                  isExternal ? (
                    <foreignObject x="0" y="0" width="185" height="370">
                      <div
                        style={{
                          width: '185px',
                          height: '370px',
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    </foreignObject>
                  ) : (
                    <image
                      href={imageUrl as string}
                      x="0"
                      y="0"
                      width="185"
                      height="370"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  )
                ) : (
                  <rect
                    x="0"
                    y="0"
                    width="185"
                    height="370"
                    fill="#000"
                    opacity="0.35"
                  />
                )}
                <image
                  href="/TicketLogo.svg"
                  x="6"
                  y="34"
                  width="22"
                  height="90"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ pointerEvents: 'none', opacity: 1 }}
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
