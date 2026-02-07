"use client";

import { useState } from "react";
import {
  Clock,
  Plus,
  Calendar,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";

interface TimeEntry {
  id: string;
  eventName: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  totalHours: number;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

interface WeekSummary {
  weekStart: string;
  weekEnd: string;
  entries: TimeEntry[];
  totalHours: number;
  status: "pending" | "approved" | "partial";
}

const timesheets: WeekSummary[] = [
  {
    weekStart: "2026-02-03",
    weekEnd: "2026-02-09",
    totalHours: 24,
    status: "pending",
    entries: [
      {
        id: "1",
        eventName: "Johnson Wedding Setup",
        date: "2026-02-05",
        startTime: "10:00",
        endTime: "14:00",
        breakMinutes: 30,
        totalHours: 3.5,
        status: "pending",
      },
      {
        id: "2",
        eventName: "Johnson Wedding Event",
        date: "2026-02-06",
        startTime: "16:00",
        endTime: "23:00",
        breakMinutes: 30,
        totalHours: 6.5,
        status: "pending",
      },
      {
        id: "3",
        eventName: "TechCorp Setup",
        date: "2026-02-08",
        startTime: "12:00",
        endTime: "18:00",
        breakMinutes: 30,
        totalHours: 5.5,
        status: "pending",
      },
      {
        id: "4",
        eventName: "TechCorp Event",
        date: "2026-02-09",
        startTime: "17:00",
        endTime: "23:00",
        breakMinutes: 0,
        totalHours: 6,
        status: "pending",
      },
    ],
  },
  {
    weekStart: "2026-01-27",
    weekEnd: "2026-02-02",
    totalHours: 32,
    status: "approved",
    entries: [
      {
        id: "5",
        eventName: "Club Night - Pulse",
        date: "2026-01-31",
        startTime: "21:00",
        endTime: "03:00",
        breakMinutes: 0,
        totalHours: 6,
        status: "approved",
      },
      {
        id: "6",
        eventName: "Private Party - Smith",
        date: "2026-02-01",
        startTime: "18:00",
        endTime: "23:00",
        breakMinutes: 30,
        totalHours: 4.5,
        status: "approved",
      },
    ],
  },
];

const events = [
  { id: "1", name: "Johnson Wedding" },
  { id: "2", name: "TechCorp Gala" },
  { id: "3", name: "Birthday Bash - Patel" },
  { id: "4", name: "Club Night - Pulse" },
];

export default function CrewTimesheets() {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([
    timesheets[0]?.weekStart,
  ]);
  const [newEntry, setNewEntry] = useState({
    eventId: "",
    date: "",
    startTime: "",
    endTime: "",
    breakMinutes: "0",
    notes: "",
  });

  const toggleWeek = (weekStart: string) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekStart)
        ? prev.filter((w) => w !== weekStart)
        : [...prev, weekStart]
    );
  };

  const stats = {
    thisWeek: timesheets[0]?.totalHours || 0,
    thisMonth: 64,
    pending: timesheets.filter((w) => w.status === "pending").length,
    approved: timesheets.filter((w) => w.status === "approved").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "partial":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "";
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitEntry = () => {
    console.log("Submitting time entry:", newEntry);
    setShowNewEntry(false);
    setNewEntry({
      eventId: "",
      date: "",
      startTime: "",
      endTime: "",
      breakMinutes: "0",
      notes: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Timesheets</h1>
          <p className="text-muted-foreground">
            Track your working hours and submit timesheets
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isTracking ? "destructive" : "outline"}
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Timer
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Timer
              </>
            )}
          </Button>
          <Button
            className="bg-gold hover:bg-gold-light text-primary-foreground"
            onClick={() => setShowNewEntry(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Hours
          </Button>
        </div>
      </div>

      {/* Live Timer */}
      {isTracking && (
        <Card className="bg-gold/10 border-gold/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="font-medium">Currently Tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Johnson Wedding Setup
                  </p>
                </div>
              </div>
              <div className="text-3xl font-mono font-bold text-gold">
                {formatTime(trackingTime)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <Clock className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}h</div>
            <Progress value={(stats.thisWeek / 40) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}h</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.pending}
            </div>
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
              {stats.approved}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timesheets by Week */}
      <div className="space-y-4">
        {timesheets.map((week) => (
          <Card key={week.weekStart} className="bg-card border-border">
            <Collapsible
              open={expandedWeeks.includes(week.weekStart)}
              onOpenChange={() => toggleWeek(week.weekStart)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          expandedWeeks.includes(week.weekStart)
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                      <div>
                        <CardTitle className="text-base">
                          Week of{" "}
                          {new Date(week.weekStart).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(week.weekEnd).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {week.entries.length} entries
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{week.totalHours}h</p>
                        <p className="text-xs text-muted-foreground">
                          Total Hours
                        </p>
                      </div>
                      <Badge className={getStatusBadge(week.status)}>
                        {week.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Break</TableHead>
                        <TableHead className="text-right">Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {week.entries.map((entry) => (
                        <TableRow key={entry.id} className="border-border">
                          <TableCell className="font-medium">
                            {entry.eventName}
                          </TableCell>
                          <TableCell>
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            {entry.startTime} - {entry.endTime}
                          </TableCell>
                          <TableCell>{entry.breakMinutes} min</TableCell>
                          <TableCell className="text-right font-medium">
                            {entry.totalHours}h
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(entry.status)}>
                              {entry.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* New Entry Dialog */}
      <Dialog open={showNewEntry} onOpenChange={setShowNewEntry}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Working Hours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event">Event</Label>
              <Select
                value={newEntry.eventId}
                onValueChange={(value) =>
                  setNewEntry({ ...newEntry, eventId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, date: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="break">Break (minutes)</Label>
              <Input
                id="break"
                type="number"
                value={newEntry.breakMinutes}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, breakMinutes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewEntry(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gold hover:bg-gold-light text-primary-foreground"
              onClick={handleSubmitEntry}
            >
              Log Hours
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
