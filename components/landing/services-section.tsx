'use client';

import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4">
            Premium Event{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Solutions
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we offer comprehensive
            event production services tailored to your vision.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                </div>
              )}

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-card-foreground">
                    {service.name}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-sm text-primary">
                      +{service.features.length - 3} more features
                    </li>
                  )}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-muted-foreground">Starting at</span>
                    <div className="text-2xl font-bold text-primary">
                      ₹{service.basePrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <Link href={`/booking?service=${service.id}`}>
                    <Button variant="outline" size="sm" className="group/btn bg-transparent">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom package? We create tailored solutions for your unique event.
          </p>
          <Link href="/booking">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Get Custom Quote
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
