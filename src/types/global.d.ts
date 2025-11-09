export {};

declare global {
  interface Window {
    testNotification?: () => void;
    triggerReservationNotification?: (reservationId: number, vendorName?: string) => void;
  }
}

