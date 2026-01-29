export type CreateOccurrencePayload = {
  description: string;
  categoryId: number;
  imageUrl?: string | null;
  address: string;
  locationLatitude: number;
  locationLongitude: number;
};

export type ProfileForm = {
  name: string;
  email: string;
  address: string;
  avatarUrl?: string | null;
};

export type ApiErrorResponse = { message?: string };
