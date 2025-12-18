"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Filter, Plus, Eye, Search, FileText, Calendar, Loader2, Building2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { businessApi } from "@/lib/api";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function BusinessComplaintsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("open");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

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
        
        const data = await businessApi.complaints.list(filters);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'open' && (complaint.status === 'pending' || complaint.status === 'in_progress')) ||
                      (activeTab === 'resolved' && complaint.status === 'resolved') ||
                      (activeTab === 'closed' && complaint.status === 'closed');
    
    return matchesSearch && matchesTab;
  });

  const handleViewDetails = async (complaint: any) => {
    try {
      const details = await businessApi.complaints.get(complaint.id);
      setSelectedComplaint(details);
      setIsViewDialogOpen(true);
    } catch (err: any) {
      console.error('Error fetching complaint details:', err);
      alert(err.message || 'Failed to load complaint details');
    }
  };

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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Business Complaints</h1>
                      <p className="text-green-100 text-xs sm:text-sm md:text-base mt-1">Report issues and track your complaints with the government</p>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50 font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
                    onClick={() => router.push('/business/complaints/create')}
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm sm:text-base">File New Complaint</span>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Search and Filters */}
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
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 dark:border-slate-600"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
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

            {/* Complaints List */}
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Loading complaints...</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredComplaints.length === 0 ? (
                    <Card className="border-slate-200 dark:border-slate-700">
                      <CardContent className="p-12 text-center">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No complaints found</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          {activeTab === 'all' 
                            ? "You haven't filed any complaints yet."
                            : `You don't have any ${activeTab} complaints.`}
                        </p>
                        <Button 
                          onClick={() => router.push('/business/complaints/create')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          File Your First Complaint
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {filteredComplaints.map((complaint, index) => (
                        <motion.div
                          key={complaint.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card 
                            className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleViewDetails(complaint)}
                          >
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                                    <Badge className={getStatusColor(complaint.status)}>
                                      {complaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Badge>
                                    <Badge className={getPriorityColor(complaint.priority)}>
                                      {complaint.priority}
                                    </Badge>
                                  </div>
                                  <CardDescription className="line-clamp-2">
                                    {complaint.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {complaint.category}
                                </span>
                                {complaint.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {complaint.location}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {complaint.created_at || complaint.created}
                                </span>
                                {complaint.assigned_to && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-4 w-4" />
                                    {complaint.assigned_to}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {/* View Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedComplaint?.title}</DialogTitle>
                  <DialogDescription>
                    Complaint Details
                  </DialogDescription>
                </DialogHeader>
                {selectedComplaint && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {selectedComplaint.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Category:</span>
                        <p className="text-slate-600 dark:text-slate-400">{selectedComplaint.category}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Status:</span>
                        <p className="text-slate-600 dark:text-slate-400">
                          <Badge className={getStatusColor(selectedComplaint.status)}>
                            {selectedComplaint.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Priority:</span>
                        <p className="text-slate-600 dark:text-slate-400">
                          <Badge className={getPriorityColor(selectedComplaint.priority)}>
                            {selectedComplaint.priority}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Created:</span>
                        <p className="text-slate-600 dark:text-slate-400">{selectedComplaint.created_at || selectedComplaint.created}</p>
                      </div>
                      {selectedComplaint.location && (
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Location:</span>
                          <p className="text-slate-600 dark:text-slate-400">{selectedComplaint.location}</p>
                        </div>
                      )}
                      {selectedComplaint.assigned_to && (
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Assigned To:</span>
                          <p className="text-slate-600 dark:text-slate-400">{selectedComplaint.assigned_to}</p>
                        </div>
                      )}
                      {selectedComplaint.estimated_resolution && (
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Estimated Resolution:</span>
                          <p className="text-slate-600 dark:text-slate-400">{selectedComplaint.estimated_resolution}</p>
                        </div>
                      )}
                      {selectedComplaint.town_name && (
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Town:</span>
                          <p className="text-slate-600 dark:text-slate-400">{selectedComplaint.town_name}</p>
                        </div>
                      )}
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







