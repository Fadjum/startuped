import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, CheckCircle, Phone, MessageCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnquiryForm from '@/components/EnquiryForm';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { Property, formatPrice, mockListings } from '@/data/mockListings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarListings, setSimilarListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      // Try to fetch from database first
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      // Error handled by fallback to mock data below

      if (data) {
        const mapped: Property = {
          id: data.id,
          title: data.title,
          type: data.type as 'room' | 'apartment' | 'house',
          price: data.price,
          location: data.location,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          description: data.description || '',
          features: data.features || [],
          images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
          available: data.available ?? true,
          landlordPhone: data.landlord_phone
        };
        setProperty(mapped);

        // Fetch similar listings
        const { data: similarData } = await supabase
          .from('properties')
          .select('*')
          .eq('available', true)
          .eq('type', data.type)
          .neq('id', id)
          .limit(3);

        if (similarData && similarData.length > 0) {
          const mappedSimilar: Property[] = similarData.map(p => ({
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
            landlordPhone: p.landlord_phone
          }));
          setSimilarListings(mappedSimilar);
        }
      } else {
        // Fallback to mock data
        const mockProperty = mockListings.find(p => p.id === id);
        if (mockProperty) {
          setProperty(mockProperty);
          setSimilarListings(
            mockListings.filter(p => p.id !== id && p.type === mockProperty.type).slice(0, 3)
          );
        }
      }

      setIsLoading(false);
    };

    fetchProperty();
  }, [id]);

  const typeLabels: Record<string, string> = {
    room: 'Room',
    apartment: 'Apartment',
    house: 'House'
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
            <Link to="/listings">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Listings
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-muted/50 py-4">
          <div className="container-custom">
            <Link 
              to="/listings" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Link>
          </div>
        </div>

        <div className="container-custom py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                      {typeLabels[property.type]}
                    </Badge>
                    {property.available && (
                      <Badge className="bg-success text-success-foreground">
                        Available Now
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Additional Images */}
                {property.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${property.title} - Image ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Info */}
              <div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    UGX {formatPrice(property.price)}
                  </span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {property.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                  </div>
                </div>

                <hr className="border-border my-6" />

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description || 'No description available.'}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 text-foreground"
                        >
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Quick Contact */}
              <div className="lg:hidden bg-muted/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-3">Quick Contact</p>
                <div className="flex gap-3">
                  <a href={`tel:${property.landlordPhone}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </a>
                  <a 
                    href={`https://wa.me/${property.landlordPhone.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-success hover:bg-success/90">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar - Enquiry Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-card">
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  Interested in this property?
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Send your details and we'll connect you with the landlord.
                </p>
                <EnquiryForm property={property} />
              </div>
            </div>
          </div>

          {/* Similar Listings */}
          {similarListings.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Similar Properties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {similarListings.map((listing) => (
                  <PropertyCard key={listing.id} property={listing} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ListingDetail;
