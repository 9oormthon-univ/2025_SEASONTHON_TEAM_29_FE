type SectionProps = {
  title: string;
  onMore?: () => void;
  bleed?: boolean | 'viewport';
  children: React.ReactNode;
};

export default function Section({ title, onMore, bleed = false, children }: SectionProps) {
  const wrapCls =
    bleed === 'viewport' ?
        'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen'
      : bleed ?
        '-mx-4 sm:-mx-6 lg:-mx-8'
      : '';

  return (
    <section className="mt-8">
      <div className="mx-auto w-full max-w-6xl px-1 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">{title}</h2>
          {onMore && (
            <button onClick={onMore} className="text-sm text-gray-500">
              더보기
            </button>
          )}
        </div>

        <div className={wrapCls}>
          {children}
        </div>
      </div>
    </section>
  );
}