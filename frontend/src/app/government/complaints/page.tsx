"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
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
  Calendar,
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
  AlertOctagon
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import React, { useState } from "react";

export default function GovernmentComplaints() {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');

  const complaints = [
    {
      id: 1,
      title: "Pothole on Main Street",
      description: "Large pothole causing damage to vehicles near intersection",
      status: "in_progress",
      priority: "high",
      created: "2024-01-15",
      category: "Infrastructure",
      location: "Main Street & 5th Ave",
      assignedTo: "Public Works Dept",
      estimatedResolution: "3 days",
      citizenName: "Maria Lopez",
      citizenEmail: "maria.lopez@email.com",
      citizenPhone: "(555) 123-4567",
      lastUpdated: "2024-01-16",
      comments: [
        {
          id: 1,
          author: "Public Works Dept",
          text: "Work crew assigned. Repair scheduled for tomorrow morning.",
          date: "2024-01-16",
          type: "official"
        }
      ]
    },
    {
      id: 2,
      title: "Street Light Out",
      description: "Street light not working on Oak Avenue",
      status: "resolved",
      priority: "medium",
      created: "2024-01-10",
      category: "Utilities",
      location: "Oak Avenue",
      assignedTo: "Utilities Dept",
      estimatedResolution: "Completed",
      citizenName: "John Smith",
      citizenEmail: "john.smith@email.com",
      citizenPhone: "(555) 234-5678",
      lastUpdated: "2024-01-12",
      comments: [
        {
          id: 2,
          author: "Utilities Dept",
          text: "Light bulb replaced. Issue resolved.",
          date: "2024-01-12",
          type: "official"
        }
      ]
    },
    {
      id: 3,
      title: "Noise Complaint",
      description: "Construction work during night hours",
      status: "open",
      priority: "low",
      created: "2024-01-20",
      category: "Noise",
      location: "Downtown Area",
      assignedTo: "Code Enforcement",
      estimatedResolution: "1 week",
      citizenName: "Lisa Chen",
      citizenEmail: "lisa.chen@email.com",
      citizenPhone: "(555) 345-6789",
      lastUpdated: "2024-01-20",
      comments: []
    },
    {
      id: 4,
      title: "Garbage Collection Issue",
      description: "Garbage not being collected on scheduled days",
      status: "in_progress",
      priority: "medium",
      created: "2024-01-18",
      category: "Sanitation",
      location: "Residential Area",
      assignedTo: "Sanitation Dept",
      estimatedResolution: "2 days",
      citizenName: "Robert Wilson",
      citizenEmail: "robert.wilson@email.com",
      citizenPhone: "(555) 456-7890",
      lastUpdated: "2024-01-19",
      comments: [
        {
          id: 3,
          author: "Sanitation Dept",
          text: "Route adjustment in progress. New schedule will be communicated.",
          date: "2024-01-19",
          type: "official"
        }
      ]
    },
    {
      id: 5,
      title: "Water Leak",
      description: "Water leaking from main line on Elm Street",
      status: "open",
      priority: "high",
      created: "2024-01-22",
      category: "Utilities",
      location: "Elm Street",
      assignedTo: "Water Dept",
      estimatedResolution: "4 hours",
      citizenName: "Sarah Johnson",
      citizenEmail: "sarah.johnson@email.com",
      citizenPhone: "(555) 567-8901",
      lastUpdated: "2024-01-22",
      comments: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return CheckCircle2;
      case "in_progress":
        return Clock3;
      case "open":
        return AlertCircle;
      case "closed":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Complaints Management</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Manage and track citizen complaints and issues</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-[#003153] hover:bg-[#003153]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Complaint
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'open' | 'in_progress' | 'resolved' | 'closed') => setFilterStatus(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={(value: 'all' | 'high' | 'medium' | 'low') => setFilterPriority(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'date' | 'priority' | 'status') => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Complaints List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {filteredComplaints.map((complaint, index) => {
              const StatusIcon = getStatusIcon(complaint.status);
              return (
                <motion.div
                  key={complaint.id}
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
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{complaint.title}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{complaint.description}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {complaint.created}
                                    </span>
                                    <span className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      {complaint.location}
                                    </span>
                                    <span className="flex items-center">
                                      <User className="h-4 w-4 mr-1" />
                                      {complaint.citizenName}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4">
                                  <Badge className={`${getStatusColor(complaint.status)} text-xs px-3 py-1 flex items-center justify-center`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {complaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                  <Badge className={`${getPriorityColor(complaint.priority)} text-xs px-3 py-1`}>
                                    {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Assigned to: <span className="font-medium">{complaint.assignedTo}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="h-8 text-xs">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8 text-xs">
                                    <Edit className="h-3 w-3 mr-1" />
                                    Update
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          {complaint.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                          Complaint Details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Description */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300">{complaint.description}</p>
                        </div>

                        {/* Citizen Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Citizen Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Name:</span>
                              <p className="text-gray-600 dark:text-gray-300">{complaint.citizenName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Email:</span>
                              <p className="text-gray-600 dark:text-gray-300">{complaint.citizenEmail}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Phone:</span>
                              <p className="text-gray-600 dark:text-gray-300">{complaint.citizenPhone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Location and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h4>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <MapPin className="h-4 w-4 mr-2" />
                              {complaint.location}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Date Submitted</h4>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Calendar className="h-4 w-4 mr-2" />
                              {complaint.created}
                            </div>
                          </div>
                        </div>

                        {/* Status and Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h4>
                            <Badge className={`${getStatusColor(complaint.status)} text-xs text-center`}>
                              {complaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Priority</h4>
                            <Badge className={`${getPriorityColor(complaint.priority)} text-xs text-center`}>
                              {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {/* Assigned Department */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Assigned Department</h4>
                          <p className="text-gray-600 dark:text-gray-300">{complaint.assignedTo}</p>
                        </div>

                        {/* Estimated Resolution */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Estimated Resolution</h4>
                          <p className="text-gray-600 dark:text-gray-300">{complaint.estimatedResolution}</p>
                        </div>

                        {/* Comments Section */}
                        {complaint.comments.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Comments & Updates</h4>
                            <div className="space-y-3">
                              {complaint.comments.map((comment) => (
                                <div key={comment.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.author}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{comment.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button className="bg-[#003153] hover:bg-[#003153]/90">
                            <Edit className="h-4 w-4 mr-2" />
                            Update Status
                          </Button>
                          <Button variant="outline">
                            <Send className="h-4 w-4 mr-2" />
                            Notify Citizen
                          </Button>
                          <Button variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
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
          {filteredComplaints.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Complaints Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'No complaints match your current filters.' 
                  : 'No complaints have been submitted yet.'}
              </p>
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Complaint
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
