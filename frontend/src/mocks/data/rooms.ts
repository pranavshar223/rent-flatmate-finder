export const mockRooms = [
  {
    id: 'r1',
    ownerId: 'owner1',
    title: 'Spacious Master Bedroom',
    description: 'Looking for a flatmate to share this amazing apartment.',
    price: 1200,
    location: 'SOMA',
    city: 'San Francisco',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    amenities: ['Wi-Fi', 'Gym'],
    rules: [],
    status: 'available',
    availableFrom: '2023-10-15T00:00:00.000Z',
    capacity: 1,
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2023-10-01T00:00:00.000Z',
    compatibility: {
      score: 88,
      label: 'Good Match',
      confidence: 'High',
      explanation: 'Great match on location and budget, but lifestyle preferences differ slightly.',
      breakdown: { budget: true, location: true, moveIn: true, roomType: true, lifestyle: false }
    }
  },
  {
    id: 'r3',
    ownerId: 'owner2',
    title: 'Luxury Studio in City Center',
    description: 'Modern luxury studio with amazing city views. Looking for a neat flatmate.',
    price: 1500,
    location: 'Downtown',
    city: 'San Francisco',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1e5240980c?w=800&q=80'],
    amenities: ['Gym', 'Pool', 'Doorman', 'In-unit Washer'],
    rules: ['No pets', 'No smoking'],
    status: 'available',
    availableFrom: '2023-11-01T00:00:00.000Z',
    capacity: 1,
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2023-10-01T00:00:00.000Z',
    compatibility: {
      score: 95,
      label: 'Excellent Match',
      confidence: 'Very High',
      explanation: 'This room closely matches your preferences, budget, and lifestyle choices.',
      breakdown: { budget: true, location: true, moveIn: true, roomType: true, lifestyle: true }
    }
  }
];
