export type CreateOccurrencePayload = {
  description: string;
  categoryId: number;
  imageUrl?: string | null;
  address: string;
  locationLatitude: number;
  locationLongitude: number;
};
