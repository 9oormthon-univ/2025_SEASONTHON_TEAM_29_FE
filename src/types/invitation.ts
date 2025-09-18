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

export type InvitationResponse<T = { id: number }> = T;
export type MediaItem = {
  mediaKey: string;
  contentType: string;
  sortOrder: number;
};
