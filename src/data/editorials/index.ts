// src/data/editorials/index.ts (이미 있다면 유지)
export { default as Editorial1 } from './Editorial1';
export { default as Editorial2 } from './Editorial2';
export { default as Editorial3 } from './Editorial3';

// 선택: id → 컴포넌트 매핑도 여기서 내보내면 편함
import Editorial1 from './Editorial1';
import Editorial2 from './Editorial2';
import Editorial3 from './Editorial3';

export const EDITORIAL_COMPONENTS: Record<number, React.FC> = {
  1: Editorial1,
  2: Editorial2,
  3: Editorial3,
};