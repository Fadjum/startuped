import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { locations, propertyTypes } from '@/data/mockListings';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  onSearch?: (location: string, type: string) => void;
}

const SearchBar = ({ variant = 'hero', onSearch }: SearchBarProps) => {
  const [location, setLocation] = useState('All Locations');
  const [propertyType, setPropertyType] = useState('all');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location !== 'All Locations') params.set('location', location);
    if (propertyType !== 'all') params.set('type', propertyType);
    
    if (onSearch) {
      onSearch(location, propertyType);
    } else {
      navigate(`/listings${params.toString() ? '?' + params.toString() : ''}`);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card rounded-xl shadow-search border border-border">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div className="relative flex-1">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-search p-2 border border-border/50">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Location Select */}
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/50 border-0 text-foreground font-medium focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Property Type Select */}
          <div className="relative flex-1">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/50 border-0 text-foreground font-medium focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 h-auto rounded-xl"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Rentals
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
