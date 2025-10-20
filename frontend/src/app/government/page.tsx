"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Building2,
  MessageSquare
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function GovernmentPortal() {
  const departments = [
    {
      id: 1,
      name: "Urban Development",
      head: "David Kim",
      complaints: 12,
      resolved: 8,
      pending: 4
    },
    {
      id: 2,
      name: "Public Works",
      head: "Sarah Johnson",
      complaints: 8,
      resolved: 6,
      pending: 2
    },
    {
      id: 3,
      name: "Environmental Services",
      head: "Michael Chen",
      complaints: 5,
      resolved: 3,
      pending: 2
    }
  ];

  const recentComplaints = [
    {
      id: 1,
      title: "Pothole on Main Street",
      citizen: "Maria Lopez",
      department: "Public Works",
      status: "in_progress",
      priority: "high",
      created: "2024-01-15"
    },
    {
      id: 2,
      title: "Noise Complaint - Construction",
      citizen: "John Smith",
      department: "Urban Development",
      status: "pending",
      priority: "medium",
      created: "2024-01-20"
    },
    {
      id: 3,
      title: "Street Light Out",
      citizen: "Emily Davis",
      department: "Public Works",
      status: "resolved",
      priority: "low",
      created: "2024-01-10"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "New Park Opening",
      department: "Urban Development",
      priority: "high",
      created: "2024-01-22",
      published: true
    },
    {
      id: 2,
      title: "Road Closure Notice",
      department: "Public Works",
      priority: "medium",
      created: "2024-01-20",
      published: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout userType="government" userName="David Kim" userEmail="david.kim@city.gov" showPortalNav={true}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, David!</h1>
          <p className="text-muted-foreground">
            Manage government operations and serve the community effectively.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Complaints", value: "25", icon: FileText, color: "text-blue-600" },
            { title: "Resolved", value: "17", icon: CheckCircle, color: "text-green-600" },
            { title: "Departments", value: "8", icon: Building2, color: "text-purple-600" },
            { title: "Announcements", value: "12", icon: MessageSquare, color: "text-orange-600" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Complaints */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Complaints</CardTitle>
                    <CardDescription>Citizen complaints requiring attention</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Respond to Complaint
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentComplaints.map((complaint) => (
                      <motion.div
                        key={complaint.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{complaint.title}</h3>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(complaint.priority)}>
                              {complaint.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>Citizen: {complaint.citizen}</span>
                          <span>Department: {complaint.department}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created: {complaint.created}</span>
                          <Button size="sm" variant="outline">
                            Respond
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions & Departments */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Respond to Complaint
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Manage Departments
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Department Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                  <CardDescription>Performance by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{dept.name}</h4>
                          <Badge variant="outline">
                            {dept.complaints} total
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Head: {dept.head}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{dept.resolved} resolved</span>
                          <span>{dept.pending} pending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>Your department announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{announcement.title}</h4>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(announcement.priority)}>
                              {announcement.priority}
                            </Badge>
                            <Badge variant={announcement.published ? "default" : "secondary"}>
                              {announcement.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Department: {announcement.department}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {announcement.created}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
