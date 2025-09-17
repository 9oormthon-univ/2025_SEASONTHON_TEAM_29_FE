export type Template = 'FILM' | string;
export type GalleryArrangement = 'SWIPE' | string;

export interface InvitationApi {
  status: number;
  success: boolean;
  message: string;
  data: {
    id: number;
    theme: {
      font: string;
      fontSize: string;
      accentColor: string;
      template: Template;
      canEnlarge: boolean;
      appearanceEffect: boolean;
    };
    basicInformation: {
      groomFirstName: string;
      groomLastName: string;
      groomFatherName: string;
      groomMotherName: string;
      brideFirstName: string;
      brideLastName: string;
      brideFatherName: string;
      brideMotherName: string;
      groomFatherDead: boolean;
      groomMotherDead: boolean;
      brideFatherDead: boolean;
      brideMotherDead: boolean;
      brideFirst: boolean;
    };
    greetings: {
      greetingsTitle: string;
      greetingsContent: string;
      greetingsSortInOrder: boolean;
    };
    marriageDate: {
      marriageDate: string;
      marriageTime: string;
      representDDay: boolean;
    };
    marriagePlace: {
      vendorName: string;
      floorAndHall: string;
      drawSketchMap: boolean;
      address?: string;
      lat?: number;
      lng?: number;
    };
    gallery: {
      galleryTitle: string;
      arrangement: GalleryArrangement;
      popUpViewer: boolean;
    };
    ending: string;
    account: string;
    background: string;
    memberId: number;
    mainMediaUrl: string;
    filmMediaUrl: string[];
    ticketMediaUrl: string;
    mediaUrls: string[];
  };
}
export const INVITATION_MOCK: InvitationApi = {
  status: 0,
  success: true,
  message: 'ok',
  data: {
    id: 1,
    theme: {
      font: 'OG, DI',
      fontSize: 'md',
      accentColor: '#FFB1B8',
      template: 'FILM',
      canEnlarge: true,
      appearanceEffect: true,
    },
    basicInformation: {
      groomFirstName: '하준',
      groomLastName: '윤',
      groomFatherName: '윤상철',
      groomMotherName: '최미정',
      brideFirstName: '지안',
      brideLastName: '박',
      brideFatherName: '박종태',
      brideMotherName: '김영주',
      groomFatherDead: false,
      groomMotherDead: false,
      brideFatherDead: false,
      brideMotherDead: false,
      brideFirst: false,
    },
    greetings: {
      greetingsTitle: 'Eternal Stories,\nShared Together',
      greetingsContent:
        '서로의 이야기를 함께 나누며\n영원히 이어질 새로운 문을 열고자\n합니다. 그 첫날에 소중한 발걸음을\n해주신다면 큰 믿음으로 간직하겠습니다.',
      greetingsSortInOrder: true,
    },
    marriageDate: {
      marriageDate: '2026-05-16',
      marriageTime: '13:30',
      representDDay: true,
    },
    marriagePlace: {
      vendorName: '아펠가모 선릉점',
      floorAndHall: '4층 선릉홀',
      drawSketchMap: true,
      address: '서울 강남구 테헤란로 322 한신인터밸리24빌딩',
    },
    gallery: {
      galleryTitle: 'Gallery',
      arrangement: 'SWIPE',
      popUpViewer: true,
    },
    ending: '',
    account: '',
    background: '',
    memberId: 0,
    mainMediaUrl: '/mock/main-sample.jpg',
    filmMediaUrl: [
      '/mock/film-01.jpg',
      '/mock/film-02.jpg',
      '/mock/film-03.jpg',
    ],
    ticketMediaUrl: '/mock/ticket-photo.jpg',
    mediaUrls: Array.from(
      { length: 27 },
      (_, i) => `/mock/gallery-${String(i + 1).padStart(2, '0')}.jpg`,
    ),
  },
};

export type InvitationTheme = {
  font: string;
  fontSize: string;
  accentColor: string;
  template: 'FILM';
  canEnlarge: boolean;
  appearanceEffect: boolean;
};

export type InvitationBasicInformation = {
  groomFirstName: string;
  groomLastName: string;
  groomFatherName: string;
  groomMotherName: string;
  brideFirstName: string;
  brideLastName: string;
  brideFatherName: string;
  brideMotherName: string;
  groomFatherDead: boolean;
  groomMotherDead: boolean;
  brideFatherDead: boolean;
  brideMotherDead: boolean;
  brideFirst: boolean;
};

export type InvitationGreetings = {
  greetingsTitle: string;
  greetingsContent: string;
  greetingsSortInOrder: boolean;
};

export type InvitationMarriageDate = {
  marriageDate: string;
  marriageTime: string;
  representDDay: boolean;
};

export type InvitationMarriagePlace = {
  vendorName: string;
  floorAndHall: string;
  drawSketchMap: boolean;
};

export type InvitationGallery = {
  galleryTitle: string;
  arrangement: 'SWIPE';
  popUpViewer: boolean;
};

export type InvitationMediaItem = {
  mediaKey: string;
  contentType: string;
  sortOrder: number;
};

export type InvitationRequestBody = {
  theme: InvitationTheme;
  basicInformation: InvitationBasicInformation;
  greetings: InvitationGreetings;
  marriageDate: InvitationMarriageDate;
  marriagePlace: InvitationMarriagePlace;
  gallery: InvitationGallery;
  ending: string;
  account: string;
  background: string;
  mainMedia: InvitationMediaItem;
  filmMedia: InvitationMediaItem[];
  ticketMedia: InvitationMediaItem;
  mediaList: InvitationMediaItem[];
};

export type InvitationResponse<T = { id: string }> = T;

export type MediaItem = {
  mediaKey: string;
  contentType: string;
  sortOrder: number;
};
