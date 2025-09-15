// src/services/reservation.api.ts
import { http } from '@/services/http';
import type { ApiResponse, MyReservation, ReservationDay, ReservationSlot } from '@/types/reservation';

/** 월별 예약 가능 여부 조회 */
export async function getMonthlyAvailability(params: {
  vendorId: number;
  year: number;
  month: number;
}): Promise<ReservationDay[]> {
  const { vendorId, year, month } = params;
  const res = await http<ApiResponse<ReservationDay[]>>(
    `/v1/vendors/${vendorId}/monthly-availability?year=${year}&month=${month}`,
    { method: 'GET' },
  );
  return res.data ?? [];
}

/** 일별 예약 가능한 슬롯 조회 */
export async function getDailySlots(params: {
  vendorId: number;
  year: number;
  month: number;
  day: number;
}): Promise<ReservationSlot[]> {
  const { vendorId, year, month, day } = params;
  const res = await http<ApiResponse<ReservationSlot[]>>(
    `/v1/vendors/${vendorId}/daily-slots?year=${year}&month=${month}&day=${day}`,
    { method: 'GET' },
  );
  return res.data ?? [];
}

/** 상담 예약 생성 */
export async function createReservation(params: {
  slotId: number;
  memo?: string;
}) {
  return http<ApiResponse<number>>(`/v1/reservations`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/** 내 예약 목록 조회 */
export async function getMyReservations(): Promise<MyReservation[]> {
  const res = await http<ApiResponse<MyReservation[]>>(
    `/v1/reservations/my`,
    { method: 'GET' },
  );
  return res.data ?? [];
}

export async function createConsultationSlots(params: {
  vendorId: number;
  startTimes: string[];
}) {
  return http<ApiResponse<string>>(`/v1/reservation/slots`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}