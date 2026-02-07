'use client';

import { useState, useEffect } from 'react';
import type { Booking, BookingStatus, Expense, CrewPayout } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Calendar,
  List,
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  ChevronRight,
  Loader2,
} from 'lucide-react';
// import { createClient } from '@/lib/supabase/client';
import { updateBookingStatusAction } from '@/app/actions/booking-actions';
import { toast } from 'sonner';
import { services } from '@/lib/data';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  AWAITING_PAYMENT: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  CONFIRMED: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  EN_ROUTE: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
  SETUP: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  LIVE: 'bg-green-500/20 text-green-500 border-green-500/30',
  COMPLETED: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
  RECONCILED: 'bg-primary/20 text-primary border-primary/30',
  CANCELLED: 'bg-red-500/20 text-red-500 border-red-500/30',
};

const statusFlow: BookingStatus[] = [
  'PENDING',
  'AWAITING_PAYMENT',
  'CONFIRMED',
  'EN_ROUTE',
  'SETUP',
  'LIVE',
  'COMPLETED',
  'RECONCILED',
];

// Transformer to convert DB row to Booking type
const transformBooking = (row: any): Booking => ({
  id: row.id,
  clientName: row.client_name,
  clientEmail: row.client_email,
  clientPhone: row.client_phone,
  eventType: row.event_type as any,
  eventDate: row.event_date,
  eventTime: row.event_time,
  eventEndTime: row.event_end_time,
  venue: row.venue,
  venueAddress: row.venue_address,
  guestCount: row.guest_count,
  services: row.services || [],
  status: row.status as BookingStatus,
  notes: row.notes,
  specialRequests: row.special_requests,
  baseAmount: row.base_amount,
  extras: row.extras,
  discount: row.discount,
  tax: row.tax,
  totalAmount: row.total_amount,
  advancePaid: row.advance_paid,
  balanceDue: row.balance_due,
  expenses: row.expenses || [], // requires join
  crewPayouts: [], // requires join
  assignedCrew: row.crew_assignments ? row.crew_assignments.map((ca: any) => ca.crew_id) : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [updating, setUpdating] = useState(false);

  // const supabase = createClient();

  // const [seeding, setSeeding] = useState(false); // Kept state

  // Realtime disabled for Postgres migration
  /*
  useEffect(() => {
    fetchBookings();
    const channel = supabase.channel('bookings_realtime')...
  }, []);
  */

  useEffect(() => {
    fetchBookings();
  }, []);

  const [seeding, setSeeding] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { fetchBookingsAction } = await import('@/app/actions/booking-fetch-actions');
      const result = await fetchBookingsAction();

      if (result.success && result.data) {
        setBookings(result.data);
      } else {
        console.error('Fetch error:', result.error);
        toast.error('Failed to fetch bookings: ' + result.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const { seedDatabaseAction } = await import('@/app/actions/seed-actions');
      const result = await seedDatabaseAction();
      if (result.success) {
        toast.success(`Database seeded with ${result.count} bookings!`);
        fetchBookings();
      } else {
        toast.error(`Seed failed: ${result.error}`);
      }
    } catch (e) {
      toast.error('Seed failed');
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    setUpdating(true);
    try {
      const result = await updateBookingStatusAction(bookingId, newStatus);
      if (result.success) {
        toast.success(`Booking marked as ${newStatus}`);
        // Realtime subscription will handle the UI update, but we can also update locally immediately
        if (selectedBooking) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (currentStatus: BookingStatus): BookingStatus | null => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  // Calendar view helpers
  const getCalendarDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredBookings.filter((b) => b.eventDate === dateStr);
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seeding || loading}
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : '🌱'}
            {seeding ? 'Seeding...' : 'Seed Data'}
          </Button>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusFlow.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              className={cn(
                'p-2 transition-colors',
                viewMode === 'calendar'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Booking ID
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Client
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Event Date
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Venue
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-border hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="p-4">
                        <span className="font-mono text-sm text-foreground">
                          {booking.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {booking.clientName}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {booking.eventType}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-foreground">
                            {new Date(booking.eventDate).toLocaleDateString(
                              'en-IN',
                              {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.eventTime}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-foreground truncate max-w-[200px]">
                          {booking.venue}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-primary">
                          ₹{booking.totalAmount?.toLocaleString('en-IN') || 0}
                        </p>
                        {booking.balanceDue > 0 && (
                          <p className="text-xs text-orange-500">
                            Due: ₹{booking.balanceDue.toLocaleString('en-IN')}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          className={cn('border', statusColors[booking.status])}
                        >
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No bookings found matching your criteria.
                  <br />
                  <span className="text-xs">Ensured database has data?</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Upcoming 2 Weeks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground p-2"
                >
                  {day}
                </div>
              ))}
              {getCalendarDays().map((date, index) => {
                const dayBookings = getBookingsForDate(date);
                const isToday =
                  date.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={index}
                    className={cn(
                      'min-h-[100px] p-2 border border-border rounded-lg',
                      isToday && 'border-primary bg-primary/5'
                    )}
                  >
                    <div
                      className={cn(
                        'text-sm font-medium mb-2',
                        isToday ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className={cn(
                            'text-xs p-1 rounded cursor-pointer truncate',
                            statusColors[booking.status]
                          )}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          {booking.clientName.split(' ')[0]}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Detail Modal */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl">
                      {selectedBooking.clientName}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedBooking.id} •{' '}
                      <span className="capitalize">
                        {selectedBooking.eventType}
                      </span>
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'border text-sm',
                      statusColors[selectedBooking.status]
                    )}
                  >
                    {selectedBooking.status.replace('_', ' ')}
                  </Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="crew">Crew</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Event Date
                          </p>
                          <p className="font-medium text-foreground">
                            {new Date(
                              selectedBooking.eventDate
                            ).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-medium text-foreground">
                            {selectedBooking.eventTime} -{' '}
                            {selectedBooking.eventEndTime || 'TBD'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Venue</p>
                          <p className="font-medium text-foreground">
                            {selectedBooking.venue}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedBooking.venueAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Expected Guests
                          </p>
                          <p className="font-medium text-foreground">
                            {selectedBooking.guestCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">
                            {selectedBooking.clientPhone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">
                            {selectedBooking.clientEmail}
                          </p>
                        </div>
                      </div>

                      {selectedBooking.notes && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Notes
                          </p>
                          <p className="text-foreground">
                            {selectedBooking.notes}
                          </p>
                        </div>
                      )}

                      {selectedBooking.specialRequests && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Special Requests
                          </p>
                          <p className="text-foreground">
                            {selectedBooking.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    {selectedBooking.services && selectedBooking.services.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId);
                      return service ? (
                        <div
                          key={serviceId}
                          className="flex items-center justify-between p-4 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {service.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {service.features.slice(0, 2).join(', ')}
                            </p>
                          </div>
                          <p className="font-semibold text-primary">
                            ₹{service.basePrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="crew" className="space-y-4 mt-4">
                  {/* Crew assignment logic requires joining profiles. For now showing placeholder if IDs exist */}
                  {selectedBooking.assignedCrew?.length > 0 ? (
                    <div className="space-y-3">
                      <p>Crew IDs: {selectedBooking.assignedCrew.join(', ')}</p>
                      <p className="text-xs text-muted-foreground">Crew details fetching to be implemented.</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No crew assigned yet
                      </p>
                      <Button variant="outline">Assign Crew</Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="finance" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Base Amount</span>
                      <span className="font-medium text-foreground">
                        ₹{selectedBooking.baseAmount?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Extras</span>
                      <span className="font-medium text-foreground">
                        + ₹{selectedBooking.extras?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium text-green-500">
                        - ₹{selectedBooking.discount?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium text-foreground">
                        + ₹{selectedBooking.tax?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-primary/10 rounded-lg border border-primary/30">
                      <span className="font-semibold text-foreground">
                        Total Amount
                      </span>
                      <span className="font-bold text-primary text-lg">
                        ₹{selectedBooking.totalAmount?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-3 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                          Advance Paid
                        </p>
                        <p className="font-semibold text-green-500">
                          ₹{selectedBooking.advancePaid?.toLocaleString('en-IN') || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                          Balance Due
                        </p>
                        <p className="font-semibold text-orange-500">
                          ₹{selectedBooking.balanceDue?.toLocaleString('en-IN') || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Status Update */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Update Status
                    </p>
                    <Select
                      value={selectedBooking.status}
                      disabled={updating}
                      onValueChange={(value) =>
                        handleStatusUpdate(
                          selectedBooking.id,
                          value as BookingStatus
                        )
                      }
                    >
                      <SelectTrigger className="w-[200px] mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusFlow.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace('_', ' ')}
                          </SelectItem>
                        ))}
                        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {getNextStatus(selectedBooking.status) && (
                    <Button
                      className="bg-primary text-primary-foreground"
                      disabled={updating}
                      onClick={() =>
                        handleStatusUpdate(
                          selectedBooking.id,
                          getNextStatus(selectedBooking.status)!
                        )
                      }
                    >
                      {updating ? 'Updating...' : `Move to ${getNextStatus(selectedBooking.status)?.replace('_', ' ')}`}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
