'use client';

import InvitationHeader from './InvitationHeader';
import MainImage from './MainImage';
import FilmImage from './FilmImage';
import InvitationMessage from './InvitationMessage';
import InvitationCast from './InvitationCast';
import TicketImage from './TicketImage';
import Location from './Location';
import Gallery from './Gallery';
import SvgObject from '@/components/common/atomic/SvgObject';
import Reveal from '@/components/invitation/Reveal';
import { type InvitationApi } from '@/types/invitation';

const dayAbbr = (iso: string) =>
  ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date(iso).getDay()];

const ymd = (iso: string) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { y, m, dd, ymdDot: `${y}.${m}.${dd}` };
};

const timeToPmStyle = (t: string) => {
  if (/^P\.?M\.?/i.test(t) || /^A\.?M\.?/i.test(t) || /(AM|PM)/i.test(t))
    return t.replace(/AM/i, 'A.M.').replace(/PM/i, 'P.M.');
  const [hh, mm = '00'] = t.split(':');
  const H = Number(hh);
  const pm = H >= 12;
  const h12 = ((H + 11) % 12) + 1;
  return `${pm ? 'P.M.' : 'A.M.'} ${h12}:${mm}`;
};

export default function InvitationFromData({
  payload,
  className,
}: {
  payload: InvitationApi['data'];
  className?: string;
}) {
  const {
    basicInformation: b,
    greetings: g,
    marriageDate: md,
    marriagePlace: mp,
    mainMediaUrl,
    filmMediaUrl,
    ticketMediaUrl,
    mediaUrls,
  } = payload;

  const groomName = `${b.groomLastName}${b.groomFirstName}`;
  const brideName = `${b.brideLastName}${b.brideFirstName}`;

  const { y, m, dd, ymdDot } = ymd(md.marriageDate);
  const dayText = dayAbbr(md.marriageDate);
  const timeText = timeToPmStyle(md.marriageTime);
  const address = mp.address ?? '';
  const floorOnly = mp.floorAndHall;

  return (
    <div
      className={`min-h-svh w-full overflow-x-hidden overflow-y-auto bg-[#090909] ${className ?? ''}`}
    >
      <main className="mx-auto w-full max-w-[420px] pb-20">
        <Reveal>
          <InvitationHeader year={y} month={Number(m)} day={Number(dd)} />
        </Reveal>

        <Reveal delay={60}>
          <div className="px-6">
            <MainImage src={mainMediaUrl} />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <FilmImage
            className="mt-6"
            photos={[
              filmMediaUrl[0] ?? null,
              filmMediaUrl[1] ?? null,
              filmMediaUrl[2] ?? null,
            ]}
          />
        </Reveal>

        <Reveal delay={180}>
          <InvitationMessage
            className="mt-10 px-6"
            title={g.greetingsTitle}
            message={g.greetingsContent}
          />
        </Reveal>

        <Reveal delay={240}>
          <InvitationCast
            className="mt-14 px-6"
            groomName={groomName}
            brideName={brideName}
            groomFatherName={b.groomFatherName}
            groomMotherName={b.groomMotherName}
            brideFatherName={b.brideFatherName}
            brideMotherName={b.brideMotherName}
          />
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-14 flex items-center justify-center">
            <SvgObject
              src="/Date.svg"
              alt="Date"
              width={80}
              height={60}
              className="h-auto w-20 select-none"
            />
          </div>
          <div className="mt-4 flex items-center justify-center">
            <TicketImage
              imageUrl={ticketMediaUrl || null}
              dayText={dayText}
              dateText={ymdDot}
              timeText={timeText}
              placeLine1={address || mp.vendorName}
              placeLine2={floorOnly}
            />
          </div>
        </Reveal>

        <Reveal delay={360}>
          <Location
            className="mt-14 px-6"
            vendorTitle={mp.vendorName}
            floor={mp.floorAndHall}
            address={address}
            lat={mp.lat}
            lng={mp.lng}
          />
        </Reveal>

        <Reveal delay={420}>
          <Gallery className="mt-14" images={mediaUrls} showHint />
        </Reveal>
      </main>
    </div>
  );
}
