import { useState } from 'react';
import { User, Phone, MapPin, DollarSign, Upload, CheckCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { locations } from '@/data/mockListings';

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    price: '',
    description: '',
    propertyType: 'apartment'
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.location || !formData.price) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Create WhatsApp message
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
              propertyType: 'apartment'
            });
            setPhotos([]);
          }}
        >
          List Another Property
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Name */}
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

      {/* Description */}
      <div>
        <label htmlFor="property-description" className="form-label">Description (Optional)</label>
        <textarea
          id="property-description"
          placeholder="Describe your property (bedrooms, bathrooms, features...)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="form-input min-h-[120px] resize-y"
          rows={4}
        />
      </div>

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
            List My Property
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
