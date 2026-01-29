import { useState } from 'react';
import { User, Phone, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Property } from '@/data/mockListings';
import { toast } from '@/hooks/use-toast';

interface EnquiryFormProps {
  property: Property;
}

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
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Name and phone number are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Create message for WhatsApp
    const message = encodeURIComponent(
      `Hi, I'm interested in your property:\n\n` +
      `📍 ${property.title}\n` +
      `💰 UGX ${property.price.toLocaleString()}/month\n` +
      `📌 ${property.location}\n\n` +
      `My details:\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n\n` +
      `Please contact me about this property.`
    );

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/256740166778?text=${message}`;
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      if (formData.useWhatsApp) {
        window.open(whatsappUrl, '_blank');
      }

      toast({
        title: "Enquiry Sent!",
        description: "The landlord will contact you soon.",
      });
    }, 1000);
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
