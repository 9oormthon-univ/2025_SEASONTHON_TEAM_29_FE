import 'matter-js';

declare module 'matter-js' {
  // 스프라이트 중심 정렬용 옵션
  interface IBodyRenderOptionsSprite {
    xOffset?: number;
    yOffset?: number;
  }
  // concave 분해 등록(Common.setDecomp)의 타입 보강
  export const Common: {
    setDecomp: (decomp: unknown) => void;
  };
}