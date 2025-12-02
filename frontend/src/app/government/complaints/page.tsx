"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
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
  AlertOctagon,
  Image as ImageIcon,
  X
} from "lucide-react";
import Image from "next/image";
import Layout from "@/components/layout/Layout";
import { complaintsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";

export default function GovernmentComplaints() {
  const { user } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingNotification, setIsSubmittingNotification] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [currentComplaintId, setCurrentComplaintId] = useState<number | null>(null);

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const statusFilter = filterStatus === 'all' ? undefined : filterStatus;
        const priorityFilter = filterPriority === 'all' ? undefined : filterPriority;
        const data = await complaintsApi.list({ 
          status: statusFilter,
          priority: priorityFilter 
        });
        // Map API response to match frontend format
        const mappedData = data.map((complaint: any) => ({
          id: complaint.id,
          title: complaint.title,
          description: complaint.description,
          status: complaint.status,
          priority: complaint.priority,
          created: complaint.created,
          category: complaint.category,
          location: complaint.location || '',
          assignedTo: complaint.assignedTo || '',
          estimatedResolution: complaint.estimatedResolution || '',
          citizenName: complaint.citizenName || "Citizen",
          citizenEmail: complaint.citizenEmail || "",
          citizenPhone: complaint.citizenPhone || "",
          lastUpdated: complaint.created, // Use created date as last updated for now
          comments: complaint.comments || [],
          attachments: complaint.attachments || []
        }));
        setComplaints(mappedData);
      } catch (err: any) {
        console.error('Error fetching complaints:', err);
        setError(err.message || 'Failed to load complaints');
        setComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchComplaints();
    }
  }, [user, filterStatus, filterPriority]);

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

  const handleAddComment = async (complaintId: number) => {
    if (!commentText.trim()) {
      return;
    }
    setIsSubmittingComment(true);
    try {
      await complaintsApi.comments.create(complaintId, commentText);
      // Refresh complaints
      const statusFilter = filterStatus === 'all' ? undefined : filterStatus;
      const priorityFilter = filterPriority === 'all' ? undefined : priorityFilter;
      const data = await complaintsApi.list({ 
        status: statusFilter,
        priority: priorityFilter 
      });
      const mappedData = data.map((complaint: any) => ({
        id: complaint.id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        priority: complaint.priority,
        created: complaint.created,
        category: complaint.category,
        location: complaint.location || '',
        assignedTo: complaint.assignedTo || '',
        estimatedResolution: complaint.estimatedResolution || '',
        citizenName: complaint.citizenName || "Citizen",
        citizenEmail: complaint.citizenEmail || "",
        citizenPhone: complaint.citizenPhone || "",
        lastUpdated: complaint.created,
        comments: complaint.comments || [],
        attachments: complaint.attachments || []
      }));
      setComplaints(mappedData);
      setCommentText("");
      setIsCommentDialogOpen(false);
    } catch (err: any) {
      console.error('Error adding comment:', err);
      alert(err.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleNotifyCitizen = async (complaintId: number) => {
    setIsSubmittingNotification(true);
    try {
      await complaintsApi.notifications.create(complaintId, notificationMessage || undefined);
      // Refresh complaints
      const statusFilter = filterStatus === 'all' ? undefined : filterStatus;
      const priorityFilter = filterPriority === 'all' ? undefined : priorityFilter;
      const data = await complaintsApi.list({ 
        status: statusFilter,
        priority: priorityFilter 
      });
      const mappedData = data.map((complaint: any) => ({
        id: complaint.id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        priority: complaint.priority,
        created: complaint.created,
        category: complaint.category,
        location: complaint.location || '',
        assignedTo: complaint.assignedTo || '',
        estimatedResolution: complaint.estimatedResolution || '',
        citizenName: complaint.citizenName || "Citizen",
        citizenEmail: complaint.citizenEmail || "",
        citizenPhone: complaint.citizenPhone || "",
        lastUpdated: complaint.created,
        comments: complaint.comments || [],
        attachments: complaint.attachments || []
      }));
      setComplaints(mappedData);
      setNotificationMessage("");
      setIsNotifyDialogOpen(false);
      alert('Citizen notified successfully!');
    } catch (err: any) {
      console.error('Error notifying citizen:', err);
      alert(err.message || 'Failed to notify citizen');
    } finally {
      setIsSubmittingNotification(false);
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Complaints Management</h1>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Manage and track citizen complaints and issues</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-slate-700 hover:bg-slate-800 text-white border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    New Complaint
                  </Button>
                </div>
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
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
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
                      <Card className="hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer">
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

                              {/* Attachments Preview */}
                              {complaint.attachments && complaint.attachments.length > 0 && (
                                <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Attachments ({complaint.attachments.length})
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    {complaint.attachments.slice(0, 3).map((attachment: any) => {
                                      const isImage = attachment.file_type?.startsWith('image/') || 
                                                     ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => 
                                                       attachment.file_name?.toLowerCase().endsWith(ext));
                                      return (
                                        <div key={attachment.id} className="relative group">
                                          {isImage && attachment.file_url ? (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                                              <Image
                                                src={attachment.file_url}
                                                alt={attachment.file_name}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                              />
                                            </div>
                                          ) : (
                                            <div className="w-16 h-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                              <FileText className="h-6 w-6 text-gray-400" />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                    {complaint.attachments.length > 3 && (
                                      <div className="w-16 h-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">+{complaint.attachments.length - 3}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
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

                        {/* Attachments Section */}
                        {complaint.attachments && complaint.attachments.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                              Attachments ({complaint.attachments.length})
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {complaint.attachments.map((attachment: any) => {
                                const isImage = attachment.file_type?.startsWith('image/') || 
                                               ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => 
                                                 attachment.file_name?.toLowerCase().endsWith(ext));
                                return (
                                  <div key={attachment.id} className="relative group">
                                    {isImage && attachment.file_url ? (
                                      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                                        <Image
                                          src={attachment.file_url}
                                          alt={attachment.file_name}
                                          fill
                                          className="object-cover"
                                          unoptimized
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                          <a
                                            href={attachment.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <Eye className="h-6 w-6 text-white" />
                                          </a>
                                        </div>
                                      </div>
                                    ) : (
                                      <a
                                        href={attachment.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                      >
                                        <FileText className="h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-600 dark:text-gray-300 text-center truncate w-full">
                                          {attachment.file_name}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                          {(attachment.file_size / 1024).toFixed(1)} KB
                                        </p>
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Comments Section */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Comments & Updates {complaint.comments.length > 0 && `(${complaint.comments.length})`}
                          </h4>
                          {complaint.comments.length > 0 ? (
                            <div className="space-y-3 mb-4">
                              {complaint.comments.map((comment: any) => (
                                <div 
                                  key={comment.id} 
                                  className={`p-3 border rounded-lg ${
                                    comment.is_notification 
                                      ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' 
                                      : 'border-gray-200 dark:border-gray-700'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.author}</span>
                                      {comment.is_notification && (
                                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5">
                                          <Bell className="h-3 w-3 mr-1" />
                                          Notification
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{comment.text}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No comments yet.</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button className="bg-slate-700 hover:bg-slate-800 text-white border-0">
                            <Edit className="h-4 w-4 mr-2" />
                            Update Status
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setCurrentComplaintId(complaint.id);
                              setNotificationMessage("");
                              setIsNotifyDialogOpen(true);
                            }}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Notify Citizen
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setCurrentComplaintId(complaint.id);
                              setCommentText("");
                              setIsCommentDialogOpen(true);
                            }}
                          >
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
              <Button className="bg-slate-700 hover:bg-slate-800 text-white border-0">
                <Plus className="h-4 w-4 mr-2" />
                Create New Complaint
              </Button>
            </motion.div>
          )}
        </div>

        {/* Add Comment Dialog */}
        <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Add Comment
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Add a comment or update to this complaint
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                  Comment <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter your comment or update..."
                  className="min-h-[120px]"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {commentText.length}/1000
                </p>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCommentDialogOpen(false)}
                  className="flex-1"
                  disabled={isSubmittingComment}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => currentComplaintId && handleAddComment(currentComplaintId)}
                  className="flex-1 bg-[#003153] hover:bg-[#003153]/90 text-white"
                  disabled={!commentText.trim() || isSubmittingComment}
                >
                  {isSubmittingComment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notify Citizen Dialog */}
        <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notify Citizen
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300">
                Send a notification to the citizen about this complaint update
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                  Notification Message (Optional)
                </label>
                <Textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Leave empty to use default notification message, or enter a custom message..."
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {notificationMessage.length}/500. If left empty, a default message will be sent.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <Bell className="h-3 w-3 inline mr-1" />
                  The citizen will be notified about this complaint update. In a production system, this would send an email or SMS notification.
                </p>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNotifyDialogOpen(false)}
                  className="flex-1"
                  disabled={isSubmittingNotification}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => currentComplaintId && handleNotifyCitizen(currentComplaintId)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmittingNotification}
                >
                  {isSubmittingNotification ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Notification
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
