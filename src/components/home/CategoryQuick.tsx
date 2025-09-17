import { CategoryItem } from '@/types/category';
import { cn } from '@/utills/cn';
import SvgObject from '../common/atomic/SvgObject';

const DEFAULT_BOX = 40;

function fitToBox(
  size?: { w?: number; h?: number },
  box: number = DEFAULT_BOX,
) {
  const w = size?.w ?? 28;
  const h = size?.h ?? 28;
  const s = Math.min(box / w, box / h);
  return { w: Math.round(w * s), h: Math.round(h * s) };
}

export default function CategoryQuick({
  items,
  bgColor = 'gray',
}: {
  items: CategoryItem[];
  bgColor?: 'gray' | 'white';
}) {
  return (
    <div
      className={cn(
        'mt-5 grid grid-cols-4 gap-2 rounded-xl',
        bgColor === 'gray' ? 'bg-gray-100' : 'bg-white',
      )}
    >
      {items.map((c, i) => {
        const boxSize = c.box ?? DEFAULT_BOX;
        const fitted = fitToBox(c.size, boxSize);

        return (
          <a
            key={c.key}
            href={`search/results?cat=${c.key}`}
            className="relative flex h-20 items-center justify-center text-center text-xs text-gray-700"
          >
            <div
              className="flex flex-col items-center justify-center"
              style={{ width: 67, height: 67 }}
            >
              <div
                className="flex items-center justify-center"
                style={{ width: boxSize, height: boxSize }}
              >
                <SvgObject
                  src={c.icon}
                  alt={c.label}
                  style={{ width: fitted.w, height: fitted.h }}
                />
              </div>
              <span className="mt-1.5 text-[11px] leading-none">{c.label}</span>
            </div>

            {i !== items.length - 1 && (
              <span className="absolute -right-1 top-1/2 h-[52px] -translate-y-1/2 border-r border-box-line" />
            )}
          </a>
        );
      })}
    </div>
  );
}
