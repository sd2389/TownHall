"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Gavel, 
  Calendar, 
  Clock, 
  AlertCircle,
  Edit,
  Trash2,
  Building2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  User,
  ArrowLeft,
  RefreshCw,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { billsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";

// Dynamically import recharts to avoid SSR issues
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });

export default function BillDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const billId = parseInt(params.id as string);
  
  const [bill, setBill] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    summary: '',
    priority: 'medium',
    status: 'draft',
    review_deadline: '',
    tags: [] as string[],
  });

  // Fetch bill details
  useEffect(() => {
    const fetchBill = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await billsApi.get(billId);
        setBill(data);
        setFormData({
          title: data.title,
          description: data.description,
          summary: data.summary || '',
          priority: data.priority,
          status: data.status,
          review_deadline: data.review_deadline || '',
          tags: data.tags || [],
        });
      } catch (err: any) {
        console.error('Error fetching bill:', err);
        setError(err.message || 'Failed to load bill');
      } finally {
        setIsLoading(false);
      }
    };

    if (billId) {
      fetchBill();
    }
  }, [billId]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoadingComments(true);
        const data = await billsApi.getComments(billId);
        setComments(data);
      } catch (err: any) {
        console.error('Error fetching comments:', err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    if (billId) {
      fetchComments();
    }
  }, [billId]);

  const handleVote = async (voteType: 'support' | 'oppose') => {
    if (!bill) return;

    try {
      setIsVoting(true);
      setError(null);
      await billsApi.vote(billId, voteType);
      
      // Refresh bill to get updated vote counts
      const updatedBill = await billsApi.get(billId);
      setBill(updatedBill);
    } catch (err: any) {
      console.error('Error voting:', err);
      setError(err.message || 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleRemoveVote = async () => {
    if (!bill) return;

    try {
      setIsVoting(true);
      setError(null);
      await billsApi.removeVote(billId);
      
      // Refresh bill to get updated vote counts
      const updatedBill = await billsApi.get(billId);
      setBill(updatedBill);
    } catch (err: any) {
      console.error('Error removing vote:', err);
      setError(err.message || 'Failed to remove vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      setError(null);
      await billsApi.addComment(billId, newComment);
      setNewComment("");
      
      // Refresh comments
      const data = await billsApi.getComments(billId);
      setComments(data);
      
      // Refresh bill to update comment count
      const updatedBill = await billsApi.get(billId);
      setBill(updatedBill);
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      setError(err.message || 'Failed to submit comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleUpdateBill = async () => {
    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await billsApi.update(billId, {
        title: formData.title,
        description: formData.description,
        summary: formData.summary,
        status: formData.status,
        priority: formData.priority,
        review_deadline: formData.review_deadline || undefined,
        tags: formData.tags,
      });
      
      setIsEditDialogOpen(false);
      
      // Refresh bill
      const updatedBill = await billsApi.get(billId);
      setBill(updatedBill);
    } catch (err: any) {
      console.error('Error updating bill:', err);
      setError(err.message || 'Failed to update bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBill = async () => {
    if (!confirm('Are you sure you want to delete this bill proposal?')) {
      return;
    }

    try {
      await billsApi.delete(billId);
      router.push('/government/bills');
    } catch (err: any) {
      console.error('Error deleting bill:', err);
      setError(err.message || 'Failed to delete bill');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      published: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      implemented: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      archived: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    };
    return colors[status] || colors.draft;
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

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['government', 'superuser']}>
        <Layout userType="government" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading bill...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error && !bill) {
    return (
      <ProtectedRoute allowedRoles={['government', 'superuser']}>
        <Layout userType="government" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                  <Button onClick={() => router.push('/government/bills')} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Bills
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!bill) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['government', 'superuser']}>
      <Layout userType="government" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Button
                variant="outline"
                onClick={() => router.push('/government/bills')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bills
              </Button>
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

            {/* Bill Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <CardTitle className="text-2xl sm:text-3xl">Bill: {bill.title}</CardTitle>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(bill.priority)}>
                          {bill.priority}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-4">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {bill.department?.name || bill.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {bill.created_at}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {bill.views} Views
                        </span>
                        {bill.created_by && (
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {bill.created_by}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditDialogOpen(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteBill}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {bill.summary && (
                    <CardDescription className="text-base mb-4">
                      {bill.summary}
                    </CardDescription>
                  )}
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {bill.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Voting Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Public Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <ThumbsUp className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Support</p>
                          <p className="text-2xl font-bold text-green-600">{bill.support_count || 0}</p>
                        </div>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-3">
                        <ThumbsDown className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Oppose</p>
                          <p className="text-2xl font-bold text-red-600">{bill.oppose_count || 0}</p>
                        </div>
                      </div>
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                  </div>

                  {/* Vote Chart */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Vote Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Bar Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'Support', votes: bill.support_count || 0, color: '#10b981' },
                              { name: 'Oppose', votes: bill.oppose_count || 0, color: '#ef4444' }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: number) => [value, 'Votes']}
                              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                            />
                            <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                              {[
                                { name: 'Support', votes: bill.support_count || 0, color: '#10b981' },
                                { name: 'Oppose', votes: bill.oppose_count || 0, color: '#ef4444' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Pie Chart */}
                      {(bill.support_count > 0 || bill.oppose_count > 0) && (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Support', value: bill.support_count || 0, color: '#10b981' },
                                  { name: 'Oppose', value: bill.oppose_count || 0, color: '#ef4444' }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {[
                                  { name: 'Support', value: bill.support_count || 0, color: '#10b981' },
                                  { name: 'Oppose', value: bill.oppose_count || 0, color: '#ef4444' }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number) => [value, 'Votes']}
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {bill.total_votes > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Support Percentage
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {bill.support_percentage?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${bill.support_percentage || 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant={bill.user_vote === 'support' ? 'default' : 'outline'}
                      onClick={() => bill.user_vote === 'support' ? handleRemoveVote() : handleVote('support')}
                      disabled={isVoting}
                      className={bill.user_vote === 'support' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {bill.user_vote === 'support' ? 'Supported' : 'Support'}
                    </Button>
                    <Button
                      variant={bill.user_vote === 'oppose' ? 'default' : 'outline'}
                      onClick={() => bill.user_vote === 'oppose' ? handleRemoveVote() : handleVote('oppose')}
                      disabled={isVoting}
                      className={bill.user_vote === 'oppose' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      {bill.user_vote === 'oppose' ? 'Opposed' : 'Oppose'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments ({bill.comment_count || comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add Comment */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="Add your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <Button
                      onClick={handleSubmitComment}
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="bg-[#003153] hover:bg-[#003153]/90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
                    </Button>
                  </div>

                  {/* Comments List */}
                  {isLoadingComments ? (
                    <div className="text-center py-4">
                      <RefreshCw className="h-6 w-6 animate-spin text-slate-400 mx-auto" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">No comments yet</p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card key={comment.id} className="border-slate-200 dark:border-slate-700">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">{comment.author}</span>
                                  {comment.author_role && (
                                    <Badge variant="outline" className="text-xs">
                                      {comment.author_role}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                                  {comment.comment_text}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {comment.created_at}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Info */}
            {(bill.review_deadline || bill.published_at || bill.tags?.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bill.published_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Published: {bill.published_at}
                          </span>
                        </div>
                      )}
                      {bill.review_deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Review Deadline: {bill.review_deadline}
                          </span>
                        </div>
                      )}
                      {bill.tags && bill.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags:</span>
                          {bill.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Edit Bill Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Bill Proposal</DialogTitle>
                  <DialogDescription>
                    Update the bill proposal details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter bill title"
                      className="border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Summary
                    </label>
                    <Input
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Short summary (optional)"
                      className="border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Description *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter detailed description"
                      rows={6}
                      className="border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                        Priority
                      </label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger className="border-slate-300 dark:border-slate-600">
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
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                        Status
                      </label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="border-slate-300 dark:border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="implemented">Implemented</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Review Deadline
                    </label>
                    <Input
                      type="date"
                      value={formData.review_deadline}
                      onChange={(e) => setFormData({ ...formData, review_deadline: e.target.value })}
                      className="border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#003153] hover:bg-[#003153]/90 text-white"
                      onClick={handleUpdateBill}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Bill'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

