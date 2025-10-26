"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Building2,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  MapPin,
  Users,
  Shield,
  Star,
  ArrowRight,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Home,
  Car,
  Wrench,
  Lightbulb,
  Heart,
  ThumbsUp,
  CreditCard,
  Vote,
  MessageSquare,
  MessageCircle,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown,
  User,
  Briefcase,
  Clipboard,
  DollarSign,
  TrendingUp,
  Award,
  Settings,
  Bell,
  BarChart3,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  ExternalLink,
  Gavel,
  Scale,
  Landmark,
  FileBarChart,
  Megaphone,
  UserCheck,
  ClipboardList,
  Target,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle2 as CheckCircle2Icon,
  XCircle as XCircleIcon,
  Clock3 as Clock3Icon
} from "lucide-react";

export default function GovernmentPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced mock data with more realistic metrics
  const stats = {
    totalComplaints: 47,
    resolvedComplaints: 32,
    pendingComplaints: 15,
    totalAnnouncements: 12,
    activeReports: 8,
    citizenSatisfaction: 87,
    totalApplications: 23,
    approvedApplications: 18,
    pendingApplications: 5,
    responseTime: 2.3, // days
    budgetUtilization: 78, // percentage
    staffEfficiency: 92 // percentage
  };

  const quickActions = [
    {
      title: "Create Announcement",
      description: "Broadcast important updates",
      icon: Megaphone,
      color: "bg-blue-500",
      href: "/government/announcements"
    },
    {
      title: "Review Complaints",
      description: "Address citizen concerns",
      icon: FileText,
      color: "bg-red-500",
      href: "/government/complaints"
    },
    {
      title: "Generate Report",
      description: "Create analytical reports",
      icon: FileBarChart,
      color: "bg-green-500",
      href: "/government/reports"
    },
    {
      title: "Manage Applications",
      description: "Process business requests",
      icon: ClipboardList,
      color: "bg-purple-500",
      href: "/government/applications"
    }
  ];

  const recentComplaints = [
    {
      id: 1,
      title: "Street Light Outage",
      description: "Street light on Main Street has been out for 3 days, causing safety concerns for pedestrians",
      category: "Infrastructure",
      priority: "High",
      status: "In Progress",
      citizen: "John Smith",
      date: "2024-01-15",
      location: "Main Street, Block A",
      assignedTo: "Public Works Dept"
    },
    {
      id: 2,
      title: "Pothole Repair Request",
      description: "Large pothole causing traffic issues and vehicle damage",
      category: "Roads",
      priority: "Medium",
      status: "Pending",
      citizen: "Sarah Johnson",
      date: "2024-01-14",
      location: "Oak Avenue, Block B",
      assignedTo: "Transportation Dept"
    },
    {
      id: 3,
      title: "Noise Complaint",
      description: "Construction work during prohibited night hours",
      category: "Noise",
      priority: "Low",
      status: "Resolved",
      citizen: "Mike Wilson",
      date: "2024-01-13",
      location: "Pine Street, Block C",
      assignedTo: "Code Enforcement"
    },
    {
      id: 4,
      title: "Water Leak Report",
      description: "Water main leak causing flooding in residential area",
      category: "Utilities",
      priority: "High",
      status: "In Progress",
      citizen: "Lisa Brown",
      date: "2024-01-12",
      location: "Elm Street, Block D",
      assignedTo: "Water Department"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "New City Budget Approved for 2024",
      description: "The city council has approved the new budget for 2024 with focus on infrastructure improvements",
      date: "2024-01-15",
      priority: "High",
      views: 245,
      status: "Published"
    },
    {
      id: 2,
      title: "Road Construction Schedule Update",
      description: "Updated schedule for road construction projects affecting downtown area",
      date: "2024-01-14",
      priority: "Medium",
      views: 189,
      status: "Published"
    },
    {
      id: 3,
      title: "Public Safety Meeting",
      description: "Community meeting to discuss public safety initiatives and neighborhood watch programs",
      date: "2024-01-13",
      priority: "Medium",
      views: 156,
      status: "Draft"
    }
  ];

  const reports = [
    {
      id: 1,
      title: "Monthly Citizen Satisfaction Report",
      type: "Satisfaction",
      status: "Completed",
      date: "2024-01-15",
      views: 45,
      downloadCount: 12
    },
    {
      id: 2,
      title: "Infrastructure Maintenance Report",
      type: "Infrastructure",
      status: "In Progress",
      date: "2024-01-14",
      views: 23,
      downloadCount: 8
    },
    {
      id: 3,
      title: "Budget Performance Analysis",
      type: "Financial",
      status: "Completed",
      date: "2024-01-13",
      views: 67,
      downloadCount: 15
    }
  ];

  const applications = [
    {
      id: 1,
      type: "Business License",
      applicant: "ABC Restaurant LLC",
      status: "Pending Review",
      submittedDate: "2024-01-15",
      priority: "Medium"
    },
    {
      id: 2,
      type: "Building Permit",
      applicant: "John Doe Construction",
      status: "Approved",
      submittedDate: "2024-01-14",
      priority: "High"
    },
    {
      id: 3,
      type: "Event Permit",
      applicant: "Community Center",
      status: "Under Review",
      submittedDate: "2024-01-13",
      priority: "Low"
    }
  ];

  const filteredComplaints = recentComplaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || complaint.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "destructive"; // Red background with white text
      case "Medium": return "default"; // Black background with white text
      case "Low": return "secondary"; // Gray background with gray text
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-green-100 text-green-800 border border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Approved": return "bg-green-100 text-green-800 border border-green-200";
      case "Under Review": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Pending Review": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Published": return "bg-green-100 text-green-800 border border-green-200";
      case "Draft": return "bg-gray-100 text-gray-800 border border-gray-200";
      case "Completed": return "bg-green-100 text-green-800 border border-green-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <ProtectedRoute allowedRoles={['government']}>
      <Layout userType="government" userName="Admin User" userEmail="admin@townhall.gov" showPortalNav={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Government Dashboard
                </h1>
                <p className="text-gray-600 text-lg">Welcome back! Here's what's happening in your city today.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 border border-green-200 px-3 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  System Online
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Complaints */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">{stats.totalComplaints}</div>
                        <div className="text-sm text-red-500 font-medium">+12%</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Total Complaints</h3>
                    <p className="text-sm text-gray-600">From last month</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resolved Complaints */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">{stats.resolvedComplaints}</div>
                        <div className="text-sm text-green-500 font-medium">{Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Resolved</h3>
                    <p className="text-sm text-gray-600">Resolution rate</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Citizen Satisfaction */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{stats.citizenSatisfaction}%</div>
                        <div className="text-sm text-blue-500 font-medium">+5%</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Satisfaction</h3>
                    <p className="text-sm text-gray-600">Citizen rating</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Response Time */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-600">{stats.responseTime}</div>
                        <div className="text-sm text-purple-500 font-medium">days</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Avg Response</h3>
                    <p className="text-sm text-gray-600">Time to resolve</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Data Visualization Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Complaints Trend Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Complaints Trend</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">This Month</span>
                  </div>
                </div>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {[65, 45, 78, 52, 89, 67, 47].map((height, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div 
                        className="w-8 bg-gradient-to-t from-red-500 to-red-300 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-500">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Average: 63 complaints/day</span>
                  <span className="text-red-600 font-medium">+8% vs last week</span>
                </div>
              </Card>

              {/* Department Performance */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                <div className="space-y-4">
                  {[
                    { name: "Public Works", efficiency: 92, color: "bg-green-500" },
                    { name: "Public Safety", efficiency: 87, color: "bg-blue-500" },
                    { name: "Planning & Zoning", efficiency: 78, color: "bg-yellow-500" },
                    { name: "Parks & Recreation", efficiency: 85, color: "bg-purple-500" }
                  ].map((dept, index) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${dept.color} rounded-full`}></div>
                        <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 ${dept.color} rounded-full transition-all duration-500`}
                            style={{ width: `${dept.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-8">{dept.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Recent Complaints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Complaints</CardTitle>
                    <CardDescription>Citizen complaints requiring attention</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredComplaints.map((complaint) => (
                    <motion.div 
                      key={complaint.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{complaint.title}</h3>
                            <Badge variant={getPriorityColor(complaint.priority)}>
                              {complaint.priority}
                            </Badge>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {complaint.citizen}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {complaint.location}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {complaint.date}
                            </span>
                            <span className="flex items-center">
                              <Building2 className="h-3 w-3 mr-1" />
                              {complaint.assignedTo}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Announcements and Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>Latest public announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{announcement.title}</h3>
                              <Badge variant={getPriorityColor(announcement.priority)}>
                                {announcement.priority}
                              </Badge>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(announcement.status)}`}>
                                {announcement.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{announcement.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {announcement.date}
                              </span>
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {announcement.views} views
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Pending and recent applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{application.type}</h3>
                              <Badge variant={getPriorityColor(application.priority)}>
                                {application.priority}
                              </Badge>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{application.applicant}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {application.submittedDate}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Generated reports and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{report.title}</h3>
                            <Badge variant="outline">{report.type}</Badge>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {report.date}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {report.views} views
                            </span>
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {report.downloadCount} downloads
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  );
}