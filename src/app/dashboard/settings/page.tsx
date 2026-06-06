"use client";

import { Settings as SettingsIcon, User, Shield, Bell, Database, Palette, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold"><SettingsIcon className="w-6 h-6 text-primary inline mr-2" />Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="profile"><User className="w-3.5 h-3.5 mr-1" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1" /> Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-3.5 h-3.5 mr-1" /> Security</TabsTrigger>
          <TabsTrigger value="system"><Database className="w-3.5 h-3.5 mr-1" /> System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input defaultValue="Priya Officer" /></div>
                <div className="space-y-2"><Label>Email</Label><Input defaultValue="priya@vendorbridge.ai" type="email" /></div>
                <div className="space-y-2"><Label>Role</Label><Input value="Procurement Lead" disabled /></div>
                <div className="space-y-2"><Label>Department</Label><Input defaultValue="Procurement" /></div>
              </div>
              <Button className="gradient-primary text-white border-0">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "RFQ Updates", description: "Get notified when RFQs are created or updated", default: true },
                { label: "Quotation Submissions", description: "Alert when vendors submit quotations", default: true },
                { label: "Approval Requests", description: "Notify when approvals are pending", default: true },
                { label: "AI Insights", description: "Receive AI-generated procurement insights", default: true },
                { label: "Fraud Alerts", description: "Critical alerts for suspicious activity", default: true },
                { label: "Email Notifications", description: "Send notifications via email", default: false },
              ].map(pref => (
                <div key={pref.label} className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">{pref.label}</p><p className="text-xs text-muted-foreground">{pref.description}</p></div>
                  <Switch defaultChecked={pref.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Security Settings</CardTitle>
              <CardDescription>Manage authentication and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div><p className="text-sm font-medium">Session Timeout</p><p className="text-xs text-muted-foreground">Auto-logout after inactivity</p></div>
                <Select defaultValue="30"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem><SelectItem value="30">30 minutes</SelectItem><SelectItem value="60">1 hour</SelectItem>
                </SelectContent></Select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div><p className="text-sm font-medium">Activity Logging</p><p className="text-xs text-muted-foreground">Track all user actions</p></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">System Configuration</CardTitle>
              <CardDescription>Platform-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Company Name</Label><Input defaultValue="VendorBridge Technologies" /></div>
                <div className="space-y-2"><Label>Default Currency</Label><Select defaultValue="INR"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="INR">₹ INR</SelectItem><SelectItem value="USD">$ USD</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>GST Rate (%)</Label><Input defaultValue="18" type="number" /></div>
                <div className="space-y-2"><Label>Approval Levels</Label><Select defaultValue="3"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2">2 Levels</SelectItem><SelectItem value="3">3 Levels</SelectItem><SelectItem value="4">4 Levels</SelectItem></SelectContent></Select></div>
              </div>
              <Button className="gradient-primary text-white border-0">Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
