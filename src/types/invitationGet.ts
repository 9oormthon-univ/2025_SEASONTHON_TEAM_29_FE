export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export type Template = 'FILM' | 'TICKET' | string;
export type GalleryArrangement = 'SWIPE' | 'GRID' | string;

export interface InvitationData {
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
    location?: string;
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
}

export type InvitationResponse = ApiResponse<InvitationData>;
