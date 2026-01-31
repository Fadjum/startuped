import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { api, ApiProperty } from '@/lib/api';
import { Property, mockListings } from '@/data/mockListings';
import { Button } from '@/components/ui/button';

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState<Property[]>([]);
  const [filteredListings, setFilteredListings] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await api.properties.list(true);
        
        if (data && data.length > 0) {
          const mapped: Property[] = data.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type as 'room' | 'apartment' | 'house',
            price: p.price,
            location: p.location,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            description: p.description || '',
            features: p.features || [],
            images: p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
            available: p.available ?? true,
            landlordPhone: p.landlordPhone
          }));
          setListings(mapped);
          setFilteredListings(mapped);
        } else {
          setListings(mockListings);
          setFilteredListings(mockListings);
        }
      } catch (error) {
        setListings(mockListings);
        setFilteredListings(mockListings);
      }
      setIsLoading(false);
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const locationParam = searchParams.get('location');
    const typeParam = searchParams.get('type');

    let results = [...listings];

    if (locationParam && locationParam !== 'All Locations') {
      results = results.filter(p => 
        p.location.toLowerCase().includes(locationParam.toLowerCase())
      );
    }

    if (typeParam && typeParam !== 'all') {
      results = results.filter(p => p.type === typeParam);
    }

    setFilteredListings(results);
  }, [searchParams, listings]);

  const handleSearch = (location: string, type: string) => {
    let results = [...listings];

    if (location && location !== 'All Locations') {
      results = results.filter(p => 
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type && type !== 'all') {
      results = results.filter(p => p.type === type);
    }

    setFilteredListings(results);
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        <section className="bg-muted/50 py-8 md:py-12">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Rentals in Entebbe
            </h1>
            <p className="text-muted-foreground mb-6">
              Find apartments, rooms, and houses for rent near Lake Victoria
            </p>
            
            <SearchBar variant="compact" onSearch={handleSearch} />
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredListings.length}</span>
                {' '}properties found
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="hidden md:flex"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="hidden md:flex"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredListings.length > 0 ? (
              <div className={`grid gap-6 md:gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredListings.map((listing) => (
                  <PropertyCard key={listing.id} property={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No properties found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search filters or check back later
                </p>
                <Button onClick={() => handleSearch('All Locations', 'all')}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Listings;
