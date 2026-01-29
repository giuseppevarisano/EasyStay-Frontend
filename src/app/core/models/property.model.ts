export interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  imageUrl?: string;
  amenities?: string[];
  available: boolean;
}

export interface PropertyFilter {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxGuests?: number;
  checkIn?: Date;
  checkOut?: Date;
}
