// src/components/common/atomic/EdgeBleed.tsx
type Props = {
  children: React.ReactNode;
  /** 부모의 좌우 padding 값을 px로 정확히 상쇄하고 싶을 때 */
  offsetPx?: number; // 예: 22
  /** true면 부모 패딩 무시하고 뷰포트 전폭(w-screen)으로 뺌 */
  viewport?: boolean;
};

export default function EdgeBleed({ children, offsetPx, viewport }: Props) {
  if (viewport) {
    // 부모 패딩과 무관하게 진짜 Edge-to-edge
    return (
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        {children}
      </div>
    );
  }

  if (typeof offsetPx === 'number') {
    // 임의 px 패딩 상쇄
    return (
      <div style={{ marginLeft: -offsetPx, marginRight: -offsetPx }}>
        {/* 필요하면 내부에 다시 padding을 주고 싶다면 여기서 px 복원 */}
        {children}
      </div>
    );
  }

  // 기본: px-4 / sm:px-6 / lg:px-8 패턴 상쇄
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}