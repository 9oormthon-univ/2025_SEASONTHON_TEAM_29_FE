export type CategoryKey = 'hall' | 'dress' | 'studio' | 'makeup';

export type CategoryItem = {
  key: CategoryKey;
  label: string;
  icon: string;
  size?: { w: number; h: number };
  box?: number;
};
