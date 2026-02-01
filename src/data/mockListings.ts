export interface Property {
  id: string;
  title: string;
  type: 'room' | 'apartment' | 'house';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  images: string[];
  available: boolean;
  landlordPhone: string;
}

export const mockListings: Property[] = [
  {
    id: '1',
    title: 'Modern Single Room - Kitooro',
    type: 'room',
    price: 350000,
    location: 'Kitooro, Entebbe',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Self-contained modern single room located in the heart of Kitooro. Just 5 minutes from the airport. Perfect for airport staff.',
    features: ['Self-contained', 'Water Tank', '24/7 Security', 'Parking'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    available: true,
    landlordPhone: '+256740166778'
  },
  {
    id: '2',
    title: 'Cozy Studio Apartment',
    type: 'apartment',
    price: 550000,
    location: 'Bugiri, Entebbe',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Compact studio apartment in a peaceful compound. Ideal for single professionals or couples.',
    features: ['Modern Finishes', 'Shared Compound', 'Quiet Area', 'Near Shops'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    available: true,
    landlordPhone: '+256769616091'
  },
  {
    id: '3',
    title: '2-Bedroom Rental - Nakiwogo',
    type: 'apartment',
    price: 850000,
    location: 'Nakiwogo, Entebbe',
    bedrooms: 2,
    bathrooms: 1,
    description: 'Spacious 2-bedroom rental with a balcony. Secure compound with parking space.',
    features: ['Balcony', 'Secure Parking', 'Water Heater', 'Tiled Floors'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    available: true,
    landlordPhone: '+256740166778'
  },
  {
    id: '4',
    title: 'Self-Contained Single Room',
    type: 'room',
    price: 300000,
    location: 'Entebbe Town',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Affordable self-contained room in the heart of Entebbe town. Walking distance to all amenities.',
    features: ['Central Location', 'Water Tank', 'Security'],
    images: ['https://images.unsplash.com/photo-1598928506311-c55ece34a6e7?w=800'],
    available: true,
    landlordPhone: '+256769616091'
  },
  {
    id: '5',
    title: 'Executive 1-Bedroom Apartment',
    type: 'apartment',
    price: 700000,
    location: 'Abaita Ababiri, Entebbe',
    bedrooms: 1,
    bathrooms: 1,
    description: 'High-end 1-bedroom apartment with modern finishes. Quiet environment perfect for working professionals.',
    features: ['Luxury Finishes', 'Secure Compound', '24/7 Power'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
    available: true,
    landlordPhone: '+256740166778'
  },
  {
    id: '6',
    title: 'Double Room Rental - Katabi',
    type: 'room',
    price: 450000,
    location: 'Katabi, Entebbe',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Spacious double room with attached bathroom. Located near the main road for easy transport.',
    features: ['Spacious Room', 'Tiled Floors', 'Good Ventilation'],
    images: ['https://images.unsplash.com/photo-1536376074432-8d2ba474656d?w=800'],
    available: true,
    landlordPhone: '+256769616091'
  },
  {
    id: '7',
    title: 'Modern 2-Bedroom Apartment',
    type: 'apartment',
    price: 950000,
    location: 'Nkumba, Entebbe',
    bedrooms: 2,
    bathrooms: 2,
    description: 'New 2-bedroom apartment with 2 bathrooms. Master bedroom is ensuite. Close to Nkumba University.',
    features: ['Ensuite Master', 'Modern Kitchen', 'Ample Parking'],
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'],
    available: true,
    landlordPhone: '+256740166778'
  },
  {
    id: '8',
    title: 'Affordable Single Room - Bugiri',
    type: 'room',
    price: 250000,
    location: 'Bugiri, Entebbe',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Affordable single room in a clean compound. Perfect for students or low-budget earners.',
    features: ['Clean Environment', 'Near Shops', 'Secure'],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    available: true,
    landlordPhone: '+256769616091'
  },
  {
    id: '9',
    title: 'Cozy 3-Roomed Rental House',
    type: 'house',
    price: 1200000,
    location: 'Katabi, Entebbe',
    bedrooms: 2,
    bathrooms: 1,
    description: 'Small family house with 3 rooms (2 bedrooms + sitting). Private compound with a small garden area.',
    features: ['Private Yard', 'Gated', 'Water Tank'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    available: true,
    landlordPhone: '+256740166778'
  },
  {
    id: '10',
    title: 'Modern Studio Near Town',
    type: 'apartment',
    price: 600000,
    location: 'Entebbe Town',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Freshly renovated studio apartment near the botanical gardens. Modern fittings and very secure.',
    features: ['Renovated', 'Central Location', 'High Security'],
    images: ['https://images.unsplash.com/photo-1536376074432-8d2ba474656d?w=800'],
    available: true,
    landlordPhone: '+256769616091'
  }
];

export const locations = [
  'All Locations',
  'Entebbe Town',
  'Kitooro',
  'Bugiri',
  'Nakiwogo',
  'Abaita Ababiri',
  'Katabi',
  'Nkumba'
];

export const propertyTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'room', label: 'Room' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' }
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-UG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
