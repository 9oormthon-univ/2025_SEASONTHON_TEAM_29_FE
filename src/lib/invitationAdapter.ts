import type {
  InvitationRequestBody,
  MediaItem,
  InvitationApi,
} from '@/types/invitation';
import type { InviteForm } from '@/types/invite';
import type { PlaceSectionValue } from '@/components/invitation/section/PlaceSection';
import type { GallerySectionValue } from '@/components/invitation/section/GallerySection';
import type { InvitationData } from '@/types/invitationGet';

type MediaArg = {
  mainMedia?: MediaItem | null;
  filmMedia?: MediaItem[];
  ticketMedia?: MediaItem | null;
};

type Dict = Record<string, unknown>;
type GalleryItem = string | { key?: string; contentType?: string };

function asDict(v: unknown): Dict {
  return v && typeof v === 'object' ? (v as Dict) : {};
}

function asGalleryArr(v: unknown): GalleryItem[] {
  if (!Array.isArray(v)) return [];
  return v.filter(
    (x): x is GalleryItem =>
      typeof x === 'string' || (x && typeof x === 'object'),
  );
}

export function toInvitationPayload(
  form: InviteForm,
  place: PlaceSectionValue,
  gallery: GallerySectionValue,
): InvitationRequestBody;
export function toInvitationPayload(
  form: InviteForm,
  place: PlaceSectionValue,
  gallery: GallerySectionValue,
  media: MediaArg,
): InvitationRequestBody;
export function toInvitationPayload(
  form: InviteForm,
  place: PlaceSectionValue,
  gallery: GallerySectionValue,
  media?: MediaArg,
): InvitationRequestBody {
  const f = asDict(form);
  const theme = asDict(f.theme);
  const groom = asDict(f.groom);
  const bride = asDict(f.bride);
  const ceremony = asDict(f.ceremony);

  const galleryFromForm = asGalleryArr(f.gallery);
  const galleryFromSection = asGalleryArr(gallery?.photos);
  const gallerySrc: GalleryItem[] =
    galleryFromForm.length > 0 ? galleryFromForm : galleryFromSection;

  const orderVal = f.order;
  const brideFirst =
    orderVal === 'BRIDE_FIRST' ||
    orderVal === 'BRIDE' ||
    orderVal === 'BRIDE_FIRST_ORDER' ||
    Boolean(f.brideFirst);

  const greeting = asDict(f.greeting);

  const payload: InvitationRequestBody = {
    theme: {
      font: (theme.font ?? theme.fontFamily ?? '') as string,
      fontSize: (theme.fontSize ?? theme.fontWeight ?? '') as string,
      accentColor: (theme.accentColor ?? theme.accent ?? '') as string,
      template: 'FILM',
      canEnlarge: Boolean(theme.canEnlarge),
      appearanceEffect: Boolean(theme.appearanceEffect),
    },
    basicInformation: {
      groomFirstName: (groom.firstName ?? '') as string,
      groomLastName: (groom.lastName ?? '') as string,
      groomFatherName: (groom.fatherName ?? groom.father ?? '') as string,
      groomMotherName: (groom.motherName ?? groom.mother ?? '') as string,
      brideFirstName: (bride.firstName ?? '') as string,
      brideLastName: (bride.lastName ?? '') as string,
      brideFatherName: (bride.fatherName ?? bride.father ?? '') as string,
      brideMotherName: (bride.motherName ?? bride.mother ?? '') as string,
      groomFatherDead: Boolean(
        groom.fatherDeceased ?? groom.fatherDead ?? groom.isFatherDead ?? false,
      ),
      groomMotherDead: Boolean(
        groom.motherDeceased ?? groom.motherDead ?? groom.isMotherDead ?? false,
      ),
      brideFatherDead: Boolean(
        bride.fatherDeceased ?? bride.fatherDead ?? bride.isFatherDead ?? false,
      ),
      brideMotherDead: Boolean(
        bride.motherDeceased ?? bride.motherDead ?? bride.isMotherDead ?? false,
      ),
      brideFirst,
    },
    greetings: {
      greetingsTitle: (greeting.title ?? '') as string,
      greetingsContent: (greeting.body ?? '') as string,
      greetingsSortInOrder: true,
    },
    marriageDate: {
      marriageDate: (ceremony.date ?? '') as string,
      marriageTime:
        (ceremony.time as string | undefined) ??
        (typeof ceremony.hour === 'number' &&
        typeof ceremony.minute === 'number'
          ? `${String(ceremony.hour as number).padStart(2, '0')}:${String(ceremony.minute as number).padStart(2, '0')}`
          : ''),
      representDDay: Boolean(
        ceremony.representDDay ?? ceremony.showDday ?? true,
      ),
    },
    marriagePlace: {
      vendorName: (place.venueName ?? '') as string,
      floorAndHall: (place.hallInfo ?? '') as string,
      drawSketchMap: Boolean(place.showMap),
    },
    gallery: {
      galleryTitle: '갤러리',
      arrangement: 'SWIPE',
      popUpViewer: Boolean(gallery?.enablePopup ?? true),
    },
    ending: '',
    account: '',
    background: '',
    mainMedia: { mediaKey: '', contentType: '', sortOrder: 0 },
    filmMedia: [],
    ticketMedia: { mediaKey: '', contentType: '', sortOrder: 0 },
    mediaList: gallerySrc.map((p, idx) =>
      typeof p === 'string'
        ? { mediaKey: p, contentType: '', sortOrder: idx }
        : {
            mediaKey: (p?.key ?? '') as string,
            contentType: (p?.contentType ?? '') as string,
            sortOrder: idx,
          },
    ),
  };

  if (media?.mainMedia) payload.mainMedia = media.mainMedia;
  if (media?.filmMedia) payload.filmMedia = media.filmMedia;
  if (media?.ticketMedia) payload.ticketMedia = media.ticketMedia;

  return payload;
}

type InvitationExtras = Partial<
  Pick<InvitationApi['data'], 'ending' | 'account' | 'background'>
>;
type PlaceExtras = Partial<{ location: string; lat: number; lng: number }>;
type InvitationDataCompat = InvitationData &
  InvitationExtras & {
    marriagePlace: InvitationData['marriagePlace'] & PlaceExtras;
  };

export function toInvitationApiData(
  d: InvitationDataCompat,
): InvitationApi['data'] {
  const { ending = '', account = '', background = '' } = d;
  const { vendorName, floorAndHall, drawSketchMap, location, lat, lng } =
    d.marriagePlace;

  return {
    id: d.id,
    memberId: d.memberId,
    ending,
    account,
    background,
    theme: d.theme,
    basicInformation: d.basicInformation,
    greetings: d.greetings,
    marriageDate: d.marriageDate,
    marriagePlace: {
      vendorName,
      floorAndHall,
      drawSketchMap,
      address: location,
      lat,
      lng,
    },
    mainMediaUrl: d.mainMediaUrl,
    filmMediaUrl: d.filmMediaUrl ?? [],
    ticketMediaUrl: d.ticketMediaUrl,
    mediaUrls: d.mediaUrls ?? [],
    gallery: d.gallery,
  };
}
