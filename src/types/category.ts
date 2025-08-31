export type CategoryKey = 'hall' | 'dress' | 'studio' | 'makeup';

export type CategoryItem = {
  key: CategoryKey;
  label: string;
  icon: string; // public 경로(/icon/*.svg)
};