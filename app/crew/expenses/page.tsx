"use client";

import { useState } from "react";
import {
  DollarSign,
  Plus,
  Upload,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  Receipt,
  Calendar,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  eventName?: string;
  status: "pending" | "approved" | "rejected";
  receipt?: string;
  notes?: string;
}

const expenses: Expense[] = [
  {
    id: "1",
    description: "XLR Cables (2x)",
    category: "Equipment",
    amount: 45,
    date: "2026-02-01",
    eventName: "Johnson Wedding",
    status: "approved",
    receipt: "receipt-001.pdf",
  },
  {
    id: "2",
    description: "Parking - Johnson Event",
    category: "Travel",
    amount: 25,
    date: "2026-02-02",
    eventName: "Johnson Wedding",
    status: "pending",
    receipt: "receipt-002.jpg",
  },
  {
    id: "3",
    description: "Equipment Case",
    category: "Equipment",
    amount: 120,
    date: "2026-01-28",
    status: "approved",
    receipt: "receipt-003.pdf",
  },
  {
    id: "4",
    description: "Fuel - TechCorp Event",
    category: "Travel",
    amount: 55,
    date: "2026-01-25",
    eventName: "TechCorp Gala",
    status: "approved",
  },
  {
    id: "5",
    description: "USB Drive",
    category: "Supplies",
    amount: 30,
    date: "2026-01-20",
    status: "rejected",
    notes: "Personal use items not covered",
  },
];

const categories = [
  "Equipment",
  "Travel",
  "Supplies",
  "Food & Meals",
  "Accommodation",
  "Other",
];

export default function CrewExpenses() {
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "",
    amount: "",
    date: "",
    eventName: "",
    notes: "",
  });

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || expense.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    approved: expenses
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + e.amount, 0),
    pending: expenses
      .filter((e) => e.status === "pending")
      .reduce((sum, e) => sum + e.amount, 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "";
    }
  };

  const handleSubmitExpense = () => {
    // In a real app, this would submit to the backend
    console.log("Submitting expense:", newExpense);
    setShowNewExpense(false);
    setNewExpense({
      description: "",
      category: "",
      amount: "",
      date: "",
      eventName: "",
      notes: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">
            Track and submit your work-related expenses
          </p>
        </div>
        <Button
          className="bg-gold hover:bg-gold-light text-primary-foreground"
          onClick={() => setShowNewExpense(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submitted
            </CardTitle>
            <Receipt className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${stats.approved}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              ${stats.pending}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expenses Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gold" />
                      <span className="font-medium">{expense.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {expense.eventName || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${expense.amount}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(expense.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(expense.status)}
                        {expense.status}
                      </span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Expense Dialog */}
      <Dialog open={showNewExpense} onOpenChange={setShowNewExpense}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., XLR Cables"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) =>
                    setNewExpense({ ...newExpense, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Related Event (Optional)</Label>
              <Input
                id="event"
                placeholder="e.g., Johnson Wedding"
                value={newExpense.eventName}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, eventName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Receipt</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-gold/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional details..."
                value={newExpense.notes}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewExpense(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gold hover:bg-gold-light text-primary-foreground"
              onClick={handleSubmitExpense}
            >
              Submit Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
