"use client";

import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Filter, Plus, Eye, Edit } from "lucide-react";


const SAMPLE_COMPLAINTS = [
  { id: 1, title: "Pothole on Main Street", description: "Large pothole causing damage to vehicles.", status: "in_progress", priority: "high", location: "Main St & 5th Ave", created: "2024-01-15", assignedTo: "Public Works Dept" },
  { id: 2, title: "Street Light Out", description: "Street light not working on Oak Avenue.", status: "resolved", priority: "medium", location: "Oak Avenue", created: "2024-01-10", assignedTo: "Utilities Dept" },
  { id: 3, title: "Noise Complaint", description: "Construction work during night hours.", status: "pending", priority: "low", location: "Downtown Area", created: "2024-01-20", assignedTo: "Code Enforcement" },
];

const badgeClass = "bg-[#003153]/10 text-[#003153]";

export default function CitizenComplaintsPage() {
  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={false}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl">My Complaints</CardTitle>
                <CardDescription>View and manage all your submitted complaints</CardDescription>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
                <Button size="sm" className="bg-[#003153] hover:bg-[#003153]/90 flex-1 sm:flex-none">
                  <Plus className="h-4 w-4 mr-2" /> New Complaint
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Search complaints..." className="md:col-span-2" />
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {SAMPLE_COMPLAINTS.map((c) => (
                <div key={c.id} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{c.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{c.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {c.location}</span>
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {c.created}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-3">
                      <Badge className={`${badgeClass} text-xs text-center px-2 py-1`}>{c.status.replace("_", " ")}</Badge>
                      <Badge className={`${badgeClass} text-xs text-center px-2 py-1`}>{c.priority}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Assigned to: <span className="font-medium">{c.assignedTo}</span></div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#003153]/10 hover:text-[#003153]"><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#003153]/10 hover:text-[#003153]"><Edit className="h-4 w-4" /></Button>
                    </div>
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
