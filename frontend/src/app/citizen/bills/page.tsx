"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Gavel, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  User,
  Building2,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Send,
  ArrowLeft,
  Home
} from "lucide-react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { billsApi } from "@/lib/api";
import React, { useState, useEffect } from "react";

export default function CitizenBills() {
  const { user } = useAuth();
  const [bills, setBills] = useState<any[]>([]);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isVoting, setIsVoting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'under_review' | 'approved'>('all');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch bills
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const filters: any = {};
        if (filterStatus !== 'all') filters.status = filterStatus;
        filters.sort = '-created_at';
        
        const data = await billsApi.list(filters);
        setBills(data);
      } catch (err: any) {
        console.error('Error fetching bills:', err);
        setError(err.message || 'Failed to load bills');
        setBills([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBills();
    }
  }, [user, filterStatus]);

  // Fetch comments when bill is selected
  useEffect(() => {
    if (selectedBill) {
      const fetchComments = async () => {
        try {
          setIsLoadingComments(true);
          const data = await billsApi.getComments(selectedBill.id);
          setComments(data);
        } catch (err: any) {
          console.error('Error fetching comments:', err);
        } finally {
          setIsLoadingComments(false);
        }
      };
      fetchComments();
    }
  }, [selectedBill]);

  const handleVote = async (billId: number, voteType: 'support' | 'oppose') => {
    try {
      setIsVoting(billId);
      setError(null);
      await billsApi.vote(billId, voteType);
      
      // Refresh bills to get updated vote counts
      const filters: any = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      filters.sort = '-created_at';
      const data = await billsApi.list(filters);
      setBills(data);
      
      // Update selected bill if it's the one being voted on
      if (selectedBill && selectedBill.id === billId) {
        const updatedBill = await billsApi.get(billId);
        setSelectedBill(updatedBill);
      }
    } catch (err: any) {
      console.error('Error voting:', err);
      setError(err.message || 'Failed to vote');
    } finally {
      setIsVoting(null);
    }
  };

  const handleRemoveVote = async (billId: number) => {
    try {
      setIsVoting(billId);
      setError(null);
      await billsApi.removeVote(billId);
      
      // Refresh bills
      const filters: any = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      filters.sort = '-created_at';
      const data = await billsApi.list(filters);
      setBills(data);
      
      // Update selected bill
      if (selectedBill && selectedBill.id === billId) {
        const updatedBill = await billsApi.get(billId);
        setSelectedBill(updatedBill);
      }
    } catch (err: any) {
      console.error('Error removing vote:', err);
      setError(err.message || 'Failed to remove vote');
    } finally {
      setIsVoting(null);
    }
  };

  const handleSubmitComment = async () => {
    if (!selectedBill || !newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      setError(null);
      await billsApi.addComment(selectedBill.id, newComment);
      setNewComment("");
      
      // Refresh comments
      const data = await billsApi.getComments(selectedBill.id);
      setComments(data);
      
      // Refresh bills to update comment count
      const filters: any = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      filters.sort = '-created_at';
      const billsData = await billsApi.list(filters);
      setBills(billsData);
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      setError(err.message || 'Failed to submit comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleViewDetails = async (bill: any) => {
    try {
      const billDetails = await billsApi.get(bill.id);
      setSelectedBill(billDetails);
      setIsDetailDialogOpen(true);
    } catch (err: any) {
      console.error('Error fetching bill details:', err);
      setError(err.message || 'Failed to load bill details');
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
    };
    return colors[status] || colors.draft;
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <ProtectedRoute allowedRoles={['citizen']}>
      <Layout userType="citizen" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
            
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
                      <Gavel className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Bill Proposals</h1>
                      <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-1">Review and vote on legislative proposals</p>
                    </div>
                  </div>
                  <Link href="/citizen">
                    <Button 
                      variant="outline" 
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <Home className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
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
                        placeholder="Search bills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 dark:border-slate-600"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
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

            {/* Bills List */}
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Loading bills...</p>
              </div>
            ) : filteredBills.length === 0 ? (
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <Gavel className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No bills found</h3>
                  <p className="text-slate-600 dark:text-slate-400">There are no bill proposals available at this time</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredBills.map((bill, index) => (
                  <motion.div
                    key={bill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <CardTitle className="text-xl">{bill.title}</CardTitle>
                              <Badge className={getStatusColor(bill.status)}>
                                {bill.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <CardDescription className="mt-2">
                              {bill.summary || bill.description.substring(0, 200)}...
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {bill.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {bill.created_at}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              {bill.support_count} Support
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsDown className="h-4 w-4" />
                              {bill.oppose_count} Oppose
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {bill.comment_count} Comments
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(bill)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant={bill.user_vote === 'support' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => bill.user_vote === 'support' ? handleRemoveVote(bill.id) : handleVote(bill.id, 'support')}
                              disabled={isVoting === bill.id}
                              className={bill.user_vote === 'support' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              {bill.user_vote === 'support' ? 'Supported' : 'Support'}
                            </Button>
                            <Button
                              variant={bill.user_vote === 'oppose' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => bill.user_vote === 'oppose' ? handleRemoveVote(bill.id) : handleVote(bill.id, 'oppose')}
                              disabled={isVoting === bill.id}
                              className={bill.user_vote === 'oppose' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              {bill.user_vote === 'oppose' ? 'Opposed' : 'Oppose'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Bill Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedBill?.title}</DialogTitle>
                  <DialogDescription>
                    {selectedBill?.summary || selectedBill?.description}
                  </DialogDescription>
                </DialogHeader>
                {selectedBill && (
                  <div className="space-y-6">
                    {/* Bill Details */}
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {selectedBill.description}
                      </p>
                    </div>

                    {/* Voting Section */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <ThumbsUp className="h-5 w-5 text-green-600" />
                            <span className="font-semibold">{selectedBill.support_count} Support</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThumbsDown className="h-5 w-5 text-red-600" />
                            <span className="font-semibold">{selectedBill.oppose_count} Oppose</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedBill.user_vote === 'support' ? 'default' : 'outline'}
                            onClick={() => selectedBill.user_vote === 'support' ? handleRemoveVote(selectedBill.id) : handleVote(selectedBill.id, 'support')}
                            disabled={isVoting === selectedBill.id}
                            className={selectedBill.user_vote === 'support' ? 'bg-green-600 hover:bg-green-700' : ''}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            {selectedBill.user_vote === 'support' ? 'Supported' : 'Support'}
                          </Button>
                          <Button
                            variant={selectedBill.user_vote === 'oppose' ? 'default' : 'outline'}
                            onClick={() => selectedBill.user_vote === 'oppose' ? handleRemoveVote(selectedBill.id) : handleVote(selectedBill.id, 'oppose')}
                            disabled={isVoting === selectedBill.id}
                            className={selectedBill.user_vote === 'oppose' ? 'bg-red-600 hover:bg-red-700' : ''}
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            {selectedBill.user_vote === 'oppose' ? 'Opposed' : 'Oppose'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                      <h3 className="font-semibold mb-4">Comments ({selectedBill.comment_count})</h3>
                      
                      {/* Add Comment */}
                      <div className="mb-4">
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
                                      <Badge variant="outline" className="text-xs">
                                        {comment.author_role}
                                      </Badge>
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

