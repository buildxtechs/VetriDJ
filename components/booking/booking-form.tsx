'use client';

import { useState } from 'react';
import { services } from '@/lib/data';
import type { EventType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  User,
  Calendar,
  MapPin,
  Package,
  MessageSquare,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface BookingFormProps {
  onSuccess: () => void;
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Event Details', icon: Calendar },
  { id: 3, title: 'Venue', icon: MapPin },
  { id: 4, title: 'Services', icon: Package },
  { id: 5, title: 'Additional Info', icon: MessageSquare },
];

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'concert', label: 'Concert' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'club', label: 'Club Night' },
  { value: 'festival', label: 'Festival' },
  { value: 'private', label: 'Private Party' },
];

const budgetRanges = [
  'Under ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,00,000',
  'Above ₹2,00,000',
];

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '' as EventType | '',
    eventDate: '',
    eventTime: '',
    eventEndTime: '',
    guestCount: '',
    venue: '',
    venueAddress: '',
    selectedServices: [] as string[],
    budget: '',
    message: '',
    specialRequests: '',
  });

  const updateField = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.eventType && formData.eventDate && formData.eventTime;
      case 3:
        return formData.venue && formData.venueAddress;
      case 4:
        return formData.selectedServices.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { createBookingAction } = await import('@/app/actions/create-booking-action');
      const result = await createBookingAction(formData);

      if (result.success) {
        onSuccess();
      } else {
        console.error(result.error);
        // Assuming we might add toast later, for now just relying on error log or UI feedback
        alert('Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Submission failed', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Progress Steps */}
      <div className="bg-muted/50 border-b border-border p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : step.id < currentStep
                      ? 'bg-primary/20 text-primary cursor-pointer'
                      : 'bg-muted text-muted-foreground'
                )}
                disabled={step.id > currentStep}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium hidden sm:block">
                  {step.title}
                </span>
                <span className="text-sm font-medium sm:hidden">{step.id}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 h-0.5 mx-2',
                    step.id < currentStep ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8">
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Personal Information
              </h2>
              <p className="text-muted-foreground">
                Please provide your contact details so we can reach you.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Event Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Event Details
              </h2>
              <p className="text-muted-foreground">
                Tell us about your event and when it will take place.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <Label>Event Type *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => updateField('eventType', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => updateField('eventDate', e.target.value)}
                  className="mt-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="guestCount">Expected Guests</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => updateField('guestCount', e.target.value)}
                  placeholder="e.g., 200"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="eventTime">Start Time *</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => updateField('eventTime', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="eventEndTime">End Time</Label>
                <Input
                  id="eventEndTime"
                  type="time"
                  value={formData.eventEndTime}
                  onChange={(e) => updateField('eventEndTime', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Venue */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Venue Information
              </h2>
              <p className="text-muted-foreground">
                Where will your event be held?
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="venue">Venue Name *</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => updateField('venue', e.target.value)}
                  placeholder="e.g., The Grand Hotel Ballroom"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="venueAddress">Full Address *</Label>
                <Textarea
                  id="venueAddress"
                  value={formData.venueAddress}
                  onChange={(e) => updateField('venueAddress', e.target.value)}
                  placeholder="Enter the complete address with landmarks"
                  rows={3}
                  className="mt-2 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Services */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Select Services
              </h2>
              <p className="text-muted-foreground">
                Choose the services you need for your event. You can select
                multiple.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={cn(
                    'relative border rounded-xl p-4 cursor-pointer transition-all',
                    formData.selectedServices.includes(service.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={formData.selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {service.name}
                        </h3>
                        {service.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {service.description}
                      </p>
                      <p className="text-primary font-semibold">
                        From ₹{service.basePrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Label>Budget Range</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => updateField('budget', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 5: Additional Info */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Additional Information
              </h2>
              <p className="text-muted-foreground">
                Share any specific requirements or preferences you have.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="message">Tell us more about your event</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Describe your event, theme, mood you want to create..."
                  rows={4}
                  className="mt-2 resize-none"
                />
              </div>
              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => updateField('specialRequests', e.target.value)}
                  placeholder="Any specific songs, lighting effects, or other requirements..."
                  rows={3}
                  className="mt-2 resize-none"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Booking Summary
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Name:</dt>
                  <dd className="text-foreground">{formData.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Event Type:</dt>
                  <dd className="text-foreground capitalize">
                    {formData.eventType}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date:</dt>
                  <dd className="text-foreground">{formData.eventDate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Venue:</dt>
                  <dd className="text-foreground">{formData.venue}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Services:</dt>
                  <dd className="text-foreground">
                    {formData.selectedServices.length} selected
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceed()}
              className="bg-primary text-primary-foreground"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground"
            >
              Submit Booking Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
