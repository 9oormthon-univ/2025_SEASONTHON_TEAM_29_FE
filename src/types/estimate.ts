export type ContractAvailabilityReq = {
  year: number;
  months: number[];
  page: number;
  size: number;
  availableOnly?: boolean;
};

export type ContractSlot = {
  id: string;
  dateISO: string;
  hallFee: number;
  minGuests: number;
  mealFee: number;
};
