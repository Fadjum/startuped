import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyForm from '@/components/PropertyForm';

const ListProperty = () => {
  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-primary py-12 md:py-20">
          <div className="container-custom">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                List Your Property
              </h1>
              <p className="text-lg text-primary-foreground/80">
                Get serious tenants looking to rent through UrbanNest. Airport staff, professionals, 
                and families are actively searching for homes like yours.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Benefits */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Why List With Us?
                </h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Reach Serious Tenants</h3>
                      <p className="text-muted-foreground text-sm">
                        Connect with airport staff, business travelers, and families actively searching for homes in Entebbe.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Free to List</h3>
                      <p className="text-muted-foreground text-sm">
                        No upfront fees. List your property for free and only pay when you find a tenant (optional featured placement available).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Local Expertise</h3>
                      <p className="text-muted-foreground text-sm">
                        We focus exclusively on Entebbe, so your listing reaches the right audience.
                      </p>
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <div className="mt-10 p-6 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-4">How It Works</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                        1
                      </span>
                      <span className="text-muted-foreground text-sm">Submit your property details using the form</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                        2
                      </span>
                      <span className="text-muted-foreground text-sm">We review and publish your listing within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                        3
                      </span>
                      <span className="text-muted-foreground text-sm">Interested tenants contact you directly via phone or WhatsApp</span>
                    </li>
                  </ol>
                </div>

                {/* Contact Info */}
                <div className="mt-6 p-4 border border-border rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    Questions? Contact us:
                  </p>
                  <p className="font-medium text-foreground mt-1">
                    +256 740 166 778 / +256 769 616 091
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card">
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    Property Details
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Fill in the details below and we'll get your property listed.
                  </p>
                  <PropertyForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ListProperty;
