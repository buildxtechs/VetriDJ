'use client';

import Link from 'next/link';
import { sampleBookings, sampleCrew, sampleAssets } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MembeeChecklist } from '@/components/dashboard/checklist';
import { RecentInvoices } from '@/components/dashboard/invoices';
import { WhatsAppButton } from '@/components/dashboard/whatsapp-button';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-500',
  AWAITING_PAYMENT: 'bg-orange-500/20 text-orange-500',
  CONFIRMED: 'bg-blue-500/20 text-blue-500',
  EN_ROUTE: 'bg-cyan-500/20 text-cyan-500',
  SETUP: 'bg-purple-500/20 text-purple-500',
  LIVE: 'bg-green-500/20 text-green-500',
  COMPLETED: 'bg-emerald-500/20 text-emerald-500',
  RECONCILED: 'bg-primary/20 text-primary',
  CANCELLED: 'bg-red-500/20 text-red-500',
};

export default function AdminDashboard() {
  const upcomingBookings = sampleBookings.filter(
    (b) => !['COMPLETED', 'RECONCILED', 'CANCELLED'].includes(b.status)
  );
  const totalRevenue = sampleBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingPayments = sampleBookings.reduce((sum, b) => sum + b.balanceDue, 0);
  const activeCrewCount = sampleCrew.filter((c) => c.status === 'active').length;
  const assetsNeedingService = sampleAssets.filter(
    (a) => a.nextServiceDate && new Date(a.nextServiceDate) <= new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-3xl font-bold text-foreground">
                  {upcomingBookings.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{(totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{(pendingPayments / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Crew</p>
                <p className="text-3xl font-bold text-foreground">
                  {activeCrewCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(assetsNeedingService > 0 ||
        sampleBookings.some((b) => b.status === 'PENDING')) && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Attention Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {assetsNeedingService > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-foreground">
                      {assetsNeedingService} equipment item(s) need service
                    </span>
                  </div>
                  <Link href="/admin/inventory">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              )}
              {sampleBookings.filter((b) => b.status === 'PENDING').length > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-foreground">
                      {sampleBookings.filter((b) => b.status === 'PENDING').length}{' '}
                      new booking request(s) awaiting approval
                    </span>
                  </div>
                  <Link href="/admin/bookings">
                    <Button variant="ghost" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.slice(0, 4).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">
                      {booking.clientName}
                    </p>
                    <Badge className={cn('text-xs', statusColors[booking.status])}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at {booking.eventTime}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {booking.venue}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-primary">
                    ₹{booking.totalAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {booking.eventType}
                  </p>
                </div>
              </div>
            ))}
            {upcomingBookings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming events
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Availability */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Team Members</CardTitle>
            <Link href="/admin/team">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleCrew.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.specializations?.join(', ')}
                    </p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    member.status === 'active'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {member.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/bookings?new=true">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent"
              >
                <Calendar className="w-6 h-6 text-primary" />
                <span>New Booking</span>
              </Button>
            </Link>
            <Link href="/admin/inventory?new=true">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent"
              >
                <Package className="w-6 h-6 text-primary" />
                <span>Add Equipment</span>
              </Button>
            </Link>
            <Link href="/admin/team?new=true">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent"
              >
                <Users className="w-6 h-6 text-primary" />
                <span>Add Team Member</span>
              </Button>
            </Link>
            <Link href="/admin/finance">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col gap-2 bg-transparent"
              >
                <DollarSign className="w-6 h-6 text-primary" />
                <span>View Finances</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      {/* New Widgets Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MembeeChecklist />
        <RecentInvoices />
      </div>

      <div className="flex justify-end">
        <WhatsAppButton label="Share Status via WhatsApp" />
      </div>

    </div>
  );
}
