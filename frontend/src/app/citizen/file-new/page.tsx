"use client";

import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FileNewComplaintPage() {
  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">File New Complaint</CardTitle>
              <CardDescription>Provide details below to submit a new complaint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="Brief title for your complaint" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select defaultValue="infrastructure">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="safety">Public Safety</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="Street, Area" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea className="min-h-[140px]" placeholder="Describe the issue with as much detail as possible" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#003153] hover:bg-[#003153]/90">Submit Complaint</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
