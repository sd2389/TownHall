"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Megaphone, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  CheckCircle2,
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
  BarChart3,
  TrendingUp,
  Users,
  Eye as EyeIcon
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { announcementsApi, departmentsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";

export default function GovernmentAnnouncements() {
  const { user } = useAuth();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [filterType, setFilterType] = useState<'all' | 'event' | 'alert' | 'meeting' | 'policy'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'status'>('date');
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcementQuestions, setAnnouncementQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    department_id: '',
    priority: 'medium',
    type: 'alert',
    is_published: true, // Default to published so citizens can see it
    tags: [] as string[],
  });

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const statusFilter = filterStatus === 'all' ? undefined : filterStatus;
        const typeFilter = filterType === 'all' ? undefined : filterType;
        const response = await announcementsApi.list({ 
          status: statusFilter,
          type: typeFilter 
        });
        // Handle both array response and object with announcements (for backward compatibility)
        const data = Array.isArray(response) ? response : (response.announcements || []);
        // Map API response to match frontend format
        const mappedData = data.map((announcement: any) => ({
          id: announcement.id,
          title: announcement.title,
          description: announcement.description,
          content: announcement.content,
          date: announcement.date,
          priority: announcement.priority,
          type: announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1), // Capitalize first letter
          status: announcement.status,
          views: announcement.views || 0,
          author: announcement.author,
          department: announcement.department,
          tags: announcement.tags || [],
          lastUpdated: announcement.lastUpdated,
          publishDate: announcement.publishDate,
          expiryDate: announcement.expiryDate,
          question_count: announcement.question_count || 0,
          answered_count: announcement.answered_count || 0,
          pending_count: announcement.pending_count || 0,
        }));
        setAnnouncements(mappedData);
      } catch (err: any) {
        console.error('Error fetching announcements:', err);
        setError(err.message || 'Failed to load announcements');
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAnnouncements();
    }
  }, [user, filterStatus, filterType]);

  // Fetch departments for form
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentsApi.list();
        setDepartments(data);
      } catch (err: any) {
        console.error('Error fetching departments:', err);
      }
    };

    if (user) {
      fetchDepartments();
    }
  }, [user]);

  // Fetch questions for an announcement
  const fetchAnnouncementQuestions = async (announcementId: number) => {
    try {
      setIsLoadingQuestions(true);
      const questions = await announcementsApi.questions.list(announcementId);
      setAnnouncementQuestions(questions);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      setAnnouncementQuestions([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Handle answering a question
  const handleAnswerQuestion = async (questionId: number) => {
    if (!answerText.trim()) {
      alert('Please enter an answer');
      return;
    }

    try {
      setIsSubmittingAnswer(true);
      if (!selectedAnnouncement) {
        alert('No announcement selected');
        return;
      }
      await announcementsApi.questions.answers.create(selectedAnnouncement.id, questionId, answerText.trim());
      
      // Refresh questions
      await fetchAnnouncementQuestions(selectedAnnouncement.id);
      
      setAnswerText("");
      setSelectedQuestionId(null);
    } catch (err: any) {
      console.error('Error answering question:', err);
      alert(err.message || 'Failed to submit answer');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.department_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await announcementsApi.create({
        title: formData.title,
        content: formData.content,
        description: formData.description,
        department_id: parseInt(formData.department_id),
        priority: formData.priority,
        type: formData.type,
        is_published: formData.is_published,
        tags: formData.tags,
      });
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        content: '',
        department_id: '',
        priority: 'medium',
        type: 'alert',
        is_published: true, // Default to published so citizens can see it
        tags: [],
      });
      setIsCreateDialogOpen(false);
      
      // Refresh announcements
      const statusFilter = filterStatus === 'all' ? undefined : filterStatus;
      const typeFilter = filterType === 'all' ? undefined : filterType;
      const response = await announcementsApi.list({ 
        status: statusFilter,
        type: typeFilter 
      });
      // Handle both array response and object with announcements (for backward compatibility)
      const data = Array.isArray(response) ? response : (response.announcements || []);
      const mappedData = data.map((announcement: any) => ({
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        content: announcement.content,
        date: announcement.date,
        priority: announcement.priority,
        type: announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1),
        status: announcement.status,
        views: announcement.views,
        author: announcement.author,
        department: announcement.department,
        tags: announcement.tags || [],
        lastUpdated: announcement.lastUpdated,
        publishDate: announcement.publishDate,
        expiryDate: announcement.expiryDate,
      }));
      setAnnouncements(mappedData);
    } catch (err: any) {
      console.error('Error creating announcement:', err);
      alert(err.message || 'Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "published":
      case "resolved":
      case "completed":
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
      case "draft":
        return "bg-gray-500 text-white dark:bg-gray-600 dark:text-white";
      case "archived":
      case "closed":
      case "failed":
        return "bg-gray-500 text-white dark:bg-gray-600 dark:text-white";
      default:
        return "bg-gray-500 text-white dark:bg-gray-600 dark:text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
      case "high":
        return "bg-red-600 text-white dark:bg-red-700 dark:text-white";
      case "medium":
        return "bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white";
      case "low":
        return "bg-green-600 text-white dark:bg-green-700 dark:text-white";
      default:
        return "bg-gray-500 text-white dark:bg-gray-600 dark:text-white";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "alert":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "event":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "meeting":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "policy":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return CheckCircle2;
      case "draft":
        return Clock3;
      case "archived":
        return Archive;
      default:
        return AlertCircle;
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    const matchesType = filterType === 'all' || announcement.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
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
                    <div className="w-10 h-10 bg-[#003153] rounded-lg flex items-center justify-center">
                      <Megaphone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Announcements</h1>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Create and manage public announcements and notices</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    className="bg-[#003153] hover:bg-[#003153]/90 text-white border-0"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
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
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'draft' | 'published' | 'archived') => setFilterStatus(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={(value: 'all' | 'event' | 'alert' | 'meeting' | 'policy') => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'date' | 'views' | 'status') => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="views">Views</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAnnouncements.map((announcement, index) => {
              const StatusIcon = getStatusIcon(announcement.status);
              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {announcement.title}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                {announcement.description}
                              </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(announcement.status)} text-xs ml-3 px-2 py-1 flex items-center justify-center`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Quick Info Badges */}
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`${getTypeColor(announcement.type)} text-xs px-2.5 py-1`}>
                              {announcement.type}
                            </Badge>
                            <Badge className={`${getPriorityColor(announcement.priority)} text-xs px-2.5 py-1`}>
                              {announcement.priority?.charAt(0).toUpperCase() + announcement.priority?.slice(1) || 'Medium'}
                            </Badge>
                            {announcement.tags && announcement.tags.length > 0 && (
                              <Badge variant="outline" className="text-xs px-2.5 py-1">
                                {announcement.tags.length} {announcement.tags.length === 1 ? 'tag' : 'tags'}
                              </Badge>
                            )}
                          </div>

                          {/* Metadata Grid */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400 truncate">{announcement.author}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400 truncate">{announcement.department}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400">{announcement.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Eye className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400">{announcement.views || 0} views</span>
                            </div>
                          </div>

                          {/* Questions/Comments Section */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Questions
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {announcement.question_count > 0 && (
                                  <>
                                    <div className="flex items-center gap-1">
                                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-0.5">
                                        {announcement.answered_count || 0} answered
                                      </Badge>
                                    </div>
                                    {announcement.pending_count > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2 py-0.5">
                                          {announcement.pending_count} pending
                                        </Badge>
                                      </div>
                                    )}
                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                      {announcement.question_count}
                                    </span>
                                  </>
                                )}
                                {(!announcement.question_count || announcement.question_count === 0) && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    No questions yet
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Content Preview */}
                          {announcement.content && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                {announcement.content}
                              </p>
                            </div>
                          )}
                          
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 h-8 text-xs hover:bg-slate-50 dark:hover:bg-slate-700"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedAnnouncement(announcement);
                                  setIsEditDialogOpen(true);
                                  fetchAnnouncementQuestions(announcement.id);
                                }}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                            {announcement.question_count > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full h-8 text-xs bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedAnnouncement(announcement);
                                  setIsEditDialogOpen(true);
                                  fetchAnnouncementQuestions(announcement.id);
                                }}
                              >
                                <MessageSquare className="h-3 w-3 mr-1.5" />
                                Manage Comments
                                {announcement.pending_count > 0 && (
                                  <Badge className="ml-2 bg-red-500 text-white border-0 text-xs px-1.5 py-0.5 min-w-[20px] animate-pulse shadow-md">
                                    {announcement.pending_count}
                                  </Badge>
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          {announcement.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                          Announcement Details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Announcement Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Announcement Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Type:</span>
                              <Badge className={`${getTypeColor(announcement.type)} text-xs ml-2`}>
                                {announcement.type}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Priority:</span>
                              <Badge className={`${getPriorityColor(announcement.priority)} text-xs ml-2`}>
                                {announcement.priority?.charAt(0).toUpperCase() + announcement.priority?.slice(1) || 'Medium'}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                              <Badge className={`${getStatusColor(announcement.status)} text-xs ml-2`}>
                                {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Author:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.author}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Department:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.department}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Date:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.date}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Views:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.views}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300">{announcement.description}</p>
                        </div>

                        {/* Content */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Full Content</h4>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{announcement.content}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        {announcement.tags && announcement.tags.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {announcement.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button 
                            className="bg-[#003153] hover:bg-[#003153]/90 text-white border-0"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                              setIsEditDialogOpen(true);
                              fetchAnnouncementQuestions(announcement.id);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit & Manage Questions
                          </Button>
                          <Button variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Edit Dialog */}
                  <Dialog 
                    open={selectedAnnouncement?.id === announcement.id && isEditDialogOpen}
                    onOpenChange={(open) => {
                      if (open) {
                        setSelectedAnnouncement(announcement);
                        setIsEditDialogOpen(true);
                        fetchAnnouncementQuestions(announcement.id);
                      } else {
                        setIsEditDialogOpen(false);
                        setSelectedAnnouncement(null);
                        setAnnouncementQuestions([]);
                        setAnswerText("");
                        setSelectedQuestionId(null);
                      }
                    }}
                  >
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            {announcement.title}
                          </DialogTitle>
                          <DialogDescription className="text-gray-600 dark:text-gray-300">
                            Edit Announcement & Manage Questions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Announcement Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Announcement Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Type:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.type}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                              <Badge className={`${getStatusColor(announcement.status)} text-xs ml-2`}>
                                {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Author:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.author}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Department:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.department}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Date:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.date}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Views:</span>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.views}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300">{announcement.description}</p>
                        </div>

                        {/* Content */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Full Content</h4>
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{announcement.content}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {announcement.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Last Updated</h4>
                            <p className="text-gray-600 dark:text-gray-300">{announcement.lastUpdated}</p>
                          </div>
                          {announcement.publishDate && (
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Published</h4>
                              <p className="text-gray-600 dark:text-gray-300">{announcement.publishDate}</p>
                            </div>
                          )}
                        </div>

                        {/* Questions Section */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-base flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-[#003153]" />
                            Citizen Questions ({announcementQuestions.length})
                          </h4>
                          
                          {isLoadingQuestions ? (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                              Loading questions...
                            </div>
                          ) : announcementQuestions.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                              No questions yet.
                            </div>
                          ) : (
                            <div className="space-y-6 mb-4">
                              {announcementQuestions.map((q: any) => (
                                <div key={q.id} className="space-y-4">
                                  {/* Question Thread */}
                                  <div className="relative">
                                    {/* Question */}
                                    <div className="group relative bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 border-l-4 border-blue-500 rounded-r-xl p-5 shadow-md hover:shadow-lg transition-all duration-200">
                                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 dark:bg-blue-400/5 rounded-bl-full"></div>
                                      <div className="relative flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50">
                                          <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                              {q.citizen_name}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                              asked
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {q.created_at}
                                            </span>
                                            {q.is_answered && (
                                              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 text-xs px-2.5 py-1 ml-auto shadow-sm">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Answered
                                              </Badge>
                                            )}
                                            {!q.is_answered && (
                                              <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0 text-xs px-2.5 py-1 ml-auto shadow-sm">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Pending
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="bg-white/60 dark:bg-gray-900/40 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30">
                                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                                              {q.question}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Answer (Threaded Reply) */}
                                    {q.is_answered && q.answer && (
                                      <div className="ml-6 mt-4 relative">
                                        {/* Thread connector line with curve */}
                                        <div className="absolute left-0 top-0 w-6 h-6 border-l-2 border-b-2 border-green-300 dark:border-green-700 rounded-bl-lg -ml-6"></div>
                                        <div className="absolute left-0 top-6 bottom-0 w-0.5 bg-gradient-to-b from-green-300 to-green-200 dark:from-green-700 dark:to-green-600 -ml-6"></div>
                                        
                                        <div className="group relative bg-gradient-to-r from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 border-l-4 border-green-500 rounded-r-xl p-5 shadow-md hover:shadow-lg transition-all duration-200">
                                          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 dark:bg-green-400/5 rounded-bl-full"></div>
                                          <div className="relative flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-green-100 dark:ring-green-900/50">
                                              <Building2 className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                  {q.answered_by || 'Government Official'}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                  replied
                                                </span>
                                                {q.answered_at && (
                                                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {q.answered_at}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="bg-white/80 dark:bg-gray-900/50 rounded-lg p-4 border border-green-100 dark:border-green-900/30 shadow-sm">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                                  {q.answer}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Answer Form (for unanswered questions) */}
                                    {!q.is_answered && (
                                      <div className="ml-6 mt-4 relative">
                                        {/* Thread connector line with curve */}
                                        <div className="absolute left-0 top-0 w-6 h-6 border-l-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-bl-lg -ml-6"></div>
                                        <div className="absolute left-0 top-6 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500 -ml-6"></div>
                                        
                                        <div className="group relative bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/80 dark:to-gray-800/50 border-l-4 border-gray-400 dark:border-gray-600 rounded-r-xl p-5 shadow-md">
                                          <div className="relative flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-gray-100 dark:ring-gray-800">
                                              <MessageSquare className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 mb-3">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                  Your Response
                                                </span>
                                              </div>
                                              <Textarea
                                                placeholder="Type your answer here..."
                                                value={selectedQuestionId === q.id ? answerText : ''}
                                                onChange={(e) => {
                                                  setAnswerText(e.target.value);
                                                  setSelectedQuestionId(q.id);
                                                }}
                                                className="mb-3 min-h-[120px] bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 focus:border-[#003153] dark:focus:border-blue-500 rounded-lg shadow-sm transition-colors"
                                              />
                                              <Button
                                                size="sm"
                                                onClick={() => handleAnswerQuestion(q.id)}
                                                disabled={!answerText.trim() || isSubmittingAnswer || selectedQuestionId !== q.id}
                                                className="bg-gradient-to-r from-[#003153] to-blue-700 hover:from-[#003153]/90 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                              >
                                                {isSubmittingAnswer && selectedQuestionId === q.id ? (
                                                  <>
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    Submitting...
                                                  </>
                                                ) : (
                                                  <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Submit Answer
                                                  </>
                                                )}
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button 
                            className="bg-[#003153] hover:bg-[#003153]/90 text-white border-0"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                              setIsEditDialogOpen(true);
                              fetchAnnouncementQuestions(announcement.id);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit & Manage Questions
                          </Button>
                          <Button variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
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
          {filteredAnnouncements.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Announcements Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'No announcements match your current filters.' 
                  : 'You don\'t have any announcements yet.'}
              </p>
              <Button 
                className="bg-[#003153] hover:bg-[#003153]/90 text-white border-0"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Announcement
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Announcement Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement for your town. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description (optional)"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter full announcement content"
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Department <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publish (visible to citizens)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#003153] hover:bg-[#003153]/90 text-white border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Announcement'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
