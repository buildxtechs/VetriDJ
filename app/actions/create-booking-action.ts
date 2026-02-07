'use server';

import sql from '@/db';
import { revalidatePath } from 'next/cache';
import { BookingStatus, EventType } from '@/lib/types';
import { sendCustomerNotification, sendAdminNotification } from '@/lib/email';
import { Booking } from '@/lib/types';

// Helper to map DB row to Booking type (if needed for email)
function mapRowToBooking(row: any): Booking {
    return {
        id: row.id,
        clientName: row.client_name,
        clientEmail: row.client_email,
        clientPhone: row.client_phone,
        eventType: row.event_type,
        eventDate: row.event_date,
        eventTime: row.event_time,
        eventEndTime: row.event_end_time,
        venue: row.venue,
        venueAddress: row.venue_address,
        guestCount: row.guest_count,
        services: row.services,
        status: row.status,
        notes: row.notes,
        specialRequests: row.special_requests,
        baseAmount: row.base_amount || 0,
        extras: row.extras || 0,
        discount: row.discount || 0,
        tax: row.tax || 0,
        totalAmount: row.total_amount || 0,
        advancePaid: row.advance_paid || 0,
        balanceDue: row.balance_due || 0,
        expenses: [],
        crewPayouts: [],
        assignedCrew: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    eventDate: string;
    eventTime: string;
    eventEndTime?: string;
    guestCount?: string;
    venue: string;
    venueAddress: string;
    selectedServices: string[];
    budget?: string; // stored in notes maybe? or separate field if schema allows
    message?: string;
    specialRequests?: string;
}

export async function createBookingAction(formData: BookingFormData) {
    try {
        const bookingData = {
            client_name: formData.name,
            client_email: formData.email,
            client_phone: formData.phone,
            event_type: formData.eventType,
            event_date: formData.eventDate,
            event_time: formData.eventTime,
            event_end_time: formData.eventEndTime,
            venue: formData.venue,
            venue_address: formData.venueAddress,
            guest_count: formData.guestCount ? parseInt(formData.guestCount) : 0,
            status: 'PENDING' as BookingStatus,
            services: sql.json(formData.selectedServices),
            notes: `${formData.budget ? 'Budget Range: ' + formData.budget + '\n' : ''}${formData.message || ''}`,
            special_requests: formData.specialRequests,
            created_at: new Date().toISOString()
        };

        const [newBooking] = await sql`
      INSERT INTO bookings ${sql(bookingData)}
      RETURNING *
    `;

        if (!newBooking) {
            throw new Error('Failed to create booking');
        }

        const booking = mapRowToBooking(newBooking);

        // Send notifications
        try {
            await sendCustomerNotification(booking, 'CONFIRMATION'); // Use confirmation template for received request
            await sendAdminNotification(booking, 'New Booking Request');
        } catch (emailError) {
            console.error('Email Notification Error:', emailError);
        }

        revalidatePath('/admin/bookings');

        return { success: true, bookingId: booking.id };
    } catch (error) {
        console.error('Create Booking Error:', error);
        return { success: false, error: 'Failed to submit booking request.' };
    }
}
