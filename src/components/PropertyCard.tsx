import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, ArrowRight } from 'lucide-react';
import { Property, formatPrice } from '@/data/mockListings';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const typeLabels = {
    room: 'Room',
    apartment: 'Apartment',
    house: 'House'
  };

  return (
    <Link to={`/listings/${property.id}`} className="block group">
      <article className="property-card h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-foreground font-medium">
              {typeLabels[property.type]}
            </Badge>
          </div>
          {property.available && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-success text-success-foreground">
                Available
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Price */}
          <div className="mb-2">
            <span className="price-tag">UGX {formatPrice(property.price)}</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          </div>

          {/* View Details */}
          <div className="mt-auto pt-4 border-t border-border">
            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
              View Details
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PropertyCard;
