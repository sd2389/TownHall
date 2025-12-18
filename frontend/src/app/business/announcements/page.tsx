"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Megaphone, 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle,
  Search,
  Eye,
  Building2,
  User,
  RefreshCw,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  MessageSquare,
  MapPin,
  ArrowRight,
  Star
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { announcementsApi } from "@/lib/api";
import React, { useState, useEffect } from "react";

export default function BusinessAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'published'>('published');
  const [filterType, setFilterType] = useState<'all' | 'event' | 'alert' | 'meeting' | 'policy'>('all');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState<number | null>(null);
  const [announcementQuestions, setAnnouncementQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Fetch announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const statusFilter = filterStatus === 'all' ? undefined : 'published';
        const typeFilter = filterType === 'all' ? undefined : filterType;
        const response = await announcementsApi.list({ 
          status: statusFilter,
          type: typeFilter 
        });
        
        // Handle both array response and object with announcements
        const data = Array.isArray(response) ? response : (response.announcements || []);
        
        // Map API response to match frontend format
        const mappedData = data.map((announcement: any) => ({
          id: announcement.id,
          title: announcement.title,
          description: announcement.description || announcement.content?.substring(0, 150) || '',
          content: announcement.content || announcement.description || '',
          date: announcement.date || announcement.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          priority: announcement.priority || 'medium',
          type: announcement.type ? (announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)) : 'Alert',
          author: announcement.author || 'Government Official',
          department: announcement.department || 'General',
          views: announcement.views || 0,
          tags: announcement.tags || [],
          lastUpdated: announcement.lastUpdated || announcement.date,
          publishDate: announcement.publishDate || announcement.date,
          expiryDate: announcement.expiryDate,
          town_name: announcement.town_name,
          status: announcement.status || 'published',
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

  const handleViewDetails = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setOpenAnnouncementDialog(announcement.id);
    setIsDetailDialogOpen(true);
    fetchAnnouncementQuestions(announcement.id);
  };

  // Fetch questions for an announcement
  const fetchAnnouncementQuestions = async (announcementId: number) => {
    try {
      setIsLoadingQuestions(true);
      const questions = await announcementsApi.questions.list(announcementId);
      setAnnouncementQuestions(questions);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Submit a question for an announcement
  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim() || !selectedAnnouncement) return;
    
    try {
      setIsSubmittingQuestion(true);
      const response = await announcementsApi.questions.create(selectedAnnouncement.id, newQuestion.trim());
      
      // Add the new question to the list
      setAnnouncementQuestions([response.question, ...announcementQuestions]);
      setNewQuestion("");
    } catch (err: any) {
      console.error('Error submitting question:', err);
      alert(err.message || 'Failed to submit question');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      Event: Calendar,
      Alert: AlertTriangle,
      Meeting: Clock,
      Policy: FileText,
    };
    return icons[type] || Info;
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <ProtectedRoute allowedRoles={['business']}>
      <Layout userType="business" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 dark:from-gray-900 dark:via-green-950/20 dark:to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Announcements</h1>
                    <p className="text-green-100 text-xs sm:text-sm md:text-base mt-1">Stay informed about government updates and community news</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 dark:border-slate-600"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                    >
                      <option value="all">All Types</option>
                      <option value="event">Events</option>
                      <option value="alert">Alerts</option>
                      <option value="meeting">Meetings</option>
                      <option value="policy">Policies</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                      <AlertCircle className="h-5 w-5" />
                      <p>{error}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Announcements List */}
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Loading announcements...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <Megaphone className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No announcements found</h3>
                  <p className="text-slate-600 dark:text-slate-400">There are no announcements available at this time</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredAnnouncements.map((announcement, index) => {
                  const TypeIcon = getTypeIcon(announcement.type);
                  return (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                    >
                      <Card className="border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50 cursor-pointer group" onClick={() => handleViewDetails(announcement)}>
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                              announcement.type?.toLowerCase() === 'event' ? 'bg-purple-100 dark:bg-purple-900/30' :
                              announcement.type?.toLowerCase() === 'alert' ? 'bg-red-100 dark:bg-red-900/30' :
                              announcement.type?.toLowerCase() === 'meeting' ? 'bg-blue-100 dark:bg-blue-900/30' :
                              announcement.type?.toLowerCase() === 'policy' ? 'bg-amber-100 dark:bg-amber-900/30' :
                              'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <TypeIcon className={`h-6 w-6 ${
                                announcement.type?.toLowerCase() === 'event' ? 'text-purple-600 dark:text-purple-400' :
                                announcement.type?.toLowerCase() === 'alert' ? 'text-red-600 dark:text-red-400' :
                                announcement.type?.toLowerCase() === 'meeting' ? 'text-blue-600 dark:text-blue-400' :
                                announcement.type?.toLowerCase() === 'policy' ? 'text-amber-600 dark:text-amber-400' :
                                'text-gray-600 dark:text-gray-400'
                              }`} />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h4 className="font-semibold text-base text-gray-900 dark:text-white leading-snug group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                  {announcement.title}
                                </h4>
                                <Badge className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 ${
                                  announcement.type?.toLowerCase() === 'event' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                  announcement.type?.toLowerCase() === 'alert' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  announcement.type?.toLowerCase() === 'meeting' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                  announcement.type?.toLowerCase() === 'policy' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                  {announcement.type}
                                </Badge>
                              </div>
                              
                              {announcement.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                                  {announcement.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {announcement.date}
                                </span>
                                {announcement.priority && (
                                  <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${
                                    announcement.priority?.toLowerCase() === 'urgent' ? 'bg-red-600 text-white dark:bg-red-700 dark:text-white' :
                                    announcement.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                    announcement.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    announcement.priority?.toLowerCase() === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                  }`}>
                                    <AlertCircle className="h-3 w-3" />
                                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                                  </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                  <Eye className="h-3.5 w-3.5" />
                                  {announcement.views || 0} Views
                                </span>
                              </div>
                            </div>
                            
                            {/* Read More Button */}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="flex-shrink-0 text-xs hover:bg-green-600/10 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              Read More
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Announcement Detail Dialog */}
            <Dialog 
              open={isDetailDialogOpen} 
              onOpenChange={(open) => {
                setIsDetailDialogOpen(open);
                if (!open) {
                  setOpenAnnouncementDialog(null);
                  setSelectedAnnouncement(null);
                  setAnnouncementQuestions([]);
                  setNewQuestion("");
                }
              }}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {selectedAnnouncement?.title}
                      </DialogTitle>
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <Badge className={`text-xs font-medium px-2.5 py-1 ${
                          selectedAnnouncement?.type?.toLowerCase() === 'event' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          selectedAnnouncement?.type?.toLowerCase() === 'alert' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          selectedAnnouncement?.type?.toLowerCase() === 'meeting' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          selectedAnnouncement?.type?.toLowerCase() === 'policy' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {selectedAnnouncement?.type}
                        </Badge>
                        {selectedAnnouncement?.priority && (
                          <Badge className={`text-xs font-medium px-2.5 py-1 ${
                            selectedAnnouncement.priority?.toLowerCase() === 'urgent' ? 'bg-red-600 text-white dark:bg-red-700 dark:text-white' :
                            selectedAnnouncement.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            selectedAnnouncement.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            selectedAnnouncement.priority?.toLowerCase() === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {selectedAnnouncement.priority.charAt(0).toUpperCase() + selectedAnnouncement.priority.slice(1)} Priority
                          </Badge>
                        )}
                        {selectedAnnouncement?.status && (
                          <Badge className={`text-xs font-medium px-2.5 py-1 ${
                            selectedAnnouncement.status === 'published' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                            'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                            {selectedAnnouncement.status.charAt(0).toUpperCase() + selectedAnnouncement.status.slice(1)}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Metadata Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Published:</span>
                          <span>{selectedAnnouncement?.publishDate || selectedAnnouncement?.date}</span>
                        </div>
                        {selectedAnnouncement?.expiryDate && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 text-amber-600" />
                            <span className="font-medium">Expires:</span>
                            <span>{selectedAnnouncement.expiryDate}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Eye className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Views:</span>
                          <span>{selectedAnnouncement?.views || 0}</span>
                        </div>
                        {selectedAnnouncement?.lastUpdated && selectedAnnouncement.lastUpdated !== selectedAnnouncement.date && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Updated:</span>
                            <span>{selectedAnnouncement.lastUpdated}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogHeader>
                {selectedAnnouncement && (
                  <div className="space-y-6 pt-4">
                    {/* Announcement Content */}
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base">Full Announcement</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {selectedAnnouncement.content || selectedAnnouncement.description || 'No content available.'}
                        </p>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Department & Author */}
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          Department Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Building2 className="h-3.5 w-3.5 text-gray-500" />
                            <span className="font-medium">Department:</span>
                            <span>{selectedAnnouncement.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <User className="h-3.5 w-3.5 text-gray-500" />
                            <span className="font-medium">Posted by:</span>
                            <span>{selectedAnnouncement.author}</span>
                          </div>
                          {selectedAnnouncement.town_name && (
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <MapPin className="h-3.5 w-3.5 text-gray-500" />
                              <span className="font-medium">Town:</span>
                              <span>{selectedAnnouncement.town_name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {selectedAnnouncement.tags && selectedAnnouncement.tags.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-600" />
                            Tags
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAnnouncement.tags.map((tag: string, index: number) => (
                              <Badge 
                                key={index}
                                className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2.5 py-1"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Questions Section */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-base flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        Questions & Answers ({announcementQuestions.length})
                      </h4>
                      
                      {isLoadingQuestions ? (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                          Loading questions...
                        </div>
                      ) : announcementQuestions.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                          No questions yet. Be the first to ask!
                        </div>
                      ) : (
                        <div className="space-y-6 mb-4">
                          {announcementQuestions.map((q: any) => (
                            <div key={q.id} className="space-y-4">
                              {/* Question Thread */}
                              <div className="relative">
                                {/* Question */}
                                <div className="group relative bg-gradient-to-r from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10 border-l-4 border-green-500 rounded-r-xl p-5 shadow-md hover:shadow-lg transition-all duration-200">
                                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 dark:bg-green-400/5 rounded-bl-full"></div>
                                  <div className="relative flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-green-100 dark:ring-green-900/50">
                                      <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                          {q.business_name || q.citizen_name || 'Business Owner'}
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
                                      </div>
                                      <div className="bg-white/60 dark:bg-gray-900/40 rounded-lg p-3 border border-green-100 dark:border-green-900/30">
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
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Ask Question Form */}
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                          Ask a Question
                        </h5>
                        <Textarea
                          placeholder="Type your question here..."
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="mb-3 min-h-[80px] bg-white dark:bg-gray-800"
                        />
                        <Button
                          onClick={handleSubmitQuestion}
                          disabled={!newQuestion.trim() || isSubmittingQuestion}
                          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                        >
                          {isSubmittingQuestion ? 'Submitting...' : 'Submit Question'}
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="outline" className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Bell className="h-4 w-4 mr-2" />
                        Get Notifications
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

