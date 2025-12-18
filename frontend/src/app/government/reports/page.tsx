"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BarChart3, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  ExternalLink,
  Filter,
  SortAsc,
  SortDesc,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
  Bell,
  MapPin,
  Phone,
  Mail,
  Send,
  Archive,
  RefreshCw,
  Zap,
  Target,
  Flag,
  Shield,
  UserCheck,
  FileX,
  CheckSquare,
  AlertOctagon,
  Globe,
  Lock,
  Unlock,
  PieChart,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Megaphone,
  Clipboard,
  Database,
  Server,
  Cpu,
  HardDrive,
  LineChart,
  BarChart,
  PieChart as PieChartIcon
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import React, { useState, useEffect } from "react";

export default function GovernmentReports() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'complaints' | 'applications' | 'announcements' | 'analytics'>('all');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reports will be fetched from API when that feature is implemented
  useEffect(() => {
    // TODO: Implement reports API
    setIsLoading(false);
    setReports([]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "resolved":
      case "published":
      case "approved":
        return "bg-green-600 text-white dark:bg-green-700 dark:text-white";
      case "in_progress":
      case "in progress":
      case "under review":
        return "bg-blue-600 text-white dark:bg-blue-700 dark:text-white";
      case "pending":
      case "pending review":
      case "open":
        return "bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white";
      case "failed":
      case "closed":
      case "archived":
        return "bg-red-600 text-white dark:bg-red-700 dark:text-white";
      case "draft":
        return "bg-gray-500 text-white dark:bg-gray-600 dark:text-white";
      default:
        return "bg-gray-500 text-white dark:bg-gray-600 dark:text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Complaints":
        return FileText;
      case "Applications":
        return Clipboard;
      case "Analytics":
        return BarChart3;
      case "Announcements":
        return Megaphone;
      case "Operations":
        return Activity;
      default:
        return FileText;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <Layout userType="government" userName="David Kim" userEmail="david.kim@city.gov" showPortalNav={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Generate and view comprehensive reports on city operations</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white hover:bg-gray-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button className="bg-[#003153] hover:bg-[#003153]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Total Reports", value: "24", icon: FileText, color: "bg-[#003153]" },
                { title: "This Month", value: "8", icon: Calendar, color: "bg-[#003153]/80" },
                { title: "In Progress", value: "3", icon: Clock, color: "bg-[#003153]/60" },
                { title: "Completed", value: "21", icon: CheckCircle, color: "bg-[#003153]/90" }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mr-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterType} onValueChange={(value: 'all' | 'complaints' | 'applications' | 'announcements' | 'analytics') => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="complaints">Complaints</SelectItem>
                      <SelectItem value="applications">Applications</SelectItem>
                      <SelectItem value="announcements">Announcements</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPeriod} onValueChange={(value: 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly') => setFilterPeriod(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'type') => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {filteredReports.map((report, index) => {
              const TypeIcon = getTypeIcon(report.type);
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#003153]/30 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-[#003153]/10 rounded-lg flex items-center justify-center">
                                      <TypeIcon className="h-5 w-5 text-[#003153]" />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{report.type} • {report.period}</p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{report.description}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {report.created}
                                    </span>
                                    <span className="flex items-center">
                                      <User className="h-4 w-4 mr-1" />
                                      {report.author}
                                    </span>
                                    <span className="flex items-center">
                                      <Building2 className="h-4 w-4 mr-1" />
                                      {report.department}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4">
                                  <Badge className={`${getStatusColor(report.status)} text-xs px-3 py-1`}>
                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Key Metrics: {Object.keys(report.summary).length} data points
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="h-8 text-xs">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8 text-xs">
                                    <Download className="h-3 w-3 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          {report.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                          {report.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Report Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Report Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Type:</span>
                              <p className="text-gray-600 dark:text-gray-300">{report.type}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Period:</span>
                              <p className="text-gray-600 dark:text-gray-300">{report.period}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Author:</span>
                              <p className="text-gray-600 dark:text-gray-300">{report.author}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Department:</span>
                              <p className="text-gray-600 dark:text-gray-300">{report.department}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Created:</span>
                              <p className="text-gray-600 dark:text-gray-300">{report.created}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                              <Badge className={`${getStatusColor(report.status)} text-xs ml-2`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Summary</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(report.summary).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {typeof value === 'object' ? JSON.stringify(value) : value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Insights */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Insights</h4>
                          <ul className="space-y-2">
                            {report.keyInsights.map((insight, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommendations</h4>
                          <ul className="space-y-2">
                            {report.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start">
                                <Target className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button className="bg-[#003153] hover:bg-[#003153]/90">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Charts
                          </Button>
                          <Button variant="outline">
                                <Send className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Reports Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterType !== 'all' || filterPeriod !== 'all'
                  ? 'No reports match your current filters.' 
                  : 'No reports have been generated yet.'}
              </p>
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Generate Your First Report
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
