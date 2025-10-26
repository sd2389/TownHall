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
  BarChart3,
  TrendingUp,
  Users,
  Eye as EyeIcon
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import React, { useState } from "react";

export default function GovernmentAnnouncements() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [filterType, setFilterType] = useState<'all' | 'event' | 'alert' | 'meeting' | 'policy'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'status'>('date');

  const announcements = [
    {
      id: 1,
      title: "New Park Opening",
      description: "Join us for the grand opening of Central Park with live music and food trucks. This new community space features walking trails, playground equipment, and picnic areas for families to enjoy.",
      content: "We are excited to announce the grand opening of Central Park, our newest community space. The park features:\n\n• Walking trails for all fitness levels\n• Modern playground equipment\n• Picnic areas with tables and grills\n• Beautiful landscaping and gardens\n• Free parking available\n\nJoin us on Saturday, February 1st from 10 AM to 4 PM for the opening celebration with live music, food trucks, and family activities.",
      date: "2024-02-01",
      priority: "high",
      type: "Event",
      status: "published",
      views: 1250,
      author: "David Kim",
      department: "Parks & Recreation",
      tags: ["Community", "Recreation", "Family"],
      lastUpdated: "2024-01-25",
      publishDate: "2024-01-25",
      expiryDate: "2024-02-15"
    },
    {
      id: 2,
      title: "Road Closure Notice",
      description: "Main Street will be closed for maintenance from 6 AM to 6 PM on January 25th",
      content: "Main Street will be closed for essential maintenance work on January 25th from 6:00 AM to 6:00 PM. This closure is necessary for:\n\n• Road resurfacing\n• Traffic signal upgrades\n• Sidewalk repairs\n\nAlternative routes:\n• Use Oak Avenue as a detour\n• Access downtown via Elm Street\n• Public transportation will be rerouted\n\nWe apologize for any inconvenience and appreciate your patience.",
      date: "2024-01-25",
      priority: "medium",
      type: "Alert",
      status: "published",
      views: 890,
      author: "Sarah Johnson",
      department: "Public Works",
      tags: ["Traffic", "Maintenance", "Road Closure"],
      lastUpdated: "2024-01-20",
      publishDate: "2024-01-20",
      expiryDate: "2024-01-26"
    },
    {
      id: 3,
      title: "Community Meeting",
      description: "Monthly town hall meeting to discuss upcoming projects and community concerns",
      content: "Join us for our monthly town hall meeting where we will discuss:\n\n• Upcoming infrastructure projects\n• Budget planning for next fiscal year\n• Community safety initiatives\n• Q&A session with city officials\n\nThis is your opportunity to voice concerns, ask questions, and stay informed about city developments. Light refreshments will be provided.",
      date: "2024-01-30",
      priority: "low",
      type: "Meeting",
      status: "draft",
      views: 0,
      author: "Michael Brown",
      department: "City Administration",
      tags: ["Community", "Meeting", "Engagement"],
      lastUpdated: "2024-01-22",
      publishDate: null,
      expiryDate: "2024-02-05"
    },
    {
      id: 4,
      title: "New Recycling Program",
      description: "Introduction of expanded recycling services starting next month",
      content: "We are excited to announce the expansion of our recycling program to include:\n\n• Glass recycling pickup\n• Electronic waste collection\n• Composting services\n• Textile recycling\n\nNew collection schedules will be mailed to all residents. The program will begin on February 1st, 2024. For more information, contact the Environmental Services Department.",
      date: "2024-02-01",
      priority: "medium",
      type: "Policy",
      status: "published",
      views: 567,
      author: "Jennifer Davis",
      department: "Environmental Services",
      tags: ["Environment", "Recycling", "Sustainability"],
      lastUpdated: "2024-01-18",
      publishDate: "2024-01-18",
      expiryDate: "2024-03-01"
    },
    {
      id: 5,
      title: "Winter Weather Advisory",
      description: "Heavy snow expected this weekend - prepare for winter conditions",
      content: "The National Weather Service has issued a winter weather advisory for our area. Heavy snow is expected this weekend with accumulations of 6-8 inches.\n\nPreparations:\n• Clear sidewalks and driveways\n• Check emergency supplies\n• Avoid unnecessary travel\n• Check on elderly neighbors\n\nCity services:\n• Snow plows will be deployed\n• Emergency services remain available\n• Call 911 for emergencies only",
      date: "2024-01-28",
      priority: "high",
      type: "Alert",
      status: "archived",
      views: 2100,
      author: "Emergency Management",
      department: "Emergency Services",
      tags: ["Weather", "Safety", "Emergency"],
      lastUpdated: "2024-01-28",
      publishDate: "2024-01-28",
      expiryDate: "2024-01-30"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Create and manage public announcements and notices</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-[#003153] hover:bg-[#003153]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
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
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#003153]/30 cursor-pointer">
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
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Type:</span>
                              <Badge className={`${getPriorityColor(announcement.priority)} text-xs`}>
                                {announcement.type}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Author:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{announcement.author}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Date:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{announcement.date}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Views:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{announcement.views}</span>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
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

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {announcement.status === 'draft' && (
                            <Button className="bg-[#003153] hover:bg-[#003153]/90">
                              <Globe className="h-4 w-4 mr-2" />
                              Publish
                            </Button>
                          )}
                          {announcement.status === 'published' && (
                            <Button variant="outline">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </Button>
                          )}
                          <Button className="bg-[#003153] hover:bg-[#003153]/90">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
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
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Announcement
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
