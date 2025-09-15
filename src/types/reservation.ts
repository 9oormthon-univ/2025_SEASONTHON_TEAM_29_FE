// src/types/reservation.ts
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type ReservationDay = {
  date: string;
  available: boolean;
  isBookable?: boolean;
  totalSlots?: number;
  availableSlots?: number;
};

export type ReservationSlot = {
  slotId: number;
  startTime: string; // "10:00"
  endTime: string;   // "11:00"
  status: 'AVAILABLE' | 'RESERVED' | 'UNAVAILABLE';
};

export type MyReservation = {
  reservationId: number;
  vendorName: string;
  vendorType: string;
  visitDateTime: string;
  status: string;
};