'use client';

type Props = {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

export default function OptionPills({ title, options, selected, onToggle }: Props) {
  return (
    <section className="px-[22px] py-2">
      <h2 className="mb-2 text-md font-bold text-gray-700">{title}</h2>
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
                on ? 'border-pink-300 bg-pink-50 text-pink-600'
                   : 'border-gray-200 bg-white text-gray-600',
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