import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg text-background">Entebbe</span>
                <span className="font-bold text-lg text-primary">Rentals</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Connecting tenants and landlords in Entebbe, Uganda. Find your perfect rental home near Lake Victoria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/listings" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Browse Rentals
                </Link>
              </li>
              <li>
                <Link to="/list-property" className="text-background/70 hover:text-primary transition-colors text-sm">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/listings?type=room" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Rooms for Rent
                </Link>
              </li>
              <li>
                <Link to="/listings?type=apartment" className="text-background/70 hover:text-primary transition-colors text-sm">
                  Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="font-semibold text-background mb-4">Popular Areas</h4>
            <ul className="space-y-3">
              <li className="text-background/70 text-sm">Entebbe Town</li>
              <li className="text-background/70 text-sm">Kitooro</li>
              <li className="text-background/70 text-sm">Abaita Ababiri</li>
              <li className="text-background/70 text-sm">Nakiwogo</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+256740166778" className="hover:text-primary transition-colors">
                  +256 740 166 778
                </a>
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <MessageCircle className="w-4 h-4 text-primary" />
                <a 
                  href="https://wa.me/256740166778" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Entebbe, Uganda</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">
              © {new Date().getFullYear()} Entebbe Rentals. All rights reserved.
            </p>
            <p className="text-background/50 text-xs">
              We connect you to landlords. Availability may vary.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
