"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Filter, Plus, Eye, Edit, Search, FileText } from "lucide-react";


const SAMPLE_COMPLAINTS = [
  { id: 1, title: "Pothole on Main Street", description: "Large pothole causing damage to vehicles.", status: "in_progress", priority: "high", location: "Main St & 5th Ave", created: "2024-01-15", assignedTo: "Public Works Dept" },
  { id: 2, title: "Street Light Out", description: "Street light not working on Oak Avenue.", status: "resolved", priority: "medium", location: "Oak Avenue", created: "2024-01-10", assignedTo: "Utilities Dept" },
  { id: 3, title: "Noise Complaint", description: "Construction work during night hours.", status: "pending", priority: "low", location: "Downtown Area", created: "2024-01-20", assignedTo: "Code Enforcement" },
];

const badgeClass = "bg-[#003153]/10 text-[#003153]";

export default function CitizenComplaintsPage() {
  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-[#003153] to-[#003153]/90 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    My Complaints
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Track and manage all your submitted complaints
                  </p>
                </div>
                <Button size="lg" className="bg-white text-[#003153] hover:bg-blue-50 font-semibold shadow-md">
                  <Plus className="h-5 w-5 mr-2" />
                  New Complaint
                </Button>
              </div>
            </div>
          </motion.div>

          <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#003153] rounded-full animate-pulse"></div>
                <CardTitle className="text-xl font-bold">All Complaints</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              >
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search complaints..." 
                    className="pl-10 border-2 focus:border-[#003153]" 
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="border-2 focus:border-[#003153]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <div className="space-y-4">
              {SAMPLE_COMPLAINTS.map((c, index) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="p-6 border-l-4 border-[#003153] bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{c.title}</h3>
                        {c.priority === 'high' && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">{c.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-[#003153]" /> {c.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-[#003153]" /> {c.created}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`text-xs font-semibold px-3 py-1 ${
                        c.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Assigned to: <span className="font-bold text-[#003153]">{c.assignedTo}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 hover:bg-[#003153]/10 hover:text-[#003153]">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 hover:bg-[#003153]/10 hover:text-[#003153]">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
