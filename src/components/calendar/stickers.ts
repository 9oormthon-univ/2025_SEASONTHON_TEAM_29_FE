// src/components/calendar/stickers.ts
export const STICKER_SRC = {
  letter: '/icons/Calendar/letter.png',
  cake: '/icons/Calendar/cake.png',
  studio: '/icons/Calendar/studio.png',
  hall: '/icons/Calendar/hall.png',
  dress: '/icons/Calendar/dress.png',
  drink: '/icons/Calendar/drink.png',
  makeup: '/icons/Calendar/makeup.png',
} as const;

export type StickerKey = keyof typeof STICKER_SRC; // 'letter' | 'cake'