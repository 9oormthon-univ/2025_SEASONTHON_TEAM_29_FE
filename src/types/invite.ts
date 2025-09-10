// src/types/invite.ts
export const FONT_FAMILIES = ['나눔명조', '본고딕', '나눔고딕'] as const;
export const FONT_WEIGHTS  = ['보통', '두껍게'] as const;
export const ACCENTS       = ['#f9c8cf', '#cdb7f6', '#ffe8b3'] as const;
export const TEMPLATES     = ['Film', 'Letter', 'Album'] as const;
export const ENTRY_EFFECTS = ['scroll-fade', 'none'] as const;
export const PERSON_ROLES  = ['아들', '딸'] as const;
export const ORDER_OPTS    = ['신부먼저', '신랑먼저'] as const;
export const GREET_SORTS   = ['순서대로', '랜덤'] as const;

export type FontFamily   = typeof FONT_FAMILIES[number];
export type FontWeight   = typeof FONT_WEIGHTS[number];
export type AccentColor  = typeof ACCENTS[number];
export type TemplateName = typeof TEMPLATES[number];
export type EntryEffect  = typeof ENTRY_EFFECTS[number];
export type PersonRole   = typeof PERSON_ROLES[number];
export type OrderOpt     = typeof ORDER_OPTS[number];
export type GreetSort    = typeof GREET_SORTS[number];

export type ParentInfo = { lastName: string; deceased?: boolean };
export type PersonInfo = {
  lastName: string;
  firstName: string;
  roleLabel: PersonRole;
  father?: ParentInfo;
  mother?: ParentInfo;
};

export type InviteForm = {
  theme: {
    fontFamily: FontFamily;
    fontWeight: FontWeight;
    accent: AccentColor;
    template: TemplateName;
    entryEffect: EntryEffect;
    preventZoom: boolean;
  };
  groom: PersonInfo;
  bride: PersonInfo;
  order: OrderOpt;
  greeting: { title: string; body: string; sort: GreetSort };
  ceremony: { date: string; hour: number; minute: number; showDday: boolean };
  venue: { address: string; hallName: string; roomFloor: string };
  transport: { subway?: string; bus?: string; parking?: string; etc?: string };
  gallery: string[];
  ending: { quote?: string; photoUrl?: string };
  accounts: { bank: string; name: string; number: string; memo?: string }[];
  bgm: { url?: string; autoplay: boolean };
  particles: { enabled: boolean };
};

// 안전한 선택 유틸(런타임 가드)
export function isOneOf<T extends readonly string[]>(
  arr: T,
  v: string,
): v is T[number] {
  return (arr as readonly unknown[]).includes(v);
}

export const defaultInviteForm: InviteForm = {
  theme: {
    fontFamily: '나눔명조',
    fontWeight: '보통',
    accent: '#f9c8cf',
    template: 'Film',
    entryEffect: 'scroll-fade',
    preventZoom: true,
  },
  groom: { lastName: '', firstName: '', roleLabel: '아들' },
  bride: { lastName: '', firstName: '', roleLabel: '딸' },
  order: '신부먼저',
  greeting: {
    title: '소중한 분들을 초대합니다.',
    body:
      '시간을 돌릴 수 있다면, 우리는 언제나 다시 서로를 선택할 것입니다. 함께하는 오늘이 늘 가장 특별한 날이 되도록, 이제 부부로서 평생의 시간을 함께하고자 합니다. 저희 두 사람의 첫걸음을 축복해 주시면 큰 기쁨이 되겠습니다.',
    sort: '순서대로',
  },
  ceremony: { date: '2025-09-10', hour: 12, minute: 30, showDday: true },
  venue: { address: '', hallName: '', roomFloor: '' },
  transport: {},
  gallery: [],
  ending: {},
  accounts: [],
  bgm: { url: '', autoplay: false },
  particles: { enabled: false },
};