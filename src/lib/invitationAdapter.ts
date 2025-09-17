import type { InvitationRequestBody, MediaItem } from '@/types/invitation';
import type { InviteForm } from '@/types/invite';
import type { PlaceSectionValue } from '@/components/invitation/section/PlaceSection';
import type { GallerySectionValue } from '@/components/invitation/section/GallerySection';

type MediaArg = {
  mainMedia?: MediaItem | null;
  filmMedia?: MediaItem[];
  ticketMedia?: MediaItem | null;
};

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
  const anyForm = form as any;
  const theme = anyForm.theme ?? {};
  const groom = anyForm.groom ?? {};
  const bride = anyForm.bride ?? {};
  const ceremony = anyForm.ceremony ?? {};
  const gallerySrc =
    (anyForm.gallery as Array<
      string | { key?: string; contentType?: string }
    >) ??
    (gallery?.photos as Array<
      string | { key?: string; contentType?: string }
    >) ??
    [];

  const payload: InvitationRequestBody = {
    theme: {
      font: theme.font ?? theme.fontFamily ?? '',
      fontSize: theme.fontSize ?? theme.fontWeight ?? '',
      accentColor: theme.accentColor ?? theme.accent ?? '',
      template: 'FILM',
      canEnlarge: Boolean(theme.canEnlarge),
      appearanceEffect: Boolean(theme.appearanceEffect),
    },
    basicInformation: {
      groomFirstName: groom.firstName ?? '',
      groomLastName: groom.lastName ?? '',
      groomFatherName: groom.fatherName ?? groom.father ?? '',
      groomMotherName: groom.motherName ?? groom.mother ?? '',
      brideFirstName: bride.firstName ?? '',
      brideLastName: bride.lastName ?? '',
      brideFatherName: bride.fatherName ?? bride.father ?? '',
      brideMotherName: bride.motherName ?? bride.mother ?? '',
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
      brideFirst:
        anyForm.order === 'BRIDE_FIRST' ||
        anyForm.order === 'BRIDE' ||
        anyForm.order === 'BRIDE_FIRST_ORDER' ||
        Boolean(anyForm.brideFirst),
    },
    greetings: {
      greetingsTitle: anyForm.greeting?.title ?? '',
      greetingsContent: anyForm.greeting?.body ?? '',
      greetingsSortInOrder: true,
    },
    marriageDate: {
      marriageDate: ceremony.date ?? '',
      marriageTime:
        ceremony.time ??
        (typeof ceremony.hour === 'number' &&
        typeof ceremony.minute === 'number'
          ? `${String(ceremony.hour).padStart(2, '0')}:${String(ceremony.minute).padStart(2, '0')}`
          : ''),
      representDDay: Boolean(
        ceremony.representDDay ?? ceremony.showDday ?? true,
      ),
    },
    marriagePlace: {
      vendorName: place.venueName ?? '',
      floorAndHall: place.hallInfo ?? '',
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
            mediaKey: p?.key ?? '',
            contentType: p?.contentType ?? '',
            sortOrder: idx,
          },
    ),
  };

  if (media?.mainMedia) payload.mainMedia = media.mainMedia;
  if (media?.filmMedia) payload.filmMedia = media.filmMedia;
  if (media?.ticketMedia) payload.ticketMedia = media.ticketMedia;

  return payload;
}
