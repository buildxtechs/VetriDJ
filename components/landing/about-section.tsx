'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Users, Calendar, Headphones } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Premium Equipment',
    description: 'Industry-leading sound systems and lighting from top brands.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Skilled DJs, sound engineers, and lighting designers.',
  },
  {
    icon: Calendar,
    title: '500+ Events',
    description: 'Successfully executed events across all scales and types.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support before, during, and after your event.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/team.jpeg"
                alt="Vetri Events Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-6 shadow-xl max-w-[250px]">
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">
                Years of creating unforgettable experiences
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              About Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6">
              We Create{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Experiences
              </span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Vetri Events is a premier event production company specializing in
              sound, lighting, and DJ services. Since 2020, we have been
              transforming ordinary events into extraordinary celebrations.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our team of passionate professionals combines technical expertise with
              creative vision to deliver flawless event experiences. From intimate
              gatherings to grand festivals, we bring the perfect blend of sound and
              light to every occasion.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/booking">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
