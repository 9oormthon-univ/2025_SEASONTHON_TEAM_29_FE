import { MOCK_DRESS_ROMANCE, MOCK_DRESS_TOUR } from '@/data/tourData';
import type { ToursBundle } from '@/types/tour';

export async function getTours(): Promise<ToursBundle> {
  return {
    dressTour: MOCK_DRESS_TOUR,
    dressRomance: MOCK_DRESS_ROMANCE,
  };
}