import type { Booking, UserRole } from './types';
import { contactInfo } from './data';

// Mock Email Service
// In a real app, use Resend, SendGrid, or AWS SES

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

async function sendEmail(payload: EmailPayload) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`[EMAIL SENT] To: ${payload.to} | Subject: ${payload.subject}`);
    // In development, we just log it.
    // In production, you would call your email provider API here.
}

export async function sendCustomerNotification(booking: Booking, type: 'CONFIRMATION' | 'UPDATE') {
    const subject = type === 'CONFIRMATION'
        ? `Booking Confirmed: ${booking.eventType} on ${booking.eventDate}`
        : `Update on your Booking: ${booking.id}`;

    const html = `
    <h1>Hello ${booking.clientName},</h1>
    <p>We have an update regarding your booking with Vetri DJ Events.</p>
    <p><strong>Status:</strong> ${booking.status}</p>
    <p><strong>Date:</strong> ${booking.eventDate} at ${booking.eventTime}</p>
    <p><strong>Venue:</strong> ${booking.venue}</p>
    <br/>
    <p>If you have any questions, contact us at ${contactInfo.phone}.</p>
    <br/>
    <p>Best regards,<br/>Vetri DJ Team</p>
  `;

    await sendEmail({
        to: booking.clientEmail,
        subject,
        html,
    });

    // Also notify admin
    await sendAdminNotification(booking, `Customer Notification Sent: ${type}`);
}

export async function sendAdminNotification(booking: Booking, context: string) {
    const adminEmail = 'admin@vetridj.com'; // Replace with actual admin email

    const subject = `[ADMIN] Booking Update: ${booking.id} (${context})`;

    const html = `
    <h2>Booking Update</h2>
    <p><strong>Client:</strong> ${booking.clientName}</p>
    <p><strong>Status:</strong> ${booking.status}</p>
    <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
    <p><strong>Context:</strong> ${context}</p>
  `;

    await sendEmail({
        to: adminEmail,
        subject,
        html,
    });
}

export async function sendCrewNotification(booking: Booking, assignedCrewEmails: string[]) {
    if (assignedCrewEmails.length === 0) return;

    const subject = `New Assignment: ${booking.eventType} on ${booking.eventDate}`;

    // NOTE: Financial data is EXCLUDED for crew
    const html = `
    <h1>New Event Assignment</h1>
    <p>You have been assigned to an event.</p>
    <p><strong>Event:</strong> ${booking.eventType}</p>
    <p><strong>Date:</strong> ${booking.eventDate}</p>
    <p><strong>Time:</strong> ${booking.eventTime} - ${booking.eventEndTime}</p>
    <p><strong>Venue:</strong> ${booking.venue}</p>
    <p><strong>Address:</strong> ${booking.venueAddress}</p>
    <p><strong>Notes:</strong> ${booking.notes || 'None'}</p>
    <br/>
    <p>Please check your portal for more details.</p>
  `;

    for (const email of assignedCrewEmails) {
        await sendEmail({
            to: email,
            subject,
            html,
        });
    }
}
