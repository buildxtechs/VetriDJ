"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Edit,
  Save,
  Camera,
  Shield,
  Bell,
  Music,
  Lightbulb,
  Volume2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function CrewProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Music Lane, Sound City, SC 12345",
    bio: "Professional DJ and sound technician with over 8 years of experience in live events. Specializing in weddings, corporate events, and club performances.",
    joinDate: "2022-03-15",
    emergencyContact: "Jane Johnson - +1 (555) 987-6543",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    newEvents: true,
    scheduleChanges: true,
    expenseUpdates: true,
  });

  const skills = [
    { name: "DJ Performance", level: 95 },
    { name: "Sound Engineering", level: 90 },
    { name: "Lighting Design", level: 75 },
    { name: "Equipment Setup", level: 85 },
    { name: "MC/Hosting", level: 70 },
  ];

  const certifications = [
    { name: "Certified DJ Professional", issuer: "DJ Academy", year: 2020 },
    { name: "Audio Engineering Certificate", issuer: "Sound Institute", year: 2019 },
    { name: "First Aid & CPR", issuer: "Red Cross", year: 2024 },
  ];

  const stats = {
    totalEvents: 247,
    thisYear: 42,
    avgRating: 4.9,
    yearsExperience: 4,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          className={isEditing ? "bg-gold hover:bg-gold-light text-primary-foreground" : ""}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="skills">Skills & Certs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {/* Profile Header */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/images/team.jpeg" />
                    <AvatarFallback className="text-2xl">AJ</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gold hover:bg-gold-light"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">DJ / Sound Tech</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      <Music className="h-3 w-3 mr-1" />
                      DJ
                    </Badge>
                    <Badge className="bg-cyan/20 text-cyan border-cyan/30">
                      <Volume2 className="h-3 w-3 mr-1" />
                      Sound
                    </Badge>
                    <Badge className="bg-purple/20 text-purple border-purple/30">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Lighting
                    </Badge>
                  </div>
                </div>
                <div className="flex-1" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gold">{stats.totalEvents}</p>
                    <p className="text-xs text-muted-foreground">Total Events</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.thisYear}</p>
                    <p className="text-xs text-muted-foreground">This Year</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.avgRating}</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.yearsExperience}yr</p>
                    <p className="text-xs text-muted-foreground">With Team</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-gold" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm py-2">{profile.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {profile.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {profile.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm py-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {profile.address}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                {isEditing ? (
                  <Input
                    id="emergency"
                    value={profile.emergencyContact}
                    onChange={(e) =>
                      setProfile({ ...profile, emergencyContact: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm py-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    {profile.emergencyContact}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          {/* Skills */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span className="text-gold">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                    </p>
                  </div>
                  <Badge variant="secondary">{cert.year}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gold" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Channels</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via text message
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Types</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Event Assignments</p>
                    <p className="text-sm text-muted-foreground">
                      When you are assigned to a new event
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newEvents}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newEvents: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Schedule Changes</p>
                    <p className="text-sm text-muted-foreground">
                      When event times or details change
                    </p>
                  </div>
                  <Switch
                    checked={notifications.scheduleChanges}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        scheduleChanges: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Expense Updates</p>
                    <p className="text-sm text-muted-foreground">
                      When your expenses are approved or rejected
                    </p>
                  </div>
                  <Switch
                    checked={notifications.expenseUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        expenseUpdates: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
