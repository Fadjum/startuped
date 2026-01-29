import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnquiryForm from '@/components/EnquiryForm';
import PropertyCard from '@/components/PropertyCard';
import { mockListings, formatPrice } from '@/data/mockListings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const property = mockListings.find(p => p.id === id);

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

  const similarListings = mockListings
    .filter(p => p.id !== property.id && p.type === property.type)
    .slice(0, 3);

  const typeLabels = {
    room: 'Room',
    apartment: 'Apartment',
    house: 'House'
  };

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
              {/* Image */}
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
                    {property.description}
                  </p>
                </div>

                {/* Features */}
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
