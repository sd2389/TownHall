"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Clock3 as Clock3Icon,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { announcementsApi, complaintsApi } from "@/lib/api";
import { useEffect } from "react";

export default function GovernmentPortal() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats from fetched data
  const stats = {
    totalComplaints: recentComplaints.length,
    resolvedComplaints: recentComplaints.filter((c: any) => c.status.toLowerCase() === 'resolved').length,
    pendingComplaints: recentComplaints.filter((c: any) => c.status.toLowerCase().includes('pending') || c.status.toLowerCase() === 'open').length,
    totalAnnouncements: announcements.length,
    activeReports: 0, // Reports will be fetched from API when implemented
    citizenSatisfaction: 0, // Will be calculated from feedback data
    totalApplications: 0, // Applications will be fetched from API when implemented
    approvedApplications: 0,
    pendingApplications: 0,
    responseTime: 0, // Will be calculated from complaint data
    budgetUtilization: 0, // Will be calculated from budget data
    staffEfficiency: 0 // Will be calculated from performance data
  };

  const quickActions = [
    {
      title: "Create Announcement",
      description: "Broadcast important updates",
      icon: Megaphone,
      color: "bg-slate-700",
      hoverColor: "hover:bg-slate-800",
      href: "/government/announcements"
    },
    {
      title: "Review Complaints",
      description: "Address citizen concerns",
      icon: FileText,
      color: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      href: "/government/complaints"
    },
    {
      title: "Generate Report",
      description: "Create analytical reports",
      icon: FileBarChart,
      color: "bg-teal-600",
      hoverColor: "hover:bg-teal-700",
      href: "/government/reports"
    },
    {
      title: "Manage Applications",
      description: "Process business requests",
      icon: ClipboardList,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      href: "/government/applications"
    }
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch announcements
        const announcementsResponse = await announcementsApi.list({ status: 'published' });
        // Handle both array response and object with announcements (for backward compatibility)
        const announcementsData = Array.isArray(announcementsResponse) ? announcementsResponse : (announcementsResponse.announcements || []);
        const mappedAnnouncements = announcementsData.slice(0, 5).map((announcement: any) => ({
          id: announcement.id,
          title: announcement.title,
          description: announcement.description,
          date: announcement.date,
          priority: announcement.priority,
          type: announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1),
          status: announcement.status,
          views: announcement.views,
        }));
        setAnnouncements(mappedAnnouncements);

        // Fetch complaints
        const complaintsResponse = await complaintsApi.list();
        // Handle both array response and object (for backward compatibility)
        const complaintsData = Array.isArray(complaintsResponse) ? complaintsResponse : (complaintsResponse.complaints || []);
        const mappedComplaints = complaintsData.slice(0, 4).map((complaint: any) => ({
          id: complaint.id,
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          priority: complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1),
          status: complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' '),
          citizen: "Citizen", // We don't have citizen name in the API response
          date: complaint.created,
          location: complaint.location || '',
          assignedTo: complaint.assignedTo || '',
        }));
        setRecentComplaints(mappedComplaints);
      } catch (err: any) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);


  // Reports and applications will be fetched from API when those features are implemented
  const reports: any[] = [];
  const applications: any[] = [];

  const filteredComplaints = recentComplaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || complaint.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-600 text-white";
      case "Medium": return "bg-yellow-500 text-white";
      case "Low": return "bg-green-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-600 text-white";
      case "In Progress": return "bg-blue-600 text-white";
      case "Pending": return "bg-yellow-500 text-white";
      case "Approved": return "bg-green-600 text-white";
      case "Under Review": return "bg-blue-600 text-white";
      case "Pending Review": return "bg-yellow-500 text-white";
      case "Published": return "bg-green-600 text-white";
      case "Draft": return "bg-gray-500 text-white";
      case "Completed": return "bg-green-600 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <ProtectedRoute allowedRoles={['government']}>
      <Layout userType="government" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          
          {/* Modern Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                        Government Dashboard
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1">
                        Welcome back, {user?.firstName || 'Administrator'}. Here's your city overview.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-600 text-white px-4 py-1.5 text-sm font-medium border-0">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    System Online
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-200 cursor-pointer group h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-lg flex items-center justify-center transition-colors duration-200 group-hover:scale-110`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Key Metrics - Redesigned with solid colors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Complaints */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalComplaints}</div>
                        <div className="text-xs text-red-600 font-medium flex items-center justify-end gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          +12%
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">Total Complaints</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">From last month</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resolved Complaints */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.resolvedComplaints}</div>
                        <div className="text-xs text-green-600 font-medium">
                          {Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">Resolved</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Resolution rate</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Citizen Satisfaction */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.citizenSatisfaction}%</div>
                        <div className="text-xs text-teal-600 font-medium flex items-center justify-end gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          +5%
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">Satisfaction</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Citizen rating</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Response Time */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.responseTime}</div>
                        <div className="text-xs text-blue-600 font-medium">days</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">Avg Response</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Time to resolve</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Performance Overview - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Complaints Trend Chart */}
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Complaints Trend</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-48 flex items-end justify-between space-x-2">
                    {[65, 45, 78, 52, 89, 67, 47].map((height, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                        <div 
                          className="w-full bg-red-600 rounded-t transition-all duration-300 hover:bg-red-700"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm pt-4 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Average: 63 complaints/day</span>
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <ArrowUpRight className="h-4 w-4" />
                      +8% vs last week
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Department Performance */}
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Department Performance</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    {[
                      { name: "Public Works", efficiency: 92, color: "bg-green-600" },
                      { name: "Public Safety", efficiency: 87, color: "bg-blue-600" },
                      { name: "Planning & Zoning", efficiency: 78, color: "bg-yellow-500" },
                      { name: "Parks & Recreation", efficiency: 85, color: "bg-teal-600" }
                    ].map((dept, index) => (
                      <div key={dept.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 ${dept.color} rounded-full`}></div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{dept.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{dept.efficiency}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 ${dept.color} rounded-full transition-all duration-500`}
                            style={{ width: `${dept.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Recent Complaints - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Complaints</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">Citizen complaints requiring attention</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-32 border-slate-300 dark:border-slate-600">
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
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredComplaints.map((complaint, index) => (
                    <motion.div 
                      key={complaint.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-semibold text-slate-900 dark:text-white text-base">{complaint.title}</h3>
                                <Badge className={`${getPriorityColor(complaint.priority)} text-xs px-2 py-0.5 border-0`}>
                                  {complaint.priority}
                                </Badge>
                                <Badge className={`${getStatusColor(complaint.status)} text-xs px-2 py-0.5 border-0`}>
                                  {complaint.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{complaint.description}</p>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {complaint.citizen}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {complaint.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {complaint.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {complaint.assignedTo}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" className="h-8 border-slate-300 dark:border-slate-600">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="h-8 bg-slate-700 hover:bg-slate-800 text-white border-0">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-full">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Announcements</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">Latest public announcements</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-slate-300 dark:border-slate-600"
                      onClick={() => router.push('/government/announcements')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{announcement.title}</h3>
                              <Badge className={`${getPriorityColor(announcement.priority)} text-xs px-2 py-0.5 border-0`}>
                                {announcement.priority}
                              </Badge>
                              <Badge className={`${getStatusColor(announcement.status)} text-xs px-2 py-0.5 border-0`}>
                                {announcement.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{announcement.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {announcement.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {announcement.views} views
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button size="sm" variant="outline" className="h-8 border-slate-300 dark:border-slate-600">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="h-8 bg-slate-700 hover:bg-slate-800 text-white border-0">
                              <Edit className="h-3 w-3" />
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
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-full">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Applications</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">Pending and recent applications</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" className="border-slate-300 dark:border-slate-600">
                      <Plus className="h-4 w-4 mr-1" />
                      New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{application.type}</h3>
                              <Badge className={`${getPriorityColor(application.priority)} text-xs px-2 py-0.5 border-0`}>
                                {application.priority}
                              </Badge>
                              <Badge className={`${getStatusColor(application.status)} text-xs px-2 py-0.5 border-0`}>
                                {application.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{application.applicant}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {application.submittedDate}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button size="sm" variant="outline" className="h-8 border-slate-300 dark:border-slate-600">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="h-8 bg-slate-700 hover:bg-slate-800 text-white border-0">
                              <CheckCircle className="h-3 w-3" />
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
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Reports</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">Generated reports and analytics</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="border-slate-300 dark:border-slate-600">
                    <Plus className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{report.title}</h3>
                            <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600">{report.type}</Badge>
                            <Badge className={`${getStatusColor(report.status)} text-xs px-2 py-0.5 border-0`}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {report.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {report.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {report.downloadCount} downloads
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" className="h-8 border-slate-300 dark:border-slate-600">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 border-slate-300 dark:border-slate-600">
                            <Download className="h-3 w-3" />
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
