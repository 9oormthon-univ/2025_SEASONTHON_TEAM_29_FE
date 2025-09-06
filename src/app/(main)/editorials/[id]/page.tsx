// src/app/(main)/editorials/[id]/page.tsx
import ShareButton from '@/components/common/atomic/ShareButton';
import Header from '@/components/common/monocules/Header';
import { EDITORIAL_COMPONENTS } from '@/data/editorials';
import { getEditorialById } from '@/lib/editorials';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// ✅ params는 Promise 아님! (await 제거)
type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { id } = params; // ✅ await 제거
  const ed = getEditorialById(Number(id));
  if (!ed) return {};

  const title = ed.title.replace(/\n/g, ' ');
  const description = ed.sub || '웨딩 에디토리얼';
  const ogImg = ed.heroSrc || ed.thumbnail || '/og-default.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImg }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImg],
    },
  };
}

export default function EditorialDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { id } = params; // ✅ await 제거
  const numId = Number(id);
  const ed = getEditorialById(numId);
  if (!ed) return notFound();

  // id → 컴포넌트
  const Body = EDITORIAL_COMPONENTS[numId];
  if (!Body) return notFound();

  const isWhite = ed.bannerColor === 'white';
  const overlayTextCls = isWhite ? 'text-white drop-shadow-md' : 'text-black';
  const logoVariant = ed.logoVariant ?? (isWhite ? 'g' : 'b');
  const logoSrc = `/editorials/logo-${logoVariant}.svg`;

  return (
    <main className="mx-auto w-full max-w-[420px] pb-24" data-hide-bottombar>
      <Header value="매거진" className="h-[50px] px-[22px]" />

      {/* 썸네일 + 오버레이 */}
      <section className="relative">
        <Image
          src={ed.thumbnail || ed.heroSrc}
          alt={ed.title.replace(/\n/g, ' ')}
          width={1600}
          height={900}
          priority
          sizes="(max-width: 420px) 100vw, 420px"
          className="block w-full h-auto select-none"
        />
        <Image
          src={logoSrc}
          alt="W 로고"
          width={24}
          height={24}
          className="absolute right-3 top-3 opacity-90"
        />
        <div className={`absolute bottom-14 left-6 right-6 ${overlayTextCls}`}>
          <div className="text-[11px] tracking-wide opacity-90">
            {ed.tags.join(' | ')}
          </div>
          <h1 className="mt-2 whitespace-pre-line text-2xl font-extrabold leading-snug">
            {ed.title}
          </h1>
        </div>
      </section>

      <section className="px-[22px] py-4 bg-white">
        <div className="flex items-start gap-3">
          <p className="whitespace-pre-line text-[17px] font-bold text-gray-800 flex-1 line-clamp-2 break-keep">
            {ed.sub}
          </p>
          <ShareButton title={ed.title} sub={ed.sub} />
        </div>
        <div className="mt-2 text-sm text-gray-500">{ed.dateISO}</div>
      </section>

      {/* ✅ 컴포넌트로 본문 렌더링 (dangerouslySetInnerHTML 제거) */}
      <article className="prose prose-sm max-w-none px-[22px] py-2 prose-img:rounded-md prose-img:w-full">
        <Body />
      </article>

      {(ed.photoSource || ed.editor) && (
        <footer className="px-[22px] pb-8 pt-20 text-right space-y-1">
          {ed.photoSource && (
            <div>
              <span className="text-text--default text-base font-medium font-['Inter'] leading-loose">
                Photo.
              </span>{' '}
              <span className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
                {ed.photoSource}
              </span>
            </div>
          )}
          {ed.editor && (
            <div>
              <span className="text-text--default text-base font-medium font-['Inter'] leading-loose">
                Editor.
              </span>{' '}
              <span className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
                {ed.editor}
              </span>
            </div>
          )}
        </footer>
      )}
    </main>
  );
}

// SSG용: 그대로 유지
export async function generateStaticParams() {
  const { editorials } = await import('@/data/editorialsData');
  return editorials.map((e) => ({ id: String(e.id) }));
}
export const dynamicParams = false;