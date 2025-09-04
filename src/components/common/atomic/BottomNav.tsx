'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SvgObject from './SvgObject';

type NavItem = {
  href: string;
  iconBase: 'Home' | 'Calendar' | 'Review' | 'People';
  label: string;
};

const items: NavItem[] = [
  { href: '/home', iconBase: 'Home', label: '홈' },
  { href: '/calendar', iconBase: 'Calendar', label: '캘린더' },
  { href: '/tours', iconBase: 'Review', label: '투어일지' },
  { href: '/mypage', iconBase: 'People', label: '마이' },
];

export type BottomNavProps = {
  pathname?: string;
  showLabels?: boolean;
  className?: string;
  innerMax?: string;
};
export default function BottomNav({
  pathname: forcedPathname,
  className,
  innerMax = 'max-w-screen-sm',
}: BottomNavProps) {
  const systemPathname = usePathname() ?? '';
  const cur = (forcedPathname ?? systemPathname) || '';
  const isActive = (href: string) => cur === href || cur.startsWith(href + '/');

  return (
    <nav
      aria-label="하단 내비게이션"
      className={clsx(
        'fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full',
        'border-t border-gray-200/70 dark:border-white/10',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <ul
        className={clsx('mx-auto grid grid-cols-4 gap-1 px-4 py-2', innerMax)}
      >
        {items.map(({ href, iconBase, label }) => {
          const active = isActive(href);
          const src = active
            ? `/icons/FullNav/Full${iconBase}.svg`
            : `/icons/LineNav/Line${iconBase}.svg`;

          return (
            <li key={href} className="text-center">
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'group flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60',
                )}
              >
                <SvgObject
                  src={src}
                  alt=""
                  width={26}
                  height={26}
                  className={clsx(
                    'h-7 w-7 select-none',
                    !active && 'opacity-90 group-hover:opacity-100',
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}