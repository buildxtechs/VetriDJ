'use server';

import sql from '@/db';
import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@/lib/types';
import { sendAdminNotification, sendCustomerNotification } from '@/lib/email';
import { Booking } from '@/lib/types';

// Helper to map DB row to Booking type (if needed for email)
// Simplified here, assuming we just need the data for notification
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
        baseAmount: row.base_amount,
        extras: row.extras,
        discount: row.discount,
        tax: row.tax,
        totalAmount: row.total_amount,
        advancePaid: row.advance_paid,
        balanceDue: row.balance_due,
        expenses: [],
        crewPayouts: [],
        assignedCrew: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export async function updateBookingStatusAction(bookingId: string, newStatus: BookingStatus) {
    try {
        const [updatedRow] = await sql`
      UPDATE bookings
      SET status = ${newStatus}, updated_at = NOW()
      WHERE id = ${bookingId}
      RETURNING *
    `;

        if (!updatedRow) {
            throw new Error('Booking not found');
        }

        const booking = mapRowToBooking(updatedRow);

        // 2. Send Notifications
        try {
            if (newStatus === 'CONFIRMED' || newStatus === 'CANCELLED' || newStatus === 'LIVE') {
                await sendCustomerNotification(booking, newStatus === 'CONFIRMED' ? 'CONFIRMATION' : 'UPDATE');
            }

            await sendAdminNotification(booking, `Status changed to ${newStatus}`);
        } catch (emailError) {
            console.error('Error sending emails:', emailError);
        }

        // 3. Revalidate cache
        revalidatePath('/admin/bookings');

        return { success: true, booking };
    } catch (error) {
        console.error('Error updating booking:', error);
        throw new Error('Failed to update booking status');
    }
}
