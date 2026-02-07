'use client';

import Link from 'next/link';
import Image from 'next/image';
import { contactInfo } from '@/lib/data';
import { Instagram, Facebook, Youtube, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="Vetri Events"
                width={60}
                height={60}
                className="object-contain"
              />
              <span className="font-serif text-xl font-bold text-primary">
                VETRI EVENTS
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Premium event production services specializing in sound, lighting, and
              DJ services. Creating unforgettable experiences since 2020.
            </p>
            <div className="flex gap-3">
              {contactInfo.socialLinks.instagram && (
                <a
                  href={contactInfo.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {contactInfo.socialLinks.facebook && (
                <a
                  href={contactInfo.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {contactInfo.socialLinks.youtube && (
                <a
                  href={contactInfo.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Services', 'Process', 'Gallery', 'About', 'Contact'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                'Wedding DJ',
                'Concert Sound',
                'Stage Lighting',
                'Corporate Events',
                'Private Parties',
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/booking"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Buildx. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Build by{' '}
              <a
                href="#"
                className="font-medium hover:text-primary transition-colors"
              >
                Buildx
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              Contact:{' '}
              <a
                href="tel:9025407533"
                className="font-medium hover:text-primary transition-colors"
              >
                9025407533
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
