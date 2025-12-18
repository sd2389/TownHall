"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { governmentBusinessApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Building2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  CheckCircle2,
  XCircle as XCircleIcon,
  Clock3,
  MapPin,
  User,
  Calendar,
  Loader2,
} from "lucide-react";

export default function GovernmentBusinessApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewComment, setReviewComment] = useState("");

  // Fetch pending applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await governmentBusinessApi.listPendingApplications();
        setApplications(data);
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
  }, [user]);

  // Handle review action
  const handleReview = async (applicationId: number, action: 'approve' | 'reject') => {
    try {
      setIsReviewing(true);
      await governmentBusinessApi.reviewApplication(applicationId, action);
      // Refresh applications list
      const data = await governmentBusinessApi.listPendingApplications();
      setApplications(data);
      setReviewAction(null);
      setSelectedApplication(null);
      setReviewComment("");
    } catch (err: any) {
      console.error('Error reviewing application:', err);
      alert(err.message || 'Failed to review application');
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle2;
      case "pending":
        return Clock3;
      case "rejected":
        return XCircleIcon;
      default:
        return AlertCircle;
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.license_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.business_owner?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <ProtectedRoute allowedRoles={['government', 'superuser']}>
      <Layout 
        userType="government" 
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
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Business Applications Review</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Review and approve/reject business license and permit applications</p>
                </div>
                <Badge className="bg-[#003153] text-white px-4 py-2">
                  {applications.length} Pending
                </Badge>
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

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by business name, license type, or owner..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
              </div>
            )}

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
                                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {application.license_type}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                        {application.description || 'No description provided'}
                                      </p>
                                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center">
                                          <Building2 className="h-4 w-4 mr-1" />
                                          {application.business_name}
                                        </span>
                                        <span className="flex items-center">
                                          <User className="h-4 w-4 mr-1" />
                                          {application.business_owner}
                                        </span>
                                        <span className="flex items-center">
                                          <Calendar className="h-4 w-4 mr-1" />
                                          Applied: {application.created_at}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 ml-4">
                                      <Badge className={`${getStatusColor(application.status)} text-xs px-3 py-1 flex items-center justify-center`}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      License #: <span className="font-medium">{application.license_number}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="h-8 text-xs">
                                        <Eye className="h-3 w-3 mr-1" />
                                        Review
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
                              {application.license_type}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300">
                              Application Review
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Application Information */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Application Information</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Business Name:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{application.business_name}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Business Owner:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{application.business_owner}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">License Number:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{application.license_number}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Application Date:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{application.created_at}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Business Address:</span>
                                  <p className="text-gray-600 dark:text-gray-300">{application.business_address || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                                  <Badge className={`${getStatusColor(application.status)} text-xs ml-2`}>
                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            {application.description && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                                <p className="text-gray-600 dark:text-gray-300">{application.description}</p>
                              </div>
                            )}

                            {/* Review Actions */}
                            {application.status === 'pending' && (
                              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Review Comment (Optional)</h4>
                                <Textarea
                                  placeholder="Add a comment about your decision..."
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  className="mb-4"
                                  rows={3}
                                />
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => {
                                      setSelectedApplication(application);
                                      setReviewAction('approve');
                                    }}
                                    disabled={isReviewing}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Approve Application
                                  </Button>
                                  <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => {
                                      setSelectedApplication(application);
                                      setReviewAction('reject');
                                    }}
                                    disabled={isReviewing}
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-2" />
                                    Reject Application
                                  </Button>
                                </div>
                              </div>
                            )}
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Pending Applications</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm 
                    ? 'No applications match your search.' 
                    : 'All business applications have been reviewed.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Review Confirmation Dialog */}
        <AlertDialog open={reviewAction !== null} onOpenChange={(open) => !open && setReviewAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {reviewAction === 'approve' ? 'Approve Application?' : 'Reject Application?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {reviewAction === 'approve' 
                  ? `Are you sure you want to approve the license application for "${selectedApplication?.business_name}"? This action cannot be undone.`
                  : `Are you sure you want to reject the license application for "${selectedApplication?.business_name}"? This action cannot be undone.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isReviewing}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedApplication && reviewAction) {
                    handleReview(selectedApplication.id, reviewAction);
                  }
                }}
                disabled={isReviewing}
                className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  reviewAction === 'approve' ? 'Approve' : 'Reject'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout>
    </ProtectedRoute>
  );
}









