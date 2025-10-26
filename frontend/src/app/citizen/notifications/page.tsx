"use client";

import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

const NOTIFICATIONS = [
  { id: 1, title: "Complaint Resolved", desc: "Your 'Street Light Out' complaint has been marked resolved.", date: "2024-01-20", type: "update" },
  { id: 2, title: "New Announcement", desc: "Community meeting scheduled for January 30.", date: "2024-01-18", type: "announcement" },
  { id: 3, title: "Vote Update", desc: "Green Energy Initiative has reached 150 supports.", date: "2024-01-17", type: "vote" },
];

export default function CitizenNotificationsPage() {
  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Notifications</CardTitle>
              <CardDescription>Latest updates related to your activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 flex items-start gap-3">
                  <Bell className="h-5 w-5 text-[#003153] mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{n.title}</h3>
                      <Badge className="bg-[#003153]/10 text-[#003153]">{n.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{n.desc}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{n.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
