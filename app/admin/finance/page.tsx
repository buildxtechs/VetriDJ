'use client';

import { useState, useEffect } from 'react';
import { Booking, Expense, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  CreditCard,
  FileText,
  Download,
} from 'lucide-react';

export default function FinancePage() {
  const [period, setPeriod] = useState('month');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [crew, setCrew] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Import actions dynamically
      const { fetchFinanceDataAction } = await import('@/app/actions/finance-actions');
      const { fetchCrewAction } = await import('@/app/actions/team-actions');

      const [financeResult, crewResult] = await Promise.all([
        fetchFinanceDataAction(),
        fetchCrewAction()
      ]);

      if (financeResult.success && financeResult.bookings) {
        setBookings(financeResult.bookings);
      }
      if (crewResult.success && crewResult.data) {
        setCrew(crewResult.data);
      }

    } catch (e) {
      console.error("Failed to load finance data", e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const collected = bookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);
  const pending = bookings.reduce((sum, b) => sum + (b.balanceDue || 0), 0);
  const totalExpenses = bookings.reduce(
    (sum, b) => sum + (b.expenses?.reduce((e, exp) => e + exp.amount, 0) || 0),
    0
  );

  // Calculate crew payouts based on assignments
  const crewPayouts = crew.reduce((sum, member) => {
    const eventCount = bookings.filter((b) =>
      b.assignedCrew?.includes(member.id)
    ).length;
    const hours = eventCount * 5; // Assumption: 5 hours per event
    return sum + (hours * (member.hourlyRate || 0));
  }, 0);

  const reconciled = bookings.filter((b) => b.status === 'RECONCILED');
  const netProfit = totalRevenue - totalExpenses - crewPayouts;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Financial Overview</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{(totalRevenue / 1000).toFixed(0)}K
                </p>
                <div className="flex items-center gap-1 mt-1 text-green-500 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collected</p>
                <p className="text-3xl font-bold text-green-500">
                  ₹{(collected / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalRevenue > 0 ? ((collected / totalRevenue) * 100).toFixed(0) : 0}% of total
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-orange-500">
                  ₹{(pending / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {bookings.filter((b) => (b.balanceDue || 0) > 0).length} invoices
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p
                  className={cn(
                    'text-3xl font-bold',
                    netProfit >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  ₹{(netProfit / 1000).toFixed(0)}K
                </p>
                <div
                  className={cn(
                    'flex items-center gap-1 mt-1 text-sm',
                    netProfit >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {netProfit >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(0) : 0}% margin
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="payouts">Crew Payouts</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Invoices</CardTitle>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Generate Invoice
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Invoice #
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Client
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border">
                        <td className="p-3">
                          <span className="font-mono text-sm text-foreground">
                            INV-{booking.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="p-3 text-foreground">
                          {booking.clientName}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(
                            'en-IN'
                          ) : 'N/A'}
                        </td>
                        <td className="p-3 font-semibold text-foreground">
                          ₹{booking.totalAmount?.toLocaleString('en-IN') || 0}
                        </td>
                        <td className="p-3">
                          <Badge
                            className={cn(
                              booking.balanceDue === 0
                                ? 'bg-green-500/20 text-green-500'
                                : (booking.advancePaid || 0) > 0
                                  ? 'bg-yellow-500/20 text-yellow-500'
                                  : 'bg-red-500/20 text-red-500'
                            )}
                          >
                            {booking.balanceDue === 0
                              ? 'Paid'
                              : (booking.advancePaid || 0) > 0
                                ? 'Partial'
                                : 'Unpaid'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No invoices found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Event Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings
                  .filter((b) => b.expenses && b.expenses.length > 0)
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {booking.clientName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.id}
                          </p>
                        </div>
                        <Badge className="bg-primary/20 text-primary">
                          ₹
                          {booking.expenses!
                            .reduce((sum, e) => sum + e.amount, 0)
                            .toLocaleString('en-IN')}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {booking.expenses!.map((expense) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="capitalize text-muted-foreground">
                                {expense.category}
                              </span>
                              <span className="text-foreground">
                                - {expense.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-foreground">
                                ₹{expense.amount.toLocaleString('en-IN')}
                              </span>
                              <Badge
                                className={cn(
                                  'text-xs',
                                  expense.status === 'approved'
                                    ? 'bg-green-500/20 text-green-500'
                                    : expense.status === 'rejected'
                                      ? 'bg-red-500/20 text-red-500'
                                      : 'bg-yellow-500/20 text-yellow-500'
                                )}
                              >
                                {expense.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                {bookings.every((b) => !b.expenses || b.expenses.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No expenses recorded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Crew Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Crew Member
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Events
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Hours
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Rate
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Total
                      </th>
                      <th className="text-left p-3 font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {crew.map((member) => {
                      const eventCount = bookings.filter((b) =>
                        b.assignedCrew?.includes(member.id)
                      ).length;
                      const hours = eventCount * 5; // Simulated
                      const total = hours * (member.hourlyRate || 0);
                      return (
                        <tr key={member.id} className="border-b border-border">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary text-sm font-semibold">
                                  {member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </span>
                              </div>
                              <span className="text-foreground">
                                {member.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {eventCount}
                          </td>
                          <td className="p-3 text-muted-foreground">{hours}h</td>
                          <td className="p-3 text-muted-foreground">
                            ₹{member.hourlyRate}/hr
                          </td>
                          <td className="p-3 font-semibold text-foreground">
                            ₹{total.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3">
                            <Badge className="bg-green-500/20 text-green-500">
                              Paid
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {crew.length === 0 && (
                      <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No crew found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reconciliation Tab */}
        <TabsContent value="reconciliation" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Event Reconciliation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => {
                  const expenses = booking.expenses?.reduce(
                    (sum, e) => sum + e.amount,
                    0
                  ) || 0;
                  const crewCost = (booking.assignedCrew?.length || 0) * 3000; // Simulated
                  const profit = (booking.totalAmount || 0) - expenses - crewCost;
                  return (
                    <div
                      key={booking.id}
                      className="p-6 bg-muted/50 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {booking.clientName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.id.slice(0, 10)}... •{' '}
                            {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(
                              'en-IN'
                            ) : ''}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            booking.status === 'RECONCILED'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {booking.status === 'RECONCILED'
                            ? 'Reconciled'
                            : 'Pending'}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-4 gap-4">
                        <div className="p-3 bg-background rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Revenue
                          </p>
                          <p className="text-lg font-semibold text-green-500">
                            +₹{booking.totalAmount?.toLocaleString('en-IN') || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-background rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Expenses
                          </p>
                          <p className="text-lg font-semibold text-red-500">
                            -₹{expenses.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="p-3 bg-background rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Crew Cost
                          </p>
                          <p className="text-lg font-semibold text-orange-500">
                            -₹{crewCost.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                          <p className="text-sm text-muted-foreground">
                            Net Profit
                          </p>
                          <p
                            className={cn(
                              'text-lg font-bold',
                              profit >= 0 ? 'text-primary' : 'text-red-500'
                            )}
                          >
                            ₹{profit.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {booking.status !== 'RECONCILED' && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground"
                          >
                            Mark as Reconciled
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
