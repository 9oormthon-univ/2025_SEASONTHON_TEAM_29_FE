'use client';

type Props = {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

export default function OptionPills({
  title,
  options,
  selected,
  onToggle,
}: Props) {
  return (
    <section className="py-2">
      <h2 className="mb-2 text-md text-[14px] font-extrabold text-text-defaul">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {options.map((m) => {
          const on = selected.includes(m);
          return (
            <button
              key={m}
              type="button"
              onClick={() => onToggle(m)}
              className={[
                'rounded-full px-3 py-1 text-sm border',
                on
                  ? 'border-primary-400 bg-primary-300 text-text-default'
                  : 'border-gray-200 bg-white text-text-default',
              ].join(' ')}
            >
              {m}
            </button>
          );
        })}
      </div>
    </section>
  );
}
