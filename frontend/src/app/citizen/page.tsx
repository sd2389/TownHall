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
  Building2,
  Zap
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";

export default function CitizenPortal() {
  const { user } = useAuth();
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
    <ProtectedRoute allowedRoles={['citizen']}>
      <Layout userType="citizen" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-[#003153] to-[#003153]/90 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.firstName}! 👋
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Track your complaints, participate in proposals, and stay engaged with your community
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-[#003153] hover:bg-blue-50 font-semibold shadow-md"
                  onClick={() => alert('Redirecting to File New Complaint...')}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  File New Complaint
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: "Total Complaints", value: "12", icon: FileText, color: "from-blue-500 to-blue-600", bgGradient: "from-blue-50 to-blue-100/50", change: "+2 this week", trend: "up", subtitle: "Active issues" },
              { title: "Resolved", value: "8", icon: CheckCircle, color: "from-green-500 to-green-600", bgGradient: "from-green-50 to-green-100/50", change: "67% success rate", trend: "neutral", subtitle: "Completed" },
              { title: "In Progress", value: "3", icon: Clock, color: "from-amber-500 to-amber-600", bgGradient: "from-amber-50 to-amber-100/50", change: "Avg 3 days", trend: "neutral", subtitle: "Pending" },
              { title: "Community Score", value: "4.8", icon: Star, color: "from-purple-500 to-purple-600", bgGradient: "from-purple-50 to-purple-100/50", change: "Excellent", trend: "neutral", subtitle: "Rating" }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br to-white from-gray-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer group overflow-hidden relative" style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)' }}>
                    {/* Background gradient effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Decorative corner element */}
                    <div className="absolute top-0 right-0 w-32 h-32">
                      <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-3xl group-hover:blur-2xl group-hover:scale-150 transition-all duration-500`}></div>
                    </div>
                    
                    <CardContent className="p-6 h-full flex flex-col relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative`} style={{ boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)' }}>
                          <Icon className="h-7 w-7 text-white relative z-10" />
                        </div>
                        {stat.trend === 'up' && (
                          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3 flex-1 flex flex-col">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">{stat.subtitle}</p>
                        </div>
                        
                        <div className="flex items-baseline gap-2">
                          <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{stat.value}</p>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-600">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                            {stat.change}
                          </p>
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-[#003153]/5 to-transparent border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#003153] rounded-full animate-pulse"></div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Recent Complaints</CardTitle>
                      </div>
                      <Button size="sm" className="bg-[#003153] hover:bg-[#003153]/90 shadow-md">
                        <Plus className="h-4 w-4 mr-2" />
                        New
                      </Button>
                    </div>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">Track and manage your submitted issues</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-3">
                    {complaints.map((complaint) => (
                      <Dialog key={complaint.id}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.01, y: -2 }}
                            className="p-5 border-l-4 border-[#003153] bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">{complaint.title}</h3>
                                  {complaint.priority === 'high' && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">{complaint.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                              <Badge className={`${getStatusColor(complaint.status)} text-xs font-semibold px-3 py-1`}>
                                {complaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="truncate max-w-[100px]">{complaint.location}</span>
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {complaint.created}
                                </span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  <span className="font-medium">{complaint.assignedTo}</span>
                                </div>
                                <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-[#003153]/10 hover:text-[#003153] opacity-0 group-hover:opacity-100 transition-opacity">
                                  View Details →
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="border-0 bg-gradient-to-br from-[#003153] to-[#003153]/90 shadow-xl text-white overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-5 w-5" />
                      <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                    </div>
                    <CardDescription className="text-blue-100">Get things done faster</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-white text-[#003153] hover:bg-blue-50 font-medium shadow-md" 
                      variant="default"
                      onClick={() => alert('Redirecting to File New Complaint form...')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      File New Complaint
                    </Button>
                    <Button 
                      className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/20" 
                      variant="outline"
                      onClick={() => alert('Redirecting to Feedback form...')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Provide Feedback
                    </Button>
                    <Button 
                      className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/20" 
                      variant="outline"
                      onClick={() => alert('Opening Notification Settings...')}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Settings
                    </Button>
                    <Button 
                      className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/20" 
                      variant="outline"
                      onClick={() => alert('Downloading Reports...')}
                    >
                      <Download className="h-4 w-4 mr-2" />
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Vote className="h-6 w-6 text-[#003153]" />
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Bill Proposals</CardTitle>
                          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">Review and participate in government proposals</CardDescription>
                        </div>
                      </div>
                      <Select value={filterStatus} onValueChange={(value: 'all' | 'open' | 'closed') => setFilterStatus(value)}>
                        <SelectTrigger className="w-40 border-2">
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
                  <CardContent className="p-6 space-y-4">
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
                            whileHover={{ y: -4 }}
                            className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:border-[#003153]/40 cursor-pointer group"
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{proposal.title}</h3>
                                  <Badge className={`px-3 py-1 text-xs font-semibold ${
                                    proposal.status === 'open' 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                  }`}>
                                    {proposal.status === 'open' ? '● Open' : 'Closed'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">{proposal.summary}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-[#003153]" />
                                    {proposal.proposer}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-[#003153]" />
                                    {proposal.date}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Voting Section */}
                            <div className="mt-5 pt-5 border-t-2 border-gray-100 dark:border-gray-600">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    className={`h-9 px-4 text-sm font-semibold shadow-sm transition-all ${
                                      userVotes[proposal.id] === 'support' 
                                        ? 'bg-[#003153] hover:bg-[#003153]/90 text-white' 
                                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleVote(proposal.id, 'support');
                                    }}
                                  >
                                    <ThumbsUpIcon className="h-4 w-4 mr-1" />
                                    Support <span className="ml-1 font-bold">{proposal.supportCount}</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    className={`h-9 px-4 text-sm font-semibold shadow-sm transition-all ${
                                      userVotes[proposal.id] === 'oppose' 
                                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                                        : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleVote(proposal.id, 'oppose');
                                    }}
                                  >
                                    <ThumbsDown className="h-4 w-4 mr-1" />
                                    Oppose <span className="ml-1 font-bold">{proposal.opposeCount}</span>
                                  </Button>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-9 px-4 text-sm font-medium hover:bg-[#003153]/10 hover:text-[#003153] border-2 group-hover:border-[#003153]/30"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {proposal.comments.length} Comments
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8"
              >
                <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className="h-5 w-5 text-[#003153]" />
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Community Announcements</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">Stay updated with latest community news and events</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {announcements.map((announcement) => (
                      <Dialog key={announcement.id}>
                        <DialogTrigger asChild>
                          <motion.div
                            whileHover={{ y: -2 }}
                            className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer group hover:border-[#003153]/40"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                                  <Bell className="h-5 w-5 text-white" />
                                </div>
                                <h4 className="font-bold text-base text-gray-900 dark:text-white leading-tight">{announcement.title}</h4>
                              </div>
                              <Badge className={`${
                                announcement.type === 'Event' ? 'bg-purple-100 text-purple-700' :
                                announcement.type === 'Alert' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              } text-xs font-semibold px-3 py-1`}>
                                {announcement.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">{announcement.description}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="h-4 w-4 mr-2 text-[#003153]" />
                                {announcement.date}
                              </span>
                              <Button size="sm" variant="ghost" className="text-xs hover:bg-[#003153]/10 hover:text-[#003153] opacity-0 group-hover:opacity-100 transition-all">
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
    </ProtectedRoute>
  );
}
