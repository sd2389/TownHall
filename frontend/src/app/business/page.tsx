"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  DollarSign,
  Users
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function BusinessPortal() {
  const licenses = [
    {
      id: 1,
      type: "Business License",
      status: "active",
      issueDate: "2024-01-01",
      expiryDate: "2024-12-31",
      description: "General business operations license"
    },
    {
      id: 2,
      type: "Food Service Permit",
      status: "expiring",
      issueDate: "2023-06-01",
      expiryDate: "2024-06-01",
      description: "Permit for food service operations"
    },
    {
      id: 3,
      type: "Event Permit",
      status: "pending",
      issueDate: null,
      expiryDate: null,
      description: "Permit for outdoor events"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Summer Festival",
      date: "2024-07-15",
      status: "approved",
      attendees: 150,
      revenue: 2500
    },
    {
      id: 2,
      title: "Business Networking Event",
      date: "2024-02-20",
      status: "pending",
      attendees: 0,
      revenue: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expiring":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout userType="business" userName="Priya Singh" userEmail="priya@priyascafe.com" showPortalNav={true}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, Priya!</h1>
          <p className="text-muted-foreground">
            Manage your business operations and stay connected with the community.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Active Licenses", value: "3", icon: FileText, color: "text-green-600" },
            { title: "Total Events", value: "8", icon: Calendar, color: "text-blue-600" },
            { title: "Monthly Revenue", value: "$2,500", icon: DollarSign, color: "text-purple-600" },
            { title: "Event Attendees", value: "150", icon: Users, color: "text-orange-600" }
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
          {/* Licenses */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Business Licenses</CardTitle>
                    <CardDescription>Manage your business licenses and permits</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for License
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {licenses.map((license) => (
                      <motion.div
                        key={license.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{license.type}</h3>
                          <Badge className={getStatusColor(license.status)}>
                            {license.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {license.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {license.issueDate ? `Issued: ${license.issueDate}` : 'Not issued yet'}
                          </span>
                          <span>
                            {license.expiryDate ? `Expires: ${license.expiryDate}` : 'No expiry date'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions & Events */}
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
                    <FileText className="h-4 w-4 mr-2" />
                    Apply for License
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Update Business Info
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>Your business events and promotions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{event.title}</h4>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Date: {event.date}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{event.attendees} attendees</span>
                          <span>${event.revenue} revenue</span>
                        </div>
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
