'use client';

import { useState } from 'react';
import { contactInfo, processSteps } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [contact, setContact] = useState(contactInfo);
  const [steps, setSteps] = useState(processSteps);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="process">Process Steps</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* Contact Info Tab */}
        <TabsContent value="contact" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </div>
                  </Label>
                  <Input
                    id="phone"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </div>
                </Label>
                <Textarea
                  id="address"
                  value={contact.address}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, address: e.target.value }))
                  }
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-4">Social Links</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="instagram">
                      <div className="flex items-center gap-2 mb-2">
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </div>
                    </Label>
                    <Input
                      id="instagram"
                      value={contact.socialLinks.instagram || ''}
                      onChange={(e) =>
                        setContact((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            instagram: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook">
                      <div className="flex items-center gap-2 mb-2">
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </div>
                    </Label>
                    <Input
                      id="facebook"
                      value={contact.socialLinks.facebook || ''}
                      onChange={(e) =>
                        setContact((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            facebook: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube">
                      <div className="flex items-center gap-2 mb-2">
                        <Youtube className="w-4 h-4" />
                        YouTube
                      </div>
                    </Label>
                    <Input
                      id="youtube"
                      value={contact.socialLinks.youtube || ''}
                      onChange={(e) =>
                        setContact((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            youtube: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </div>

              <Button className="bg-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Process Steps Tab */}
        <TabsContent value="process" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">
                Process Steps (Our Process Section)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="p-4 bg-muted/50 rounded-lg space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <Input
                      value={step.title}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((s, i) =>
                            i === index ? { ...s, title: e.target.value } : s
                          )
                        )
                      }
                      className="font-semibold"
                    />
                  </div>
                  <Textarea
                    value={step.description}
                    onChange={(e) =>
                      setSteps((prev) =>
                        prev.map((s, i) =>
                          i === index ? { ...s, description: e.target.value } : s
                        )
                      )
                    }
                    rows={2}
                    className="resize-none"
                  />
                </div>
              ))}

              <Button className="bg-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Save Process Steps
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    defaultValue="Vetri Events"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    defaultValue={18}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="INR (₹)" className="mt-2" disabled />
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  defaultValue="Asia/Kolkata (IST)"
                  className="mt-2"
                  disabled
                />
              </div>

              <Button className="bg-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
