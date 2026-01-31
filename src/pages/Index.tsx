import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Users, Shield, Star, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { Property, mockListings } from '@/data/mockListings';
import heroImage from '@/assets/hero-entebbe.jpg';

const Index = () => {
  const [featuredListings, setFeaturedListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        // Fallback to mock data on error
        setFeaturedListings(mockListings.slice(0, 3));
      } else if (data && data.length > 0) {
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
          landlordPhone: p.landlord_phone
        }));
        setFeaturedListings(mapped);
      } else {
        setFeaturedListings(mockListings.slice(0, 3));
      }
      setIsLoading(false);
    };

    fetchFeaturedListings();
  }, []);

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Beautiful apartments in Entebbe, Uganda with Lake Victoria in the background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 hero-overlay" />
          </div>

          {/* Content */}
          <div className="relative z-10 container-custom py-20 text-center">
            <div className="max-w-4xl mx-auto animate-fade-in">
              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Find Rental Houses & Rooms
                <span className="block text-accent">in Entebbe</span>
              </h1>

              {/* Subtext */}
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                Apartments, single rooms, and family houses in Entebbe and surrounding areas. 
                Connect directly with verified landlords.
              </p>

              {/* Search Bar */}
              <SearchBar variant="hero" />

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-foreground">50+</p>
                  <p className="text-primary-foreground/70 text-sm">Active Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-foreground">200+</p>
                  <p className="text-primary-foreground/70 text-sm">Happy Tenants</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-foreground">30+</p>
                  <p className="text-primary-foreground/70 text-sm">Verified Landlords</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Featured Rentals
                </h2>
                <p className="text-muted-foreground">
                  Hand-picked properties available now in Entebbe
                </p>
              </div>
              <Link to="/listings">
                <Button variant="outline" className="group">
                  View All Listings
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredListings.map((listing) => (
                  <PropertyCard key={listing.id} property={listing} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 section-muted">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground">
                Finding your next home in Entebbe is simple
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2">1. Search</h3>
                <p className="text-muted-foreground">
                  Browse available rooms, apartments, and houses in Entebbe areas
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2">2. Enquire</h3>
                <p className="text-muted-foreground">
                  Send your details and we'll connect you with the landlord directly
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2">3. Move In</h3>
                <p className="text-muted-foreground">
                  Agree on terms with the landlord and move into your new home
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Your Trusted Partner for Entebbe Rentals
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Whether you're an airport staff member, a newcomer to Entebbe, a traveler seeking 
                  short-term accommodation, or a resident looking for a new home — we help you find 
                  quality rentals faster.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Local Focus</h4>
                      <p className="text-muted-foreground text-sm">Exclusively serving Entebbe and surrounding areas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Verified Listings</h4>
                      <p className="text-muted-foreground text-sm">We manually verify properties before listing</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Direct Connection</h4>
                      <p className="text-muted-foreground text-sm">Connect directly with landlords, no middlemen</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                    alt="Happy tenant with keys to new home"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Testimonial Card */}
                <div className="absolute -bottom-6 -left-6 md:-left-12 bg-card rounded-xl shadow-card p-5 max-w-xs">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm font-medium mb-2">
                    "Found my apartment in just 2 days. Great service!"
                  </p>
                  <p className="text-muted-foreground text-xs">— Sarah, Airport Staff</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section for Landlords */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Are You a Landlord?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              List your property for free and get serious tenants looking to rent in Entebbe. 
              Reach airport staff, professionals, and families searching for homes.
            </p>
            <Link to="/list-property">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                List Your Property Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;
