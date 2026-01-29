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
    title: 'Modern 2-Bedroom Apartment Near Airport',
    type: 'apartment',
    price: 800000,
    location: 'Kitooro, Entebbe',
    bedrooms: 2,
    bathrooms: 1,
    description: 'A beautiful modern apartment located just 5 minutes from Entebbe International Airport. Features a spacious living room, modern kitchen, and private balcony with lake views. Perfect for airport staff or frequent travelers.',
    features: ['Furnished', 'Water Tank', '24/7 Security', 'Parking', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    available: true,
    landlordPhone: '+256740166778'
  },
  {
    id: '2',
    title: 'Cozy Single Room in Quiet Compound',
    type: 'room',
    price: 250000,
    location: 'Bugiri, Entebbe',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Affordable single room in a peaceful compound with shared facilities. Ideal for students or single professionals. Close to shops and public transport.',
    features: ['Self-Contained', 'Shared Compound', 'Quiet Area', 'Near Shops'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    available: true,
    landlordPhone: '+256769616091'
  },
  {
    id: '3',
    title: 'Spacious Family House with Garden',
    type: 'house',
    price: 1500000,
    location: 'Nakiwogo, Entebbe',
    bedrooms: 4,
    bathrooms: 3,
    description: 'Large family home with beautiful garden and outdoor space. Features 4 bedrooms, spacious living areas, modern kitchen, and boys quarters. Perfect for families looking for comfort and space near Lake Victoria.',
    features: ['Garden', 'Boys Quarters', 'Garage', 'Solar Power', 'Lake View'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    available: true,
    landlordPhone: '+256740166778'
  },
  {
    id: '4',
    title: 'Studio Apartment - Town Center',
    type: 'apartment',
    price: 450000,
    location: 'Entebbe Town',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Compact studio apartment in the heart of Entebbe town. Walking distance to beaches, restaurants, and the botanical gardens. Newly renovated with modern finishes.',
    features: ['Newly Renovated', 'Central Location', 'Water Heater', 'Security'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    available: true,
    landlordPhone: '+256769616091'
  },
  {
    id: '5',
    title: 'Executive 3-Bedroom Apartment',
    type: 'apartment',
    price: 1200000,
    location: 'Abaita Ababiri, Entebbe',
    bedrooms: 3,
    bathrooms: 2,
    description: 'Luxury apartment in the prestigious Abaita Ababiri area. High-end finishes throughout, spacious master bedroom with en-suite, large living and dining area. Ideal for diplomats and executives.',
    features: ['Luxury Finishes', 'Swimming Pool', 'Gym Access', '24/7 Power', 'Secure Compound'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    available: true,
    landlordPhone: '+256740166778'
  },
  {
    id: '6',
    title: 'Affordable Double Room',
    type: 'room',
    price: 350000,
    location: 'Kitoro, Entebbe',
    bedrooms: 1,
    bathrooms: 1,
    description: 'Spacious double room suitable for a couple or individual seeking more space. Self-contained with a small kitchenette. Located in a friendly neighborhood.',
    features: ['Self-Contained', 'Kitchenette', 'Tiled Floors', 'Good Ventilation'],
    images: ['https://images.unsplash.com/photo-1598928506311-c55ez9d6e6f?w=800'],
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
  'Kitoro',
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
