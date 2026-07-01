export interface Room {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  images: string[];
  amenities: string[];
  rules: string[];
  status: 'available' | 'rented' | 'inactive';
  availableFrom: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}
