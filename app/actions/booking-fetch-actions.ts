'use server';

import sql from '@/db';
import { Booking } from '@/lib/types';

export async function fetchBookingsAction(): Promise<{ success: boolean; data?: Booking[]; error?: string }> {
    try {
        // Fetch bookings and join with crew assignments
        // Note: crew_assignments needs a left join. 
        // Postgres.js returns array of rows. We can simulate the nested structure or just return flat and map it.
        // For simplicity, let's just get bookings first, and maybe crew IDs.

        // We can use JSON aggregation to get crew_ids
        const rows = await sql`
      SELECT 
        b.*,
        COALESCE(
          (
            SELECT json_agg(ca.crew_id)
            FROM crew_assignments ca
            WHERE ca.booking_id = b.id
          ),
          '[]'::json
        ) as assigned_crew
      FROM bookings b
      ORDER BY b.event_date ASC
    `;

        const bookings: Booking[] = rows.map((row: any) => ({
            id: row.id,
            clientName: row.client_name,
            clientEmail: row.client_email,
            clientPhone: row.client_phone,
            eventType: row.event_type,
            eventDate: row.event_date ? new Date(row.event_date).toISOString() : '', // Date to string
            eventTime: row.event_time,
            eventEndTime: row.event_end_time,
            venue: row.venue,
            venueAddress: row.venue_address,
            guestCount: row.guest_count,
            services: row.services || [],
            status: row.status,
            notes: row.notes,
            specialRequests: row.special_requests,
            baseAmount: Number(row.base_amount),
            extras: Number(row.extras),
            discount: Number(row.discount),
            tax: Number(row.tax),
            totalAmount: Number(row.total_amount),
            advancePaid: Number(row.advance_paid),
            balanceDue: Number(row.balance_due),
            expenses: [], // TODO: Left join expenses if needed
            crewPayouts: [],
            assignedCrew: row.assigned_crew || [],
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));

        // Hack: Date objects from postgres driver might need correct formatting. 
        // toISOString() usually works for Date types.

        return { success: true, data: bookings };
    } catch (error) {
        console.error('Fetch Bookings Error:', error);
        return { success: false, error: String(error) };
    }
}
