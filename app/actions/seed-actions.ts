'use server';

import sql from '@/db';
import { sampleBookings } from '@/lib/data';

export async function seedDatabaseAction() {
    try {
        // 2. Seed Bookings
        const bookingInserts = sampleBookings.map(b => ({
            client_name: b.clientName,
            client_email: b.clientEmail,
            client_phone: b.clientPhone,
            event_type: b.eventType,
            event_date: b.eventDate,
            event_time: b.eventTime,
            event_end_time: b.eventEndTime,
            venue: b.venue,
            venue_address: b.venueAddress,
            guest_count: b.guestCount,
            status: b.status,
            notes: b.notes,
            special_requests: b.specialRequests,
            base_amount: b.baseAmount,
            extras: b.extras,
            discount: b.discount,
            tax: b.tax,
            total_amount: b.totalAmount,
            advance_paid: b.advancePaid,
            services: sql.json(b.services), // Use sql.json for JSONB
        }));

        // Perform insert using postgres.js
        const data = await sql`
      INSERT INTO bookings ${sql(bookingInserts)}
      RETURNING *
    `;

        return { success: true, count: data.length };
    } catch (e) {
        console.error('Seed Exception:', e);
        return { success: false, error: String(e) };
    }
}
