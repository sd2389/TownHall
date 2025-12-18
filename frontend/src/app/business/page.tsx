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
  ExternalLink
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { businessApi, businessEventsApi } from "@/lib/api";
import React, { useState, useEffect } from "react";

export default function BusinessPortal() {
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [applications, setApplications] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Comment functionality
  const handleSubmitComment = async (applicationId: number) => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCommentObj = {
        id: Date.now(),
        author: "Priya Singh",
        text: newComment.trim(),
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };

      setApplications(prev => prev.map(application => {
        if (application.id === applicationId) {
          return {
            ...application,
            comments: [...application.comments, newCommentObj]
          };
        }
        return application;
      }));

      setNewComment("");
      setIsSubmittingComment(false);
    }, 1000);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [applicationsData, eventsData] = await Promise.all([
          businessApi.licenses.list({}),
          businessEventsApi.list({})
        ]);
        
        // Map applications
        const mappedApplications = applicationsData.map((license: any) => ({
          id: license.id,
          title: license.license_type,
          description: license.description || '',
          status: license.status,
          priority: license.status === 'pending' ? 'medium' : license.status === 'approved' ? 'high' : 'low',
          created: license.created_at,
          category: "License",
          type: license.license_type,
          assignedTo: "Business Licensing Dept",
          estimatedResolution: license.status === 'approved' ? 'Completed' : 
                               license.status === 'rejected' ? 'Rejected' : 'Pending Review',
          fee: "N/A",
          documents: []
        }));
        
        // Map events
        const mappedEvents = eventsData.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.event_date,
          time: event.event_time,
          location: event.location,
          status: event.status,
          attendees: event.current_attendees || 0,
          type: "Business Event"
        }));
        
        setApplications(mappedApplications);
        setEvents(mappedEvents);
        setAnnouncements([]); // Announcements not in API yet
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

  // Filter functionality
  const filteredApplications = applications.filter(application => {
    if (filterStatus === 'all') return true;
    return application.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
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
    <ProtectedRoute allowedRoles={['business']}>
      <Layout 
        userType="business" 
        userName={`${user?.firstName || ''} ${user?.lastName || ''}`} 
        userEmail={user?.email || ''} 
        showPortalNav={true}
      >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-[#003153] to-[#003153]/90 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Business Dashboard</h1>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-1">Manage your business applications, events, and licenses</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#003153]/5 via-transparent to-[#003153]/5 rounded-2xl"></div>
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8">
            {[
              { title: "Active Applications", value: "5", icon: FileText, color: "bg-[#003153]", change: "+2 this month" },
              { title: "Approved", value: "12", icon: CheckCircle, color: "bg-[#003153]", change: "80% success rate" },
              { title: "Pending Review", value: "3", icon: Clock, color: "bg-[#003153]", change: "Avg 5 days" },
              { title: "Business Score", value: "4.9", icon: Star, color: "bg-[#003153]", change: "Excellent" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#003153]/30 hover:scale-105">
                    <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-[#003153] hidden sm:block bg-[#003153]/10 px-2.5 py-1 rounded-full border border-[#003153]/20">{stat.change}</span>
                      </div>
                      <div className="space-y-2 flex-1 flex flex-col">
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide leading-tight">{stat.title}</p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-none">{stat.value}</p>
                        <div className="mt-auto">
                          <span className="text-xs font-semibold text-[#003153] sm:hidden block bg-[#003153]/10 px-2.5 py-1 rounded-full border border-[#003153]/20 inline-block">{stat.change}</span>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Applications and Events (right column on large screens) */}
            <div className="lg:col-span-1 lg:col-start-3 lg:row-start-1 space-y-8 sm:space-y-10">
              {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-3">
                  <div>
                      <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">Recent Applications</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">Track your business applications</CardDescription>
                  </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button size="sm" variant="outline" className="text-gray-600 dark:text-gray-300 flex-1 sm:flex-none">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button size="sm" className="bg-[#003153] hover:bg-[#003153]/90 flex-1 sm:flex-none">
                    <Plus className="h-4 w-4 mr-2" />
                        New
                  </Button>
                    </div>
                </CardHeader>
                  <CardContent className="space-y-5">
                    {filteredApplications.slice(0, 3).map((application) => (
                      <Dialog key={application.id}>
                        <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                            className="p-5 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 hover:border-[#003153]/30 cursor-pointer"
                            onClick={() => setSelectedApplication(application)}
                          >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 truncate">{application.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">{application.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                              <span className="flex items-center">
                                <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{application.category}</span>
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                {application.created}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-3">
                            <Badge className={`${getStatusColor(application.status)} text-xs text-center px-2 py-1 flex items-center justify-center`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                            <Badge className={`${getPriorityColor(application.priority)} text-xs text-center px-2 py-1 flex items-center justify-center`}>
                              {application.priority.charAt(0).toUpperCase() + application.priority.slice(1)}
                          </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 gap-3">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Fee: <span className="font-medium">{application.fee}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#003153]/10 text-gray-600 dark:text-gray-400 hover:text-[#003153]">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-[#003153]/10 text-gray-600 dark:text-gray-400 hover:text-[#003153]">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                              {application.title}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300">
                              Application Details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Description */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                              <p className="text-gray-600 dark:text-gray-300">{application.description}</p>
                            </div>

                            {/* Status and Priority */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h4>
                                <Badge className={`${getStatusColor(application.status)} text-xs text-center`}>
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Priority</h4>
                                <Badge className={`${getPriorityColor(application.priority)} text-xs text-center`}>
                                  {application.priority.charAt(0).toUpperCase() + application.priority.slice(1)}
                                </Badge>
                              </div>
                            </div>

                            {/* Fee and Department */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Application Fee</h4>
                                <p className="text-gray-600 dark:text-gray-300">{application.fee}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Assigned Department</h4>
                                <p className="text-gray-600 dark:text-gray-300">{application.assignedTo}</p>
                              </div>
                            </div>

                            {/* Required Documents */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Required Documents</h4>
                              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                                {application.documents.map((doc, index) => (
                                  <li key={index}>{doc}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Estimated Resolution */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Resolution Status</h4>
                              <p className="text-gray-600 dark:text-gray-300">{application.estimatedResolution}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <Button className="flex-1 bg-[#003153] hover:bg-[#003153]/90">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Application
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Quick Actions</CardTitle>
                </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full justify-start bg-[#003153] hover:bg-[#003153]/90 text-sm" 
                      variant="default"
                      onClick={() => alert('Redirecting to New Application form...')}
                    >
                      <FileText className="h-4 w-4 mr-2 sm:mr-3" />
                      New Application
                    </Button>
                    <Button 
                      className="w-full justify-start text-sm hover:bg-[#003153]/10 hover:text-[#003153]" 
                      variant="outline"
                      onClick={() => alert('Redirecting to License Renewal...')}
                    >
                      <Shield className="h-4 w-4 mr-2 sm:mr-3" />
                      Renew License
                  </Button>
                    <Button 
                      className="w-full justify-start text-sm hover:bg-[#003153]/10 hover:text-[#003153]" 
                      variant="outline"
                      onClick={() => alert('Opening Event Creation...')}
                    >
                      <Calendar className="h-4 w-4 mr-2 sm:mr-3" />
                    Create Event
                  </Button>
                    <Button 
                      className="w-full justify-start text-sm hover:bg-[#003153]/10 hover:text-[#003153]" 
                      variant="outline"
                      onClick={() => alert('Downloading Business Reports...')}
                    >
                      <Download className="h-4 w-4 mr-2 sm:mr-3" />
                      Download Reports
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            </div>

            {/* Business Events and Announcements (left and wider on large screens) */}
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1">
              {/* Business Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-3">
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">Business Events</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">Manage your business events and promotions</CardDescription>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button size="sm" className="bg-[#003153] hover:bg-[#003153]/90 flex-1 sm:flex-none">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </div>
                </CardHeader>
                  <CardContent className="space-y-5">
                    {events.slice(0, 3).map((event) => (
                      <Dialog key={event.id}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 hover:border-[#003153]/30 cursor-pointer"
                          >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-2">{event.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">{event.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                {event.date}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                                {event.time}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Badge className="bg-[#003153]/10 text-[#003153] text-sm text-center px-3 py-1.5 flex items-center justify-center font-medium">
                              {event.status === 'approved' ? 'Approved' : 'Pending'}
                          </Badge>
                            <div className="text-xs text-gray-500 text-center">
                              {event.attendees} attendees
                            </div>
                          </div>
                        </div>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                              {event.title}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300">
                              Event Details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Event Details */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Event Description</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Date:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Time:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{event.time}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Location:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Attendees:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{event.attendees}</p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Event
                              </Button>
                              <Button variant="outline">
                                <Users className="h-4 w-4 mr-2" />
                                Manage Attendees
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Business Announcements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-6 lg:mt-8"
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="pb-4 sm:pb-5">
                    <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Business Announcements</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-sm">Stay updated with business news and regulations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {announcements.map((announcement) => (
                      <Dialog key={announcement.id}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-300 bg-gray-50 dark:bg-gray-700/50 cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white leading-tight">{announcement.title}</h4>
                              <Badge className={`${getPriorityColor(announcement.priority)} text-xs ml-3 px-2 py-1 flex items-center justify-center`}>
                                {announcement.type}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">{announcement.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 pt-2">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                {announcement.date}
                              </span>
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs self-start sm:self-auto hover:bg-[#003153]/10 hover:text-[#003153]">
                                Read More
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                              {announcement.title}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300">
                              Business Announcement
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Announcement Details */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{announcement.description}</p>
                            </div>

                            {/* Additional Details */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Important Information</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                This announcement was posted by the business administration. 
                                For more information or questions, please contact the relevant department.
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Ask Question
                              </Button>
                              <Button variant="outline">
                                <Bell className="h-4 w-4 mr-2" />
                                Get Notifications
                              </Button>
                        </div>
                      </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                </CardContent>
              </Card>
            </motion.div>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  );
}