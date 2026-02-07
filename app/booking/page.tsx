'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookingForm } from '@/components/booking/booking-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone } from 'lucide-react';
import { contactInfo } from '@/lib/data';

export default function BookingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
            Booking Request Submitted!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your interest in Vetri Events. Our team will review your
            request and contact you within 24 hours to discuss the details.
          </p>
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-primary text-primary-foreground">
                Return to Home
              </Button>
            </Link>
            <a href={`tel:${contactInfo.phone}`}>
              <Button variant="outline" className="w-full bg-transparent">
                <Phone className="w-4 h-4 mr-2" />
                Call Us: {contactInfo.phone}
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Vetri Events"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-serif font-bold text-primary hidden sm:block">
              VETRI EVENTS
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Book Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Event
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below to request a booking. Our team will review
              your requirements and get back to you with a customized proposal.
            </p>
          </div>

          <BookingForm onSuccess={() => setIsSubmitted(true)} />
        </div>
      </main>
    </div>
  );
}
