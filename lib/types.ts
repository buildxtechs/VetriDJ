// Event Management System Types

export type BookingStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'EN_ROUTE'
  | 'SETUP'
  | 'LIVE'
  | 'COMPLETED'
  | 'RECONCILED'
  | 'CANCELLED';

export type UserRole = 'ADMIN' | 'CREW' | 'CLIENT';

export type EventType =
  | 'wedding'
  | 'corporate'
  | 'concert'
  | 'birthday'
  | 'club'
  | 'festival'
  | 'private';

export type ServiceCategory = 'dj' | 'sound' | 'lighting' | 'full-package' | 'fusion';

export type AssetCategory = 'speakers' | 'lights' | 'mixers' | 'cables' | 'effects' | 'other';

export type AssetStatus = 'available' | 'in-use' | 'maintenance' | 'retired';

export type ExpenseCategory = 'travel' | 'food' | 'equipment' | 'fuel' | 'parking' | 'other';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  features: string[];
  image: string;
  popular?: boolean;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  eventEndTime: string;
  venue: string;
  venueAddress: string;
  guestCount: number;
  services: string[];
  status: BookingStatus;
  notes?: string;
  specialRequests?: string;

  // Financial
  baseAmount: number;
  extras: number;
  discount: number;
  tax: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;

  // Reconciliation
  expenses: Expense[];
  crewPayouts: CrewPayout[];
  netProfit?: number;

  // Assignment
  assignedCrew: string[];

  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  specializations?: string[];
  hourlyRate?: number;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  brand?: string;
  model?: string;
  serialNumber?: string;
  quantity: number;
  available: number;
  status: AssetStatus;
  purchaseDate?: string;
  purchasePrice?: number;
  lastServiceDate?: string;
  nextServiceDate?: string;
  notes?: string;
  image?: string;
}

export interface Expense {
  id: string;
  bookingId: string;
  crewId: string;
  crewName: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  receipt?: string;
  status: ExpenseStatus;
  submittedAt: string;
  processedAt?: string;
}

export interface CrewPayout {
  id: string;
  bookingId: string;
  crewId: string;
  crewName: string;
  amount: number;
  hours: number;
  rate: number;
  bonus?: number;
  status: 'pending' | 'paid';
  paidAt?: string;
}

export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface BusinessHours {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export interface ContactInfo {
  phone: string;
  secondaryPhone?: string;
  email: string;
  address: string;
  socialLinks: {
    instagram?: string;
    instagramSecond?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  businessHours?: BusinessHours;
}

export interface BookingInquiry {
  name: string;
  email: string;
  phone: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  venue: string;
  guestCount: number;
  services: string[];
  budget?: string;
  message?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface MembeeChecklist {
  checklist_id: string;
  user_id: string;
  equipment_name: string;
  status: 'PENDING' | 'COMPLETED';
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  invoice_id: string;
  user_id: string;
  amount: number;
  status: 'PAID' | 'UNPAID';
  created_at: string;
  updated_at: string;
}

export interface CustomerStatus {
  status_id: string;
  user_id: string;
  customer_number: string;
  payment_currency: string;
  status_update: string;
  created_at: string;
  updated_at: string;
}
