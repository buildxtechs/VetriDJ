'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { MembeeChecklist } from '@/components/dashboard/checklist';
import { WhatsAppButton } from '@/components/dashboard/whatsapp-button';

export default function CrewDashboard() {
  const [currentDate] = useState(new Date());
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    eventsThisMonth: 0,
    hoursWorked: 0,
    pendingExpenses: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  // const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const { data: { user } } = await supabase.auth.getUser();
        const user = { id: 'dummy-user-id' }; // Mock user for now since auth is disabled

        if (!user) {
          console.log('No user logged in');
          setLoading(false);
          return; // In production, maybe redirect or use a demo ID
        }

        // Use Server Action
        const { fetchCrewDashboardDataAction } = await import('@/app/actions/crew-actions');
        // We pass the UUID. If no user, we might want to pass a test ID for dev if local auth is tricky
        // But assuming auth works:
        const result = await fetchCrewDashboardDataAction(user.id);

        if (result.success && result.data) {
          setUpcomingEvents(result.data.upcomingEvents);
          setStats(result.data.stats);
        } else {
          // Fallback or error handling
          console.error(result.error);
        }

      } catch (error) {
        console.error('Error fetching crew data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Events This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hours Worked
            </CardTitle>
            <Clock className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursWorked}h</div>
            <Progress value={45} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Expenses
            </CardTitle>
            <FileText className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingExpenses}</div>
            <p className="text-xs text-muted-foreground">Claims under review</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Earnings (MTD)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-green-500">Estimated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/crew/schedule">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium truncate">{event.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.date} | {event.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          event.status === "CONFIRMED" ? "default" : "secondary"
                        }
                        className={
                          event.status === "CONFIRMED"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : ""
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.venue}
                      </span>
                      <span className="text-gold">{event.role}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No upcoming events assigned.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                <Link href="/crew/timesheets">
                  <Clock className="h-5 w-5 text-gold" />
                  <span>Log Hours</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" asChild>
                <Link href="/crew/expenses?new=true">
                  <DollarSign className="h-5 w-5 text-gold" />
                  <span>Submit Expense</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <MembeeChecklist />
        {/* Placeholder for other crew specific widgets */}
      </div>

      <div className="flex justify-end">
        <WhatsAppButton />
      </div>

    </div>
  );
}
