import { http, type ApiEnvelope } from '@/services/http';
import type { ReservationDay, ReservationTime } from '@/types/reservation';

/** 일자 조회 */
export async function getReservationDays(params: {
  vendorId: number | string;
  year: number;
  month: number; // 1~12
}): Promise<ReservationDay[]> {
  const { vendorId, year, month } = params;
  const res = await http<ApiEnvelope<ReservationDay[]>>(
    `/v1/reservation/${encodeURIComponent(String(vendorId))}?year=${year}&month=${month}`,
    { method: 'GET' }
  );
  return res.data ?? [];
}

/** 시간 슬롯 조회
 *  - 백이 내려주는 timeDisplay/reservationId를 보존해서 UI에서 쓸 수 있게 확장해서 리턴
 */
export type ReservationTimeEx = ReservationTime & {
  display?: string;
  id?: number;
};

export async function getReservationTimes(params: {
  vendorId: number | string;
  year: number;
  month: number;
  day: number;
}): Promise<ReservationTimeEx[]> {
  const { vendorId, year, month, day } = params;
  const res = await http<ApiEnvelope<{ timeSlots: Array<{
    time: string;
    timeDisplay?: string;
    reservationId?: number;
    available: boolean;
  }> }>>(
    `/v1/reservation/${encodeURIComponent(String(vendorId))}/detail?year=${year}&month=${month}&day=${day}`,
    { method: 'GET' }
  );

  const slots = res.data?.timeSlots ?? [];
  return slots.map(s => ({
    time: s.time,
    available: s.available,
    display: s.timeDisplay,
    id: s.reservationId,
  }));
}

/** 예약 생성 */
export async function createReservation(params: {
  vendorId: number | string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm or HH:mm:ss
}) {
  const { vendorId, date, time } = params;
  const t = time.length === 5 ? `${time}:00` : time;
  return http<ApiEnvelope<unknown>>(
    `/v1/reservation/${encodeURIComponent(String(vendorId))}`,
    { method: 'POST', body: JSON.stringify({ date, time: t }) }
  );
}

/** 견적서 담기 */
export async function addToEstimate(params: {
  vendorId: number | string;
  date: string;
  time: string;
}) {
  const { vendorId, date, time } = params;
  const t = time.length === 5 ? `${time}:00` : time;
  return http<ApiEnvelope<unknown>>(
    `/v1/estimate/${encodeURIComponent(String(vendorId))}`,
    { method: 'POST', body: JSON.stringify({ date, time: t }) }
  );
}