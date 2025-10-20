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
  FileText, 
  MessageSquare, 
  Bell, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  MapPin,
  Calendar,
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
  MessageCircle,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown,
  User,
  Building2
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import React, { useState, useEffect } from "react";

export default function CitizenPortal() {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [userVotes, setUserVotes] = useState<{[key: number]: 'support' | 'oppose' | null}>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [proposals, setProposals] = useState<any[]>([]);

  // Voting functionality
  const handleVote = (proposalId: number, voteType: 'support' | 'oppose') => {
    const currentVote = userVotes[proposalId];
    const newVote = currentVote === voteType ? null : voteType;
    
    setUserVotes(prev => ({
      ...prev,
      [proposalId]: newVote
    }));

    // Update proposal counts
    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId) {
        let newSupportCount = proposal.supportCount;
        let newOpposeCount = proposal.opposeCount;

        // Remove previous vote
        if (currentVote === 'support') {
          newSupportCount = Math.max(0, newSupportCount - 1);
        } else if (currentVote === 'oppose') {
          newOpposeCount = Math.max(0, newOpposeCount - 1);
        }

        // Add new vote
        if (newVote === 'support') {
          newSupportCount += 1;
        } else if (newVote === 'oppose') {
          newOpposeCount += 1;
        }

        return {
          ...proposal,
          supportCount: newSupportCount,
          opposeCount: newOpposeCount
        };
      }
      return proposal;
    }));
  };

  // Comment functionality
  const handleSubmitComment = async (proposalId: number) => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCommentObj = {
        id: Date.now(),
        author: "Maria Lopez",
        text: newComment.trim(),
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };

      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            comments: [...proposal.comments, newCommentObj]
          };
        }
        return proposal;
      }));

      setNewComment("");
      setIsSubmittingComment(false);
    }, 1000);
  };

  // Like comment functionality
  const handleLikeComment = (proposalId: number, commentId: number) => {
    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId) {
        return {
          ...proposal,
          comments: proposal.comments.map((comment: any) => 
            comment.id === commentId 
              ? { ...comment, likes: comment.likes + 1 }
              : comment
          )
        };
      }
      return proposal;
    }));
  };

  // Filter functionality
  const filteredProposals = proposals.filter(proposal => {
    if (filterStatus === 'all') return true;
    return proposal.status === filterStatus;
  });

  const complaints = [
    {
      id: 1,
      title: "Pothole on Main Street",
      description: "Large pothole causing damage to vehicles",
      status: "in_progress",
      priority: "high",
      created: "2024-01-15",
      category: "Infrastructure",
      location: "Main Street & 5th Ave",
      assignedTo: "Public Works Dept",
      estimatedResolution: "3 days"
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
      estimatedResolution: "Completed"
    },
    {
      id: 3,
      title: "Noise Complaint",
      description: "Construction work during night hours",
      status: "pending",
      priority: "low",
      created: "2024-01-20",
      category: "Noise",
      location: "Downtown Area",
      assignedTo: "Code Enforcement",
      estimatedResolution: "1 week"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "New Park Opening",
      description: "Join us for the grand opening of Central Park with live music and food trucks",
      date: "2024-02-01",
      priority: "high",
      type: "Event"
    },
    {
      id: 2,
      title: "Road Closure Notice",
      description: "Main Street will be closed for maintenance from 6 AM to 6 PM",
      date: "2024-01-25",
      priority: "medium",
      type: "Alert"
    },
    {
      id: 3,
      title: "Community Meeting",
      description: "Monthly town hall meeting to discuss upcoming projects",
      date: "2024-01-30",
      priority: "low",
      type: "Meeting"
    }
  ];

  const billProposals = [
    {
      id: 1,
      title: "Green Energy Initiative",
      summary: "Proposal to install solar panels on all municipal buildings to reduce carbon footprint",
      fullText: "This comprehensive green energy initiative aims to install solar panels on all municipal buildings including city hall, libraries, and community centers. The project will reduce our city's carbon footprint by 40% and save approximately $2M annually in energy costs. The initiative includes a 3-year implementation plan with community input sessions and regular progress updates.",
      proposer: "David Kim - City Planning Officer",
      department: "Urban Development",
      date: "2024-01-20",
      status: "open",
      supportCount: 156,
      opposeCount: 23,
      comments: [
        {
          id: 1,
          author: "Maria Lopez",
          text: "This is a great initiative! I fully support renewable energy projects.",
          date: "2024-01-21",
          likes: 12
        },
        {
          id: 2,
          author: "John Smith",
          text: "What about the initial cost? How will this affect our taxes?",
          date: "2024-01-22",
          likes: 8
        }
      ]
    },
    {
      id: 2,
      title: "Pedestrian Safety Improvements",
      summary: "Installation of crosswalks and traffic calming measures on Main Street",
      fullText: "This proposal focuses on improving pedestrian safety along Main Street by installing new crosswalks, pedestrian signals, and traffic calming measures. The project includes speed bumps, better lighting, and designated bike lanes. Estimated cost is $500K with completion expected within 6 months.",
      proposer: "Sarah Johnson - Traffic Safety Director",
      department: "Public Works",
      date: "2024-01-18",
      status: "open",
      supportCount: 89,
      opposeCount: 15,
      comments: [
        {
          id: 3,
          author: "Lisa Chen",
          text: "Finally! Main Street is so dangerous for pedestrians. This is much needed.",
          date: "2024-01-19",
          likes: 15
        }
      ]
    },
    {
      id: 3,
      title: "Community Center Renovation",
      summary: "Major renovation of the downtown community center including new facilities and accessibility improvements",
      fullText: "This proposal outlines a comprehensive renovation of the downtown community center, including new meeting rooms, updated kitchen facilities, improved accessibility features, and modern technology infrastructure. The project will cost $1.2M and take 8 months to complete.",
      proposer: "Michael Brown - Community Services Director",
      department: "Community Services",
      date: "2024-01-15",
      status: "closed",
      supportCount: 203,
      opposeCount: 45,
      comments: [
        {
          id: 4,
          author: "Robert Wilson",
          text: "The community center needs this renovation badly. I support this proposal.",
          date: "2024-01-16",
          likes: 22
        }
      ]
    }
  ];

  // Initialize proposals with billProposals data
  useEffect(() => {
    setProposals(billProposals);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-[#003153]/10 text-[#003153]";
      case "in_progress":
        return "bg-[#003153]/10 text-[#003153]";
      case "pending":
        return "bg-[#003153]/10 text-[#003153]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#003153]/10 text-[#003153]";
      case "medium":
        return "bg-[#003153]/10 text-[#003153]";
      case "low":
        return "bg-[#003153]/10 text-[#003153]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={false}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

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
              { title: "Total Complaints", value: "12", icon: FileText, color: "bg-[#003153]", change: "+2 this week" },
              { title: "Resolved", value: "8", icon: CheckCircle, color: "bg-[#003153]", change: "67% success rate" },
              { title: "In Progress", value: "3", icon: Clock, color: "bg-[#003153]", change: "Avg 3 days" },
              { title: "Community Score", value: "4.8", icon: Star, color: "bg-[#003153]", change: "Excellent" }
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
            {/* Complaints and Announcements (right column on large screens) */}
            <div className="lg:col-span-1 lg:col-start-3 lg:row-start-1 space-y-8 sm:space-y-10">
              {/* Recent Complaints */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-3">
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">Recent Complaints</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">Track your submitted issues</CardDescription>
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
                    {complaints.map((complaint) => (
                      <Dialog key={complaint.id}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-5 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 hover:border-[#003153]/30 cursor-pointer"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2 truncate">{complaint.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">{complaint.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{complaint.location}</span>
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                {complaint.created}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-3">
                            <Badge className={`${getStatusColor(complaint.status)} text-xs text-center px-2 py-1 flex items-center justify-center hover:${getStatusColor(complaint.status).split(' ')[0]} hover:${getStatusColor(complaint.status).split(' ')[1]}`}>
                              {complaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            <Badge className={`${getPriorityColor(complaint.priority)} text-xs text-center px-2 py-1 flex items-center justify-center hover:${getPriorityColor(complaint.priority).split(' ')[0]} hover:${getPriorityColor(complaint.priority).split(' ')[1]}`}>
                              {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 gap-3">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Assigned to: <span className="font-medium">{complaint.assignedTo}</span>
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

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <Button className="flex-1 bg-[#003153] hover:bg-[#003153]/90">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Complaint
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
                      onClick={() => alert('Redirecting to File New Complaint form...')}
                    >
                      <FileText className="h-4 w-4 mr-2 sm:mr-3" />
                      File New Complaint
                    </Button>
                    <Button 
                      className="w-full justify-start text-sm hover:bg-[#003153]/10 hover:text-[#003153]" 
                      variant="outline"
                      onClick={() => alert('Redirecting to Feedback form...')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 sm:mr-3" />
                      Provide Feedback
                    </Button>
                    <Button 
                      className="w-full justify-start text-sm hover:bg-[#003153]/10 hover:text-[#003153]" 
                      variant="outline"
                      onClick={() => alert('Opening Notification Settings...')}
                    >
                      <Bell className="h-4 w-4 mr-2 sm:mr-3" />
                      Notification Settings
                    </Button>
                    <Button 
                      className="w-full justify-start text-sm hover:bg-[#003153]/10 hover:text-[#003153]" 
                      variant="outline"
                      onClick={() => alert('Downloading Reports...')}
                    >
                      <Download className="h-4 w-4 mr-2 sm:mr-3" />
                      Download Reports
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Announcements (moved below Bill Proposals on left) */}
              
            {/* Recent Announcements (removed from here, now shown on left) */}
            </div>

            {/* Bill Proposals (left and wider on large screens) */}
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-3">
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">Bill Proposals</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">Review and comment on government proposals</CardDescription>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Select value={filterStatus} onValueChange={(value: 'all' | 'open' | 'closed') => setFilterStatus(value)}>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Proposals</SelectItem>
                          <SelectItem value="open">Open Only</SelectItem>
                          <SelectItem value="closed">Closed Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {filteredProposals.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Proposals Found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {filterStatus === 'all' 
                            ? 'No bill proposals available at the moment.' 
                            : `No ${filterStatus} proposals found.`}
                        </p>
                      </div>
                    ) : (
                      filteredProposals.map((proposal) => (
                      <Dialog key={proposal.id}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 hover:border-[#003153]/30 cursor-pointer"
                          >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-2">{proposal.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">{proposal.summary}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                                {proposal.proposer}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                {proposal.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Badge className="bg-[#003153]/10 text-[#003153] text-sm text-center px-3 py-1.5 flex items-center justify-center font-medium">
                              {proposal.status === 'open' ? 'Open' : 'Closed'}
                            </Badge>
                          </div>
                        </div>

                        {/* Voting Section */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-8 px-3 text-sm font-medium ${userVotes[proposal.id] === 'support' ? 'bg-[#003153] hover:bg-[#003153]/90 text-white border-[#003153]' : 'hover:bg-[#003153]/10 hover:text-[#003153] border-[#003153]/20 text-gray-700'}`}
                                onClick={() => handleVote(proposal.id, 'support')}
                              >
                                <ThumbsUpIcon className="h-3 w-3 mr-1" />
                                Support ({proposal.supportCount})
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-8 px-3 text-sm font-medium ${userVotes[proposal.id] === 'oppose' ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'hover:bg-red-50 hover:text-red-600 border-red-200 text-gray-700'}`}
                                onClick={() => handleVote(proposal.id, 'oppose')}
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Oppose ({proposal.opposeCount})
                              </Button>
                            </div>
                            <Button size="sm" variant="outline" className="h-8 px-3 text-sm font-medium hover:bg-[#003153]/10 hover:text-[#003153] border-[#003153]/20 text-gray-700">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Comments ({proposal.comments.length})
                            </Button>
                          </div>
                        </div>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                              {proposal.title}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300">
                              Bill Proposal Details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Proposal Details */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Proposal Summary</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{proposal.summary}</p>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Full Proposal</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{proposal.fullText}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {proposal.proposer}
                                </span>
                                <span className="flex items-center">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  {proposal.department}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {proposal.date}
                                </span>
                              </div>
                            </div>

                            {/* Voting Section */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Cast Your Vote</h4>
                              <div className="flex items-center gap-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`h-10 px-6 text-sm font-medium ${userVotes[proposal.id] === 'support' ? 'bg-[#003153] hover:bg-[#003153]/90 text-white border-[#003153]' : 'hover:bg-[#003153]/10 hover:text-[#003153] border-[#003153]/20 text-gray-700'}`}
                                  onClick={() => handleVote(proposal.id, 'support')}
                                >
                                  <ThumbsUpIcon className="h-4 w-4 mr-2" />
                                  Support ({proposal.supportCount})
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`h-10 px-6 text-sm font-medium ${userVotes[proposal.id] === 'oppose' ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'hover:bg-red-50 hover:text-red-600 border-red-200 text-gray-700'}`}
                                  onClick={() => handleVote(proposal.id, 'oppose')}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Oppose ({proposal.opposeCount})
                                </Button>
                              </div>
                            </div>

                            {/* Comments Section */}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Comments ({proposal.comments.length})</h4>
                              <div className="space-y-3 mb-4">
                                {proposal.comments.map((comment: any) => (
                                  <div key={comment.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                      <span className="font-medium text-sm text-gray-900 dark:text-white">{comment.author}</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{comment.text}</p>
                                    <div className="flex items-center gap-2">
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="h-6 px-2 text-xs hover:bg-[#003153]/10 hover:text-[#003153]"
                                        onClick={() => handleLikeComment(proposal.id, comment.id)}
                                      >
                                        <ThumbsUpIcon className="h-3 w-3 mr-1" />
                                        {comment.likes}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Add Comment */}
                              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Add Your Comment</h5>
                                <div className="space-y-3">
                                  <Textarea
                                    placeholder="Share your thoughts on this proposal..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                  <div className="flex justify-end">
                                    <Button 
                                      className="bg-[#003153] hover:bg-[#003153]/90"
                                      onClick={() => handleSubmitComment(proposal.id)}
                                      disabled={!newComment.trim() || isSubmittingComment}
                                    >
                                      <MessageCircle className="h-4 w-4 mr-2" />
                                      {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-6 lg:mt-8"
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader className="pb-4 sm:pb-5">
                    <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Announcements</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-sm">Stay updated with community news</CardDescription>
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
                              Community Announcement
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
                                This announcement was posted by the community administration. 
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

            {/* Quick Actions Sidebar */}
            <div className="lg:col-span-1 lg:col-start-3 lg:row-start-2">
              {/* Quick Actions */}
              
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
