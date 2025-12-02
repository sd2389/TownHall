"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Filter, Plus, Eye, Edit, Search, FileText, Image as ImageIcon, Download, X, Calendar, Loader2, Upload, Trash2, Bell, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { complaintsApi } from "@/lib/api";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export default function CitizenComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("open");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [complaintToClose, setComplaintToClose] = useState<any>(null);
  const [isClosing, setIsClosing] = useState(false);

  const COMPLAINT_CATEGORIES = [
    { value: "infrastructure", label: "Infrastructure" },
    { value: "utilities", label: "Utilities" },
    { value: "public_safety", label: "Public Safety" },
    { value: "environment", label: "Environment" },
    { value: "traffic", label: "Traffic & Parking" },
    { value: "noise", label: "Noise Complaint" },
    { value: "code_enforcement", label: "Code Enforcement" },
    { value: "parks_recreation", label: "Parks & Recreation" },
    { value: "waste_management", label: "Waste Management" },
    { value: "other", label: "Other" },
  ];

  const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const filters: any = {};
        if (statusFilter !== 'all') filters.status = statusFilter;
        if (priorityFilter !== 'all') filters.priority = priorityFilter;
        
        const data = await complaintsApi.list(filters);
        setComplaints(data);
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
  }, [user, statusFilter, priorityFilter]);

  // Populate edit form when complaint is selected and dialog opens
  useEffect(() => {
    if (isEditDialogOpen && selectedComplaint) {
      setEditFormData({
        title: selectedComplaint.title || "",
        description: selectedComplaint.description || "",
        category: selectedComplaint.category || "",
        location: selectedComplaint.location || "",
        priority: selectedComplaint.priority || "medium",
      });
      setEditError(null);
      setAttachmentsToDelete([]);
      setNewFiles([]);
    }
  }, [isEditDialogOpen, selectedComplaint]);

  const isImageFile = (file: File | any): boolean => {
    if (file instanceof File) {
      return file.type.startsWith('image/');
    }
    return file.file_type?.startsWith('image/') || 
           ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => 
             file.file_name?.toLowerCase().endsWith(ext));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleCloseComplaint = async () => {
    if (!complaintToClose) return;
    
    setIsClosing(true);
    try {
      await complaintsApi.update(complaintToClose.id, { status: 'closed' });
      // Refresh complaints list
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (priorityFilter !== 'all') filters.priority = priorityFilter;
      const data = await complaintsApi.list(filters);
      setComplaints(data);
      setIsCloseDialogOpen(false);
      setComplaintToClose(null);
      // Switch to closed tab after closing
      setActiveTab('closed');
    } catch (err: any) {
      console.error('Error closing complaint:', err);
      alert(err.message || 'Failed to close complaint');
    } finally {
      setIsClosing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => {
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        const validTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf',
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ];
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.txt'];
        const hasValidType = validTypes.includes(fileType);
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        return hasValidType || hasValidExtension;
      });
      
      const remainingSlots = 5 - (selectedComplaint?.attachments?.length || 0) + attachmentsToDelete.length - newFiles.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      
      const validSizeFiles = filesToAdd.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          setEditError(`${file.name} is too large. Maximum file size is 10MB.`);
          return false;
        }
        return true;
      });
      
      setNewFiles(prev => [...prev, ...validSizeFiles]);
      setEditError(null);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const markAttachmentForDeletion = (attachmentId: number) => {
    setAttachmentsToDelete(prev => [...prev, attachmentId]);
  };

  const unmarkAttachmentForDeletion = (attachmentId: number) => {
    setAttachmentsToDelete(prev => prev.filter(id => id !== attachmentId));
  };

  // Filter complaints by search term, status, priority, and tab
  const filteredComplaints = complaints.filter(complaint => {
    // Filter by tab (open vs closed)
    const matchesTab = activeTab === 'open' 
      ? complaint.status !== 'closed' 
      : complaint.status === 'closed';
    
    // Filter by search term
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status (only apply if not filtering by closed tab)
    const matchesStatus = statusFilter === 'all' || 
                         (activeTab === 'open' && complaint.status === statusFilter) ||
                         (activeTab === 'closed' && statusFilter === 'all');
    
    // Filter by priority
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    
    return matchesTab && matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "closed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "bg-red-600 text-white dark:bg-red-700 dark:text-white";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <ProtectedRoute allowedRoles={['citizen']}>
      <Layout userType="citizen" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
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
                <Button 
                  size="lg" 
                  className="bg-white text-[#003153] hover:bg-blue-50 font-semibold shadow-md"
                  onClick={() => {
                    window.location.href = '/citizen/complaints/create';
                  }}
                >
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
                <CardTitle className="text-xl font-bold">My Complaints</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="open" className="data-[state=active]:bg-[#003153] data-[state=active]:text-white">
                    Open Complaints ({complaints.filter(c => c.status !== 'closed').length})
                  </TabsTrigger>
                  <TabsTrigger value="closed" className="data-[state=active]:bg-[#003153] data-[state=active]:text-white">
                    Closed Complaints ({complaints.filter(c => c.status === 'closed').length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="open" className="mt-0">
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="border-2 focus:border-[#003153]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="border-2 focus:border-[#003153]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003153]"></div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">Loading complaints...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 dark:text-red-400">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-[#003153] hover:bg-[#003153]/90 text-white"
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'No complaints match your filters.' 
                      : 'No complaints yet. File your first complaint to get started!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
              {filteredComplaints.map((c, index) => (
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
                        {(c.priority === 'high' || c.priority === 'urgent') && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                        {/* Notification Badge */}
                        {c.comments && c.comments.length > 0 && (
                          <Badge className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1 px-2 py-0.5 animate-pulse">
                            <Bell className="h-3 w-3" />
                            {c.comments.filter((comment: any) => comment.is_notification).length} Update{c.comments.filter((comment: any) => comment.is_notification).length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">{c.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      {c.location && (
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-[#003153]" /> {c.location}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-[#003153]" /> {c.created}
                      </span>
                      {c.category && (
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-[#003153]" /> {c.category}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(c.status)} text-xs font-semibold px-3 py-1`}>
                        {c.status.replace("_", " ").charAt(0).toUpperCase() + c.status.replace("_", " ").slice(1)}
                      </Badge>
                      <Badge className={`${getPriorityColor(c.priority)} text-xs font-semibold px-2 py-1`}>
                        {c.priority?.charAt(0).toUpperCase() + c.priority?.slice(1) || 'Medium'}
                      </Badge>
                    </div>
                  </div>

                  {/* Notifications/Updates Preview */}
                  {c.comments && c.comments.filter((comment: any) => comment.is_notification).length > 0 && (
                    <div className="mb-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                          Latest Update from Government
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        {(() => {
                          const latestNotification = c.comments
                            .filter((comment: any) => comment.is_notification)
                            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                          return (
                            <div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                {latestNotification.text}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  by {latestNotification.author}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {latestNotification.date}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      {c.comments.filter((comment: any) => comment.is_notification).length > 1 && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          +{c.comments.filter((comment: any) => comment.is_notification).length - 1} more update{c.comments.filter((comment: any) => comment.is_notification).length - 1 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Attachments Preview */}
                  {c.attachments && c.attachments.length > 0 && (
                    <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Attachments ({c.attachments.length})
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {c.attachments.slice(0, 3).map((attachment: any) => {
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
                        {c.attachments.length > 3 && (
                          <div className="w-16 h-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">+{c.attachments.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    {c.assignedTo && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Assigned to: <span className="font-bold text-[#003153]">{c.assignedTo}</span>
                      </div>
                    )}
                    {c.estimatedResolution && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Est. Resolution: <span className="font-medium text-gray-700 dark:text-gray-300">{c.estimatedResolution}</span>
                      </div>
                    )}
                    {!c.assignedTo && !c.estimatedResolution && <div></div>}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 hover:bg-[#003153]/10 hover:text-[#003153]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComplaint(c);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 hover:bg-[#003153]/10 hover:text-[#003153]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComplaint(c);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
                </div>
              )}
                </TabsContent>

                <TabsContent value="closed" className="mt-0">
                  {/* Search and Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search complaints..." 
                        className="pl-10 border-2 focus:border-[#003153]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="border-2 focus:border-[#003153]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003153]"></div>
                      <p className="mt-4 text-gray-500 dark:text-gray-400">Loading complaints...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-500 dark:text-red-400">{error}</p>
                      <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-[#003153] hover:bg-[#003153]/90 text-white"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : filteredComplaints.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm || priorityFilter !== 'all' 
                          ? 'No closed complaints match your filters.' 
                          : 'No closed complaints yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                  {filteredComplaints.map((c, index) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="p-6 border-l-4 border-gray-400 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{c.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">{c.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                          {c.location && (
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-[#003153]" /> {c.location}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-[#003153]" /> {c.created}
                          </span>
                          {c.category && (
                            <span className="flex items-center">
                              <FileText className="h-4 w-4 mr-1 text-[#003153]" /> {c.category}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${getStatusColor(c.status)} text-xs font-semibold px-3 py-1`}>
                            {c.status.replace("_", " ").charAt(0).toUpperCase() + c.status.replace("_", " ").slice(1)}
                          </Badge>
                          <Badge className={`${getPriorityColor(c.priority)} text-xs font-semibold px-2 py-1`}>
                            {c.priority?.charAt(0).toUpperCase() + c.priority?.slice(1) || 'Medium'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div></div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 hover:bg-[#003153]/10 hover:text-[#003153]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComplaint(c);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* View Complaint Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              {selectedComplaint && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedComplaint.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300">
                      Complaint Details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                      <p className="text-gray-600 dark:text-gray-300">{selectedComplaint.description}</p>
                    </div>

                    {/* Location and Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedComplaint.location && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h4>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <MapPin className="h-4 w-4 mr-2" />
                            {selectedComplaint.location}
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Date Submitted</h4>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          {selectedComplaint.created}
                        </div>
                      </div>
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h4>
                        <Badge className={`${getStatusColor(selectedComplaint.status)} text-xs`}>
                          {selectedComplaint.status.replace("_", " ").charAt(0).toUpperCase() + selectedComplaint.status.replace("_", " ").slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Priority</h4>
                        <Badge className={`${getPriorityColor(selectedComplaint.priority)} text-xs`}>
                          {selectedComplaint.priority?.charAt(0).toUpperCase() + selectedComplaint.priority?.slice(1) || 'Medium'}
                        </Badge>
                      </div>
                    </div>

                    {/* Category */}
                    {selectedComplaint.category && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Category</h4>
                        <p className="text-gray-600 dark:text-gray-300">{selectedComplaint.category}</p>
                      </div>
                    )}

                    {/* Assigned To */}
                    {selectedComplaint.assignedTo && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Assigned To</h4>
                        <p className="text-gray-600 dark:text-gray-300">{selectedComplaint.assignedTo}</p>
                      </div>
                    )}

                    {/* Estimated Resolution */}
                    {selectedComplaint.estimatedResolution && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Estimated Resolution</h4>
                        <p className="text-gray-600 dark:text-gray-300">{selectedComplaint.estimatedResolution}</p>
                      </div>
                    )}

                    {/* Notifications/Updates from Government */}
                    {selectedComplaint.comments && selectedComplaint.comments.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Bell className="h-4 w-4 text-blue-600" />
                          Updates & Notifications ({selectedComplaint.comments.filter((c: any) => c.is_notification).length})
                        </h4>
                        <div className="space-y-3">
                          {selectedComplaint.comments
                            .filter((comment: any) => comment.is_notification)
                            .map((comment: any) => (
                              <div
                                key={comment.id}
                                className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                                      {comment.author}
                                    </span>
                                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5">
                                      Notification
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{comment.text}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Attachments ({selectedComplaint.attachments.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {selectedComplaint.attachments.map((attachment: any) => {
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

                    {/* Close Complaint Button */}
                    {selectedComplaint.status !== 'closed' && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                          onClick={() => {
                            setComplaintToClose(selectedComplaint);
                            setIsCloseDialogOpen(true);
                            setIsViewDialogOpen(false);
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Close This Complaint
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Close Complaint Confirmation Dialog */}
          <AlertDialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Close Complaint
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to close this complaint? This action will mark the complaint as closed and you won't be able to edit it afterwards.
                  {complaintToClose && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{complaintToClose.title}</p>
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isClosing}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCloseComplaint}
                  disabled={isClosing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isClosing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Closing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Close Complaint
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Edit Complaint Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditError(null);
            }
          }}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              {selectedComplaint && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      Edit Complaint
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300">
                      Update your complaint details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {selectedComplaint.status !== 'pending' && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          This complaint cannot be edited because it is {selectedComplaint.status.replace("_", " ")}. Only pending complaints can be edited.
                        </p>
                      </div>
                    )}

                    {editError && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm text-red-800 dark:text-red-200">{editError}</p>
                      </div>
                    )}

                    {selectedComplaint.status === 'pending' && (
                      <form key={`edit-form-${selectedComplaint.id}-${isEditDialogOpen}`} onSubmit={async (e) => {
                        e.preventDefault();
                        setEditError(null);
                        setIsSubmitting(true);
                        try {
                          // Check if we need to use FormData (for file uploads or deletions)
                          const hasFileChanges = newFiles.length > 0 || attachmentsToDelete.length > 0;
                          
                          if (hasFileChanges) {
                            // Use FormData for file uploads
                            const formData = new FormData();
                            formData.append('title', editFormData.title);
                            formData.append('description', editFormData.description);
                            formData.append('category', editFormData.category);
                            if (editFormData.location) formData.append('location', editFormData.location);
                            if (editFormData.priority) formData.append('priority', editFormData.priority);
                            
                            // Add attachments to delete
                            attachmentsToDelete.forEach(id => {
                              formData.append('delete_attachments', id.toString());
                            });
                            
                            // Add new files
                            newFiles.forEach((file) => {
                              formData.append('files', file);
                            });
                            
                            const token = getAuthToken();
                            const headers: HeadersInit = {};
                            if (token) {
                              headers['Authorization'] = `Token ${token}`;
                            }
                            
                            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                            const response = await fetch(`${API_BASE_URL}/citizen/complaints/${selectedComplaint.id}/`, {
                              method: 'PATCH',
                              headers: headers,
                              body: formData,
                            });
                            
                            if (!response.ok) {
                              const error = await response.json();
                              throw new Error(error.error || 'Failed to update complaint');
                            }
                            
                            await response.json();
                          } else {
                            // Use regular JSON for text-only updates
                            await complaintsApi.update(selectedComplaint.id, {
                              title: editFormData.title,
                              description: editFormData.description,
                              category: editFormData.category,
                              location: editFormData.location,
                              priority: editFormData.priority,
                            });
                          }
                          
                          // Refresh complaints list
                          const filters: any = {};
                          if (statusFilter !== 'all') filters.status = statusFilter;
                          if (priorityFilter !== 'all') filters.priority = priorityFilter;
                          const data = await complaintsApi.list(filters);
                          setComplaints(data);
                          setIsEditDialogOpen(false);
                        } catch (err: any) {
                          setEditError(err.message || 'Failed to update complaint');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }} className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={editFormData.title}
                            onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                            required
                            className="mt-1"
                            maxLength={200}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <Select
                            value={editFormData.category}
                            onValueChange={(value) => setEditFormData({...editFormData, category: value})}
                            required
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {COMPLAINT_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">
                            Location
                          </label>
                          <Input
                            value={editFormData.location}
                            onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                            className="mt-1"
                            maxLength={200}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">
                            Priority
                          </label>
                          <Select
                            value={editFormData.priority}
                            onValueChange={(value) => setEditFormData({...editFormData, priority: value})}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PRIORITY_OPTIONS.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-900 dark:text-white">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <Textarea
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                            required
                            className="mt-1 min-h-[150px]"
                            maxLength={2000}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {editFormData.description.length}/2000
                          </p>
                        </div>

                        {/* Existing Attachments */}
                        {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                          <div>
                            <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                              Existing Attachments
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {selectedComplaint.attachments.map((attachment: any) => {
                                const isMarkedForDeletion = attachmentsToDelete.includes(attachment.id);
                                return (
                                  <div key={attachment.id} className={`relative group ${isMarkedForDeletion ? 'opacity-50' : ''}`}>
                                    {isImageFile(attachment) && attachment.file_url ? (
                                      <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                                        <Image
                                          src={attachment.file_url}
                                          alt={attachment.file_name}
                                          fill
                                          className="object-cover"
                                          unoptimized
                                        />
                                        {isMarkedForDeletion && (
                                          <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                                            <X className="h-6 w-6 text-white" />
                                          </div>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isMarkedForDeletion) {
                                              unmarkAttachmentForDeletion(attachment.id);
                                            } else {
                                              markAttachmentForDeletion(attachment.id);
                                            }
                                          }}
                                          className={`absolute top-2 right-2 p-1.5 rounded-full ${
                                            isMarkedForDeletion 
                                              ? 'bg-green-500 hover:bg-green-600' 
                                              : 'bg-red-500 hover:bg-red-600'
                                          } text-white transition-colors`}
                                        >
                                          {isMarkedForDeletion ? (
                                            <X className="h-4 w-4" />
                                          ) : (
                                            <Trash2 className="h-4 w-4" />
                                          )}
                                        </button>
                                      </div>
                                    ) : (
                                      <div className={`relative p-3 rounded-lg border-2 ${
                                        isMarkedForDeletion ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                      } bg-gray-50 dark:bg-gray-800`}>
                                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-xs text-gray-600 dark:text-gray-300 text-center truncate">
                                          {attachment.file_name}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                                          {formatFileSize(attachment.file_size)}
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isMarkedForDeletion) {
                                              unmarkAttachmentForDeletion(attachment.id);
                                            } else {
                                              markAttachmentForDeletion(attachment.id);
                                            }
                                          }}
                                          className={`absolute top-1 right-1 p-1 rounded-full ${
                                            isMarkedForDeletion 
                                              ? 'bg-green-500 hover:bg-green-600' 
                                              : 'bg-red-500 hover:bg-red-600'
                                          } text-white transition-colors`}
                                        >
                                          {isMarkedForDeletion ? (
                                            <X className="h-3 w-3" />
                                          ) : (
                                            <Trash2 className="h-3 w-3" />
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            {attachmentsToDelete.length > 0 && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                {attachmentsToDelete.length} attachment(s) marked for deletion
                              </p>
                            )}
                          </div>
                        )}

                        {/* Add New Attachments */}
                        <div>
                          <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                            Add New Attachments (Optional)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-[#003153] transition-colors">
                            <input
                              type="file"
                              id="edit-files"
                              multiple
                              accept="image/*,.pdf,.doc,.docx,.txt"
                              onChange={handleFileChange}
                              className="hidden"
                              disabled={(selectedComplaint?.attachments?.length || 0) - attachmentsToDelete.length + newFiles.length >= 5}
                            />
                            <label
                              htmlFor="edit-files"
                              className={`cursor-pointer ${(selectedComplaint?.attachments?.length || 0) - attachmentsToDelete.length + newFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Images, PDFs, Documents (Max 5 total, 10MB each)
                              </p>
                            </label>
                          </div>
                          
                          {/* New Files Preview */}
                          {newFiles.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                New Files ({newFiles.length}):
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {newFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                  >
                                    {isImageFile(file) ? (
                                      <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(file.size)}
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeNewFile(index)}
                                      className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                                    >
                                      <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="flex-1"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-[#003153] hover:bg-[#003153]/90 text-white"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Complaint
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
