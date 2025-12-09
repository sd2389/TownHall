"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Bell, Shield, Mail, Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <AdminProtectedRoute>
      <AdminLayout currentPage="settings">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
            <p className="text-gray-600">Manage system settings and preferences</p>
          </div>

          {/* Notification Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-600" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-users" className="font-medium">New User Approvals</Label>
                  <p className="text-sm text-gray-600">Get notified when new users need approval</p>
                </div>
                <Checkbox id="new-users" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="town-changes" className="font-medium">Town Change Requests</Label>
                  <p className="text-sm text-gray-600">Get notified about town change requests</p>
                </div>
                <Checkbox id="town-changes" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="complaints" className="font-medium">New Complaints</Label>
                  <p className="text-sm text-gray-600">Get notified when new complaints are filed</p>
                </div>
                <Checkbox id="complaints" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-summary" className="font-medium">Daily Summary</Label>
                  <p className="text-sm text-gray-600">Receive daily summary email</p>
                </div>
                <Checkbox id="daily-summary" />
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-600" />
                Email Configuration
              </CardTitle>
              <CardDescription>Manage email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notifications-email">Notifications Email</Label>
                <Input id="notifications-email" type="email" placeholder="admin@townhall.com" />
                <p className="text-sm text-gray-600 mt-1">Email address for administrative notifications</p>
              </div>

              <div>
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" placeholder="support@townhall.com" />
                <p className="text-sm text-gray-600 mt-1">Email address for user support</p>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                Security Settings
              </CardTitle>
              <CardDescription>Security and access control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-approval" className="font-medium">Require Approval for All Users</Label>
                  <p className="text-sm text-gray-600">All new users must be approved by an administrator</p>
                </div>
                <Checkbox id="require-approval" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-step-town" className="font-medium">Two-Step Town Change</Label>
                  <p className="text-sm text-gray-600">Require approval from both current and requested town</p>
                </div>
                <Checkbox id="two-step-town" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audit-log" className="font-medium">Enable Audit Logging</Label>
                  <p className="text-sm text-gray-600">Log all administrative actions</p>
                </div>
                <Checkbox id="audit-log" defaultChecked />
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Notice */}
          <Card className="mt-6 border-gray-300">
            <CardContent className="p-6">
              <div className="text-center">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Additional settings will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}






