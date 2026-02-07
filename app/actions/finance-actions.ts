'use server';

import sql from '@/db';
import { Booking, BookingStatus, Expense, ExpenseStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// Mapper for Expense
function mapRowToExpense(row: any): Expense {
    return {
        id: row.id,
        bookingId: row.booking_id,
        amount: Number(row.amount),
        category: row.category,
        description: row.description,
        status: row.status as ExpenseStatus,
        submittedBy: row.crew_id, // assuming crew_id is mapped to submittedBy for simplicity
        receiptUrl: row.receipt_url,
        date: row.submitted_at,
    };
}

// Mapper for Booking (simplified for finance view)
// We need bookings to show invoices
function mapRowToBooking(row: any): Booking {
    return {
        id: row.id,
        clientName: row.client_name,
        clientEmail: row.client_email,
        clientPhone: row.client_phone,
        eventType: row.event_type,
        eventDate: row.event_date ? new Date(row.event_date).toISOString() : '',
        eventTime: row.event_time,
        eventEndTime: row.event_end_time,
        venue: row.venue,
        venueAddress: row.venue_address,
        guestCount: row.guest_count,
        services: row.services || [],
        status: row.status,
        notes: row.notes,
        specialRequests: row.special_requests,
        baseAmount: Number(row.base_amount || 0),
        extras: Number(row.extras || 0),
        discount: Number(row.discount || 0),
        tax: Number(row.tax || 0),
        totalAmount: Number(row.total_amount || 0),
        advancePaid: Number(row.advance_paid || 0),
        balanceDue: Number(row.balance_due || 0),
        expenses: [], // Will be populated separately or via join
        crewPayouts: [],
        assignedCrew: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export async function fetchFinanceDataAction() {
    try {
        // 1. Fetch Bookings (for Invoices & Revenue)
        const bookingRows = await sql`SELECT * FROM bookings ORDER BY event_date DESC`;
        const bookings = bookingRows.map(mapRowToBooking);

        // 2. Fetch Expenses
        const expenseRows = await sql`
        SELECT e.*, b.client_name 
        FROM expenses e 
        LEFT JOIN bookings b ON e.booking_id = b.id 
        ORDER BY e.submitted_at DESC
    `;
        const expenses = expenseRows.map(mapRowToExpense);

        // 3. Populate expenses into bookings for the view
        // Note: The UI expects booking.expenses array
        bookings.forEach(b => {
            b.expenses = expenses.filter(e => e.bookingId === b.id);
        });

        return { success: true, bookings, expenses };
    } catch (error) {
        console.error('Fetch Finance Data Error:', error);
        return { success: false, error: 'Failed to fetch financial data' };
    }
}

export async function addExpenseAction(data: Partial<Expense>) {
    // TODO: Implement if there's a UI for it in admin finance page (currently only mock data showed reading)
    // The current UI page doesn't seem to have "Add Expense" button visible in the code read, 
    // it just lists them.
    return { success: false, error: 'Not implemented' };
}
