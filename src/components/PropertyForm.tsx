import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, DollarSign, Upload, CheckCircle, Camera, BedDouble, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { locations } from '@/data/mockListings';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const PropertyForm = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    price: '',
    description: '',
    propertyType: 'apartment',
    title: '',
    bedrooms: '1',
    bathrooms: '1',
    features: ''
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pre-fill phone from profile if user is logged in
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data) {
          setFormData(prev => ({
            ...prev,
            name: data.full_name || '',
            phone: data.phone || ''
          }));
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Allowed image types and max size (5MB)
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      
      // Validate each file
      const validPhotos: File[] = [];
      for (const photo of newPhotos) {
        if (!ALLOWED_IMAGE_TYPES.includes(photo.type)) {
          toast({
            title: "Invalid file type",
            description: `${photo.name} is not a valid image. Please use JPG, PNG, or WebP.`,
            variant: "destructive"
          });
          continue;
        }
        if (photo.size > MAX_FILE_SIZE) {
          toast({
            title: "File too large",
            description: `${photo.name} exceeds 5MB limit.`,
            variant: "destructive"
          });
          continue;
        }
        validPhotos.push(photo);
      }
      
      setPhotos([...photos, ...validPhotos].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (photos.length === 0) return [];

    // Get current session for auth token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload images.",
        variant: "destructive"
      });
      return [];
    }

    // Prepare form data with all photos
    const formData = new FormData();
    for (const photo of photos) {
      formData.append('files', photo);
    }

    try {
      const response = await supabase.functions.invoke('upload-property-image', {
        body: formData,
      });

      if (response.error) {
        toast({
          title: "Upload failed",
          description: "Some images could not be uploaded. Please try again.",
          variant: "destructive"
        });
        return [];
      }

      const data = response.data;
      const uploadedUrls = data.results
        .filter((r: { success: boolean }) => r.success)
        .map((r: { url: string }) => r.url);

      if (data.summary.failed > 0) {
        toast({
          title: "Some uploads failed",
          description: `${data.summary.successful} of ${data.summary.total} images uploaded.`,
          variant: "destructive"
        });
      }

      return uploadedUrls;
    } catch (error) {
      toast({
        title: "Upload error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone.trim() || !formData.location || !formData.price) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // If user is logged in, save to database
    if (user) {
      const title = formData.title.trim() || `${formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1)} in ${formData.location}`;
      const featuresArray = formData.features
        ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
        : [];

      // Upload images to storage
      const imageUrls = await uploadImages();

      const { error } = await supabase.from('properties').insert({
        user_id: user.id,
        title,
        type: formData.propertyType,
        price: parseInt(formData.price),
        location: formData.location,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        description: formData.description,
        features: featuresArray,
        landlord_phone: formData.phone,
        images: imageUrls,
        available: true
      });

      setIsSubmitting(false);

      if (error) {
        toast({
          title: "Failed to list property",
          description: "Please check your details and try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Property Listed!",
        description: "Your property is now live on UrbanNest."
      });
      
      navigate('/dashboard');
      return;
    }

    // If not logged in, send via WhatsApp (legacy flow)
    const message = encodeURIComponent(
      `New Property Listing Request:\n\n` +
      `📋 Type: ${formData.propertyType}\n` +
      `📍 Location: ${formData.location}\n` +
      `💰 Rent: UGX ${formData.price}/month\n` +
      `📝 Description: ${formData.description || 'Not provided'}\n\n` +
      `Landlord Details:\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Photos: ${photos.length} uploaded\n\n` +
      `Please review and list my property.`
    );

    const whatsappUrl = `https://wa.me/256740166778?text=${message}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Property Submitted!",
        description: "We'll review your listing and contact you soon.",
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="bg-success/10 rounded-2xl p-8 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h3 className="font-bold text-2xl text-foreground mb-3">Property Submitted!</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Thank you for listing with us. We'll review your property and contact you within 24 hours to complete the listing.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                phone: '',
                location: '',
                price: '',
                description: '',
                propertyType: 'apartment',
                title: '',
                bedrooms: '1',
                bathrooms: '1',
                features: ''
              });
              setPhotos([]);
            }}
          >
            List Another Property
          </Button>
          <Button onClick={() => navigate('/auth')}>
            Create Account to Manage Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Login prompt for guests */}
      {!user && !authLoading && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-sm text-muted-foreground">
            <button 
              type="button" 
              onClick={() => navigate('/auth')}
              className="text-primary font-semibold hover:underline"
            >
              Login or create an account
            </button>
            {' '}to manage your listings and track enquiries.
          </p>
        </div>
      )}

      {/* Property Type */}
      <div>
        <label className="form-label">Property Type *</label>
        <div className="grid grid-cols-3 gap-3">
          {['room', 'apartment', 'house'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, propertyType: type })}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-all capitalize ${
                formData.propertyType === type
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50 text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Title (for logged-in users) */}
      {user && (
        <div>
          <label htmlFor="property-title" className="form-label">Property Title</label>
          <input
            id="property-title"
            type="text"
            placeholder="e.g., Modern 2-Bedroom Apartment Near Airport"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
          />
          <p className="text-xs text-muted-foreground mt-1">Leave blank to auto-generate</p>
        </div>
      )}

      {/* Name (only for guests) */}
      {!user && (
        <div>
          <label htmlFor="landlord-name" className="form-label">Your Name *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="landlord-name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input pl-12"
              required
            />
          </div>
        </div>
      )}

      {/* Phone */}
      <div>
        <label htmlFor="landlord-phone" className="form-label">Phone Number *</label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="landlord-phone"
            type="tel"
            placeholder="+256 700 000 000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="form-input pl-12"
            required
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="property-location" className="form-label">Property Location *</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <select
            id="property-location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="form-input pl-12 appearance-none cursor-pointer"
            required
          >
            <option value="">Select location</option>
            {locations.filter(l => l !== 'All Locations').map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="rent-price" className="form-label">Monthly Rent (UGX) *</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="rent-price"
            type="number"
            placeholder="e.g., 500000"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="form-input pl-12"
            required
          />
        </div>
      </div>

      {/* Bedrooms & Bathrooms (for logged-in users) */}
      {user && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
            <div className="relative">
              <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                id="bedrooms"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="form-input pl-12 appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
            <div className="relative">
              <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                id="bathrooms"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="form-input pl-12 appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label htmlFor="property-description" className="form-label">Description</label>
        <textarea
          id="property-description"
          placeholder="Describe your property (features, nearby amenities...)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="form-input min-h-[120px] resize-y"
          rows={4}
        />
      </div>

      {/* Features (for logged-in users) */}
      {user && (
        <div>
          <label htmlFor="features" className="form-label">Features (comma separated)</label>
          <input
            id="features"
            type="text"
            placeholder="e.g., Furnished, Water Tank, 24/7 Security, Parking"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            className="form-input"
          />
        </div>
      )}

      {/* Photos */}
      <div>
        <label className="form-label">Property Photos (Up to 5)</label>
        <div className="space-y-3">
          <label className="flex items-center justify-center gap-3 py-8 px-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/30">
            <Camera className="w-6 h-6 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">Click to upload photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Property photo ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            {user ? 'Publish Listing' : 'List My Property'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to let us feature your property on our platform.
      </p>
    </form>
  );
};

export default PropertyForm;
