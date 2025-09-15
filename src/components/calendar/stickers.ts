// src/components/calendar/stickers.ts
export const STICKER_SRC = {
  INVITATION: '/icons/Calendar/letter.png',
  STUDIO: '/icons/Calendar/studio.png',
  WEDDING_HALL: '/icons/Calendar/hall.png',
  DRESS: '/icons/Calendar/dress.png',
  PARTY: '/icons/Calendar/drink.png',
  BRIDAL_SHOWER: '/icons/Calendar/cake.png',
  MAKEUP: '/icons/Calendar/makeup.png',
} as const;

export type StickerKey = keyof typeof STICKER_SRC; // 'letter' | 'cake'