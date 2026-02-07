'use client';



import { useState, useEffect } from 'react';
import { sampleCrew } from '@/lib/data';
import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Search,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  User as UserIcon,
  Music,
  Lightbulb,
  Mic,
  Truck,
} from 'lucide-react';

const specializationIcons: Record<string, React.ReactNode> = {
  DJ: <Music className="w-4 h-4" />,
  'Sound Engineer': <Mic className="w-4 h-4" />,
  'Lighting Designer': <Lightbulb className="w-4 h-4" />,
  MC: <Mic className="w-4 h-4" />,
  Setup: <Truck className="w-4 h-4" />,
  Transport: <Truck className="w-4 h-4" />,
};

const allSpecializations = [
  'DJ',
  'Sound Engineer',
  'Lighting Designer',
  'MC',
  'Setup',
  'Transport',
];

export default function TeamPage() {
  /* import { sampleCrew } from '@/lib/data'; // Removed */

  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<User>>({
    role: 'CREW',
    specializations: [],
    status: 'active',
    hourlyRate: 500,
  });

  useEffect(() => {
    loadCrew();
  }, []);

  const loadCrew = async () => {
    setLoading(true);
    try {
      const { fetchCrewAction } = await import('@/app/actions/team-actions');
      const result = await fetchCrewAction();
      if (result.success && result.data) {
        setTeam(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStats = () => {
    const total = team.length;
    const active = team.filter((m) => m.status === 'active').length;
    const admin = team.filter((m) => m.role === 'ADMIN').length;
    const crew = team.filter((m) => m.role === 'CREW').length;
    return { total, active, admin, crew };
  };

  const stats = getStats();

  const handleAddMember = async () => {
    if (newMember.name && newMember.email) {
      try {
        const { addCrewAction } = await import('@/app/actions/team-actions');
        const result = await addCrewAction(newMember);

        if (result.success && result.data) {
          setTeam(prev => [...prev, result.data!]);
          setIsAddDialogOpen(false);
          setNewMember({
            role: 'CREW',
            specializations: [],
            status: 'active',
            hourlyRate: 500,
          });
        } else {
          alert('Failed to add member: ' + result.error);
        }
      } catch (e) {
        console.error(e);
        alert('Error adding member');
      }
    }
  };

  const toggleSpecialization = (spec: string) => {
    setNewMember((prev) => ({
      ...prev,
      specializations: prev.specializations?.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...(prev.specializations || []), spec],
    }));
  };

  const toggleMemberStatus = (memberId: string) => {
    setTeam((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
          : m
      )
    );
  };

  const activeCrew = team.filter((m) => m.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Team</p>
                <p className="text-3xl font-bold text-foreground">
                  {team.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-foreground">
                  {activeCrew}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rate</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹
                  {Math.round(
                    team.reduce((sum, m) => sum + (m.hourlyRate || 0), 0) /
                    team.length
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-500 font-bold">/hr</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newMember.name || ''}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email || ''}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@example.com"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newMember.phone || ''}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="rate">Hourly Rate (₹)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={newMember.hourlyRate || 500}
                  onChange={(e) =>
                    setNewMember((prev) => ({
                      ...prev,
                      hourlyRate: parseInt(e.target.value) || 500,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Specializations</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allSpecializations.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialization(spec)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1.5',
                        newMember.specializations?.includes(spec)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {specializationIcons[spec]}
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleAddMember}
                className="w-full bg-primary text-primary-foreground"
              >
                Add Team Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeam.map((member) => (
          <Card key={member.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <Badge
                      className={cn(
                        'text-xs',
                        member.status === 'active'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem>View Schedule</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleMemberStatus(member.id)}
                    >
                      {member.status === 'active'
                        ? 'Mark Inactive'
                        : 'Mark Active'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {member.specializations?.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                  >
                    {specializationIcons[spec]}
                    {spec}
                  </span>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {member.phone}
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {member.email}
                </a>
              </div>

              {/* Rate */}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Hourly Rate
                </span>
                <span className="font-semibold text-primary">
                  ₹{member.hourlyRate}/hr
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeam.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No team members found
        </div>
      )}
    </div>
  );
}
