import { useState } from 'react';
import { User, Phone, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Property } from '@/data/mockListings';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnquiryFormProps {
  property: Property;
}

// Validation helpers
const validateName = (name: string): string | null => {
  const trimmed = name.trim();
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 100) return 'Name must be 100 characters or less';
  return null;
};

const validatePhone = (phone: string): string | null => {
  const trimmed = phone.trim();
  if (trimmed.length < 10) return 'Phone number must be at least 10 characters';
  if (trimmed.length > 20) return 'Phone number must be 20 characters or less';
  if (!/^[0-9+\-\s()]+$/.test(trimmed)) return 'Phone number contains invalid characters';
  return null;
};

const EnquiryForm = ({ property }: EnquiryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    useWhatsApp: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const nameError = validateName(formData.name);
    if (nameError) {
      toast({
        title: "Invalid name",
        description: nameError,
        variant: "destructive"
      });
      return;
    }

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      toast({
        title: "Invalid phone number",
        description: phoneError,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Submit enquiry to database using the validated function
    const { error } = await supabase.rpc('submit_enquiry', {
      p_property_id: property.id,
      p_name: formData.name.trim(),
      p_phone: formData.phone.trim(),
      p_message: null,
      p_whatsapp: formData.useWhatsApp
    });

    if (error) {
      setIsSubmitting(false);
      toast({
        title: "Unable to submit enquiry",
        description: "Please check your details and try again.",
        variant: "destructive"
      });
      return;
    }

    // Create message for WhatsApp
    const message = encodeURIComponent(
      `Hi, I'm interested in your property:\n\n` +
      `📍 ${property.title}\n` +
      `💰 UGX ${property.price.toLocaleString()}/month\n` +
      `📌 ${property.location}\n\n` +
      `My details:\n` +
      `Name: ${formData.name.trim()}\n` +
      `Phone: ${formData.phone.trim()}\n\n` +
      `Please contact me about this property.`
    );

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/256740166778?text=${message}`;
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    if (formData.useWhatsApp) {
      window.open(whatsappUrl, '_blank');
    }

    toast({
      title: "Enquiry Sent!",
      description: "The landlord will contact you soon.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="bg-success/10 rounded-xl p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Enquiry Sent!</h3>
        <p className="text-muted-foreground text-sm mb-4">
          The landlord will contact you soon about this property.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSubmitted(false)}
          className="text-sm"
        >
          Send Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="form-label">
          Your Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input pl-12"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="form-label">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="phone"
            type="tel"
            placeholder="+256 700 000 000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="form-input pl-12"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-3 py-2">
        <Checkbox
          id="whatsapp"
          checked={formData.useWhatsApp}
          onCheckedChange={(checked) => setFormData({ ...formData, useWhatsApp: checked as boolean })}
        />
        <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <MessageCircle className="w-4 h-4 text-success" />
          Contact me via WhatsApp
        </label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            I'm Interested in This Property
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center pt-2">
        We connect you to landlords. Availability may vary.
      </p>
    </form>
  );
};

export default EnquiryForm;
