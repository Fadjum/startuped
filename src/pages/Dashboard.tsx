import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Home, Users, Eye, Trash2, Loader2 } from 'lucide-react';
import { formatPrice } from '@/data/mockListings';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  available: boolean;
  created_at: string;
}

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  whatsapp: boolean;
  created_at: string;
  property_id: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch user's properties
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (propertiesError) {
      console.error('Error fetching properties:', propertiesError);
    } else {
      setProperties(propertiesData || []);
    }

    // Fetch enquiries for user's properties
    const { data: enquiriesData, error: enquiriesError } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (enquiriesError) {
      console.error('Error fetching enquiries:', enquiriesError);
    } else {
      setEnquiries(enquiriesData || []);
    }

    setLoading(false);
  };

  const deleteProperty = async (propertyId: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property. Please try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Property Deleted',
        description: 'Your property listing has been removed.'
      });
      fetchData();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
            <p className="text-muted-foreground">Manage your property listings and view enquiries</p>
          </div>
          <Button asChild>
            <Link to="/list-property">
              <Plus className="mr-2 h-4 w-4" />
              Add New Property
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enquiries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.filter(p => p.available).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>Manage your rental listings</CardDescription>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-8">
                <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
                <Button asChild>
                  <Link to="/list-property">List Your First Property</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{property.title}</h3>
                        <Badge variant={property.available ? 'default' : 'secondary'}>
                          {property.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {property.location} • UGX {formatPrice(property.price)}/month
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/listings/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProperty(property.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
            <CardDescription>People interested in your properties</CardDescription>
          </CardHeader>
          <CardContent>
            {enquiries.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No enquiries yet. They'll appear here when tenants show interest.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-4"
                  >
                    <div>
                      <h3 className="font-semibold">{enquiry.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {enquiry.phone} {enquiry.whatsapp && '• WhatsApp'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {enquiry.whatsapp && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const message = `Hello! I saw your enquiry on Entebbe Rentals.`;
                          window.open(`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        Contact on WhatsApp
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
