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
  Bell
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { businessApi } from "@/lib/api";
import React, { useState, useEffect } from "react";

export default function BusinessApplications() {
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const filters: any = {};
        if (filterStatus !== 'all') {
          filters.status = filterStatus;
        }
        const data = await businessApi.licenses.list(filters);
        // Map API data to component format
        const mappedApplications = data.map((license: any) => ({
          id: license.id,
          title: license.license_type,
          type: license.license_type,
          status: license.status,
          applicationDate: license.created_at,
          approvalDate: license.issue_date || null,
          fee: "N/A", // Fee not in API yet
          description: license.description || '',
          category: "License",
          assignedTo: "Business Licensing Dept", // Default
          estimatedResolution: license.status === 'approved' ? 'Completed' : 
                               license.status === 'rejected' ? 'Rejected' : 'Pending Review',
          documents: [], // Not in API yet
          requirements: [], // Not in API yet
          comments: [], // Not in API yet
          expiry_date: license.expiry_date,
        }));
        setApplications(mappedApplications);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError(err.message || 'Failed to load applications');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle2;
      case "pending":
        return Clock3;
      case "under_review":
        return AlertCircle;
      case "rejected":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || application.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Business Applications</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Track and manage your business applications and permits</p>
              </div>
              <Button 
                className="bg-[#003153] hover:bg-[#003153]/90"
                onClick={() => {
                  // TODO: Open create application dialog
                  alert('Create application feature coming soon');
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit New Application
              </Button>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Clock3 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
            </div>
          )}

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
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'pending' | 'approved' | 'rejected' | 'expired') => setFilterStatus(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'status') => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Applications List */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
            {filteredApplications.map((application, index) => {
              const StatusIcon = getStatusIcon(application.status);
              return (
                <motion.div
                  key={application.id}
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
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{application.title}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{application.description}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      Applied: {application.applicationDate}
                                    </span>
                                    <span className="flex items-center">
                                      <Building2 className="h-4 w-4 mr-1" />
                                      {application.category}
                                    </span>
                                    <span className="flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      {application.fee}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4">
                                  <Badge className={`${getStatusColor(application.status)} text-xs px-3 py-1 flex items-center justify-center`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {application.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </Badge>
                                  {application.approvalDate && (
                                    <span className="text-xs text-gray-500">
                                      Approved: {application.approvalDate}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Assigned to: <span className="font-medium">{application.assignedTo}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="h-8 text-xs">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  {application.status === 'pending' && (
                                    <Button size="sm" variant="outline" className="h-8 text-xs">
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                  )}
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
                          {application.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                          Application Details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Application Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Application Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Type:</span>
                              <p className="text-gray-600 dark:text-gray-300">{application.type}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Category:</span>
                              <p className="text-gray-600 dark:text-gray-300">{application.category}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Application Date:</span>
                              <p className="text-gray-600 dark:text-gray-300">{application.applicationDate}</p>
                            </div>
                            {application.approvalDate && (
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">Approval Date:</span>
                                <p className="text-gray-600 dark:text-gray-300">{application.approvalDate}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Fee:</span>
                              <p className="text-gray-600 dark:text-gray-300">{application.fee}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                              <Badge className={`${getStatusColor(application.status)} text-xs ml-2`}>
                                {application.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300">{application.description}</p>
                        </div>

                        {/* Assigned Department */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Assigned Department</h4>
                          <p className="text-gray-600 dark:text-gray-300">{application.assignedTo}</p>
                        </div>

                        {/* Resolution Status */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Resolution Status</h4>
                          <p className="text-gray-600 dark:text-gray-300">{application.estimatedResolution}</p>
                        </div>

                        {/* Required Documents */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Required Documents</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {application.documents.map((doc: string, index: number) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {application.requirements.map((req: string, index: number) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Comments */}
                        {application.comments.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Comments & Updates</h4>
                            <div className="space-y-3">
                              {application.comments.map((comment: any) => (
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
                          {application.status === 'approved' && (
                            <Button className="bg-[#003153] hover:bg-[#003153]/90">
                              <Download className="h-4 w-4 mr-2" />
                              Download Certificate
                            </Button>
                          )}
                          {application.status === 'pending' && (
                            <Button className="bg-[#003153] hover:bg-[#003153]/90">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Application
                            </Button>
                          )}
                          {application.status === 'rejected' && (
                            <Button className="bg-[#003153] hover:bg-[#003153]/90">
                              <Plus className="h-4 w-4 mr-2" />
                              Reapply
                            </Button>
                          )}
                          <Button variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
                          </Button>
                          <Button variant="outline">
                            <Bell className="h-4 w-4 mr-2" />
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              );
            })}
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && filteredApplications.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Applications Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No applications match your current filters.' 
                  : 'You don\'t have any applications yet.'}
              </p>
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Application
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  );
}
