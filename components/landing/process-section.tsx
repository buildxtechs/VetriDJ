'use client';

import React from "react"

import { processSteps } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Phone,
  FileText,
  CheckCircle,
  Music,
  PartyPopper,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  Phone: <Phone className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  CheckCircle: <CheckCircle className="w-6 h-6" />,
  Music: <Music className="w-6 h-6" />,
  PartyPopper: <PartyPopper className="w-6 h-6" />,
};

export function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Our Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4">
            How We{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Work
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From your first inquiry to the final celebration, we ensure a seamless
            experience at every step.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 hidden lg:block" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={step.id}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Number & Icon */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                    <div className="text-primary">{iconMap[step.icon]}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>

                {/* Arrow for desktop */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-12 text-primary/50">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="animate-pulse"
                    >
                      <path
                        d="M5 12h14m-7-7 7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
