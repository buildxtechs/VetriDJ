'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const galleryImages = [
  {
    src: '/images/gold.jpeg',
    alt: 'Wedding celebration with stunning lighting',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/images/dj-setup-front.png',
    alt: 'DJ setup with hexagon LED panels',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/dj-setup-hex.png',
    alt: 'Stage lighting design',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/dj-setup-lights.png',
    alt: 'LED DJ booth with lights',
    span: 'col-span-1 row-span-2',
  },
  {
    src: '/images/dj-console.png',
    alt: 'Professional DJ equipment',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/studio-session-wide.jpeg',
    alt: 'Production studio',
    span: 'col-span-2 row-span-1',
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Our Work
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4">
            Event{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Gallery
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our portfolio of spectacular events and see the magic we
            create.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative group overflow-hidden rounded-xl ${image.span}`}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm text-foreground font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
