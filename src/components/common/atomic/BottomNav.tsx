'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SvgObject from './SvgObject';

type NavItem = {
  href: string;
  iconBase: 'Home' | 'Calendar' | 'Review' | 'People' | 'Todo';
  label: string;
};

const items: NavItem[] = [
  { href: '/home', iconBase: 'Home', label: '홈' },
  { href: '/calendar', iconBase: 'Calendar', label: '캘린더' },
  { href: '/todo', iconBase: 'Todo', label: '할 일' },
  { href: '/tours', iconBase: 'Review', label: '투어일지' },
  { href: '/mypage', iconBase: 'People', label: '마이' },
];

export type BottomNavProps = {
  pathname?: string;
  showLabels?: boolean;
  className?: string;
  innerMax?: string;
};
function iconSize(icon: NavItem['iconBase']) {
  switch (icon) {
    case 'Home':
      return { w: 26, h: 26 };
    case 'Calendar':
      return { w: 26, h: 28 };
    case 'Review':
      return { w: 31, h: 31 };
    case 'People':
      return { w: 22, h: 28 };
    case 'Todo':
      return { w: 29, h: 29 };
  }
}
const FRAME_CLS = 'size-8';
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
        'h-[75px] fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full',
        'border-t border-gray-200/70 dark:border-white/10',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <ul
        className={clsx(
          'mx-auto grid grid-cols-5 h-full place-items-center gap-1 px-3',
          innerMax,
        )}
      >
        {items.map(({ href, iconBase, label }) => {
          const active = isActive(href);
          const { w, h } = iconSize(iconBase);
          const src = active
            ? `/icons/FullNav/Full${iconBase}.svg`
            : `/icons/LineNav/Line${iconBase}.svg`;

          const raised = href === '/tours';

          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'group flex items-center justify-center rounded-lg transition-transform',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60',
                  raised && '-translate-y-[4px] translate-x-1 ',
                )}
              >
                <div
                  className={clsx(
                    'flex items-center justify-center shrink-0',
                    FRAME_CLS,
                  )}
                >
                  <SvgObject
                    src={src}
                    alt=""
                    width={w}
                    height={h}
                    className={clsx(
                      'block max-w-full max-h-full align-middle select-none',
                      !active && 'opacity-90 group-hover:opacity-100',
                    )}
                    style={{ width: w, height: h }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
