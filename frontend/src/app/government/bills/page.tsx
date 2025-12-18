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
  Gavel, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  CheckCircle2,
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
  Eye as EyeIcon,
  Vote,
  TrendingDown,
  ArrowLeft,
  Home
} from "lucide-react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { billsApi, departmentsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function GovernmentBills() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'under_review' | 'approved' | 'rejected' | 'implemented' | 'archived'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'votes' | 'comments'>('date');
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    summary: '',
    department_id: '',
    priority: 'medium',
    status: 'draft',
    review_deadline: '',
    tags: [] as string[],
  });

  // Fetch bills from API
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const filters: any = {};
        if (filterStatus !== 'all') filters.status = filterStatus;
        if (filterPriority !== 'all') filters.priority = filterPriority;
        if (sortBy) filters.sort = sortBy === 'date' ? '-created_at' : sortBy;
        
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
  }, [user, filterStatus, filterPriority, sortBy]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentsApi.list();
        setDepartments(data);
      } catch (err: any) {
        console.error('Error fetching departments:', err);
      }
    };

    if (user) {
      fetchDepartments();
    }
  }, [user]);

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
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[priority] || colors.medium;
  };

  const handleCreateBill = async () => {
    if (!formData.title || !formData.description || !formData.department_id) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await billsApi.create({
        title: formData.title,
        description: formData.description,
        summary: formData.summary,
        department_id: parseInt(formData.department_id),
        priority: formData.priority,
        status: formData.status,
        review_deadline: formData.review_deadline || undefined,
        tags: formData.tags,
      });
      
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        summary: '',
        department_id: '',
        priority: 'medium',
        status: 'draft',
        review_deadline: '',
        tags: [],
      });
      
      // Refresh bills list
      const filters: any = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterPriority !== 'all') filters.priority = filterPriority;
      if (sortBy) filters.sort = sortBy === 'date' ? '-created_at' : sortBy;
      const data = await billsApi.list(filters);
      setBills(data);
    } catch (err: any) {
      console.error('Error creating bill:', err);
      // Show more detailed error message for network errors
      if (err.isNetworkError) {
        setError(err.message || 'Cannot connect to the backend server. Please ensure the Django server is running.');
      } else {
        setError(err.message || 'Failed to create bill');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBill = async () => {
    if (!selectedBill || !formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await billsApi.update(selectedBill.id, {
        title: formData.title,
        description: formData.description,
        summary: formData.summary,
        status: formData.status,
        priority: formData.priority,
        review_deadline: formData.review_deadline || undefined,
        tags: formData.tags,
      });
      
      setIsEditDialogOpen(false);
      setSelectedBill(null);
      
      // Refresh bills list
      const filters: any = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterPriority !== 'all') filters.priority = filterPriority;
      if (sortBy) filters.sort = sortBy === 'date' ? '-created_at' : sortBy;
      const data = await billsApi.list(filters);
      setBills(data);
    } catch (err: any) {
      console.error('Error updating bill:', err);
      setError(err.message || 'Failed to update bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBill = async (billId: number) => {
    if (!confirm('Are you sure you want to delete this bill proposal?')) {
      return;
    }

    try {
      await billsApi.delete(billId);
      // Refresh bills list
      const filters: any = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterPriority !== 'all') filters.priority = filterPriority;
      if (sortBy) filters.sort = sortBy === 'date' ? '-created_at' : sortBy;
      const data = await billsApi.list(filters);
      setBills(data);
    } catch (err: any) {
      console.error('Error deleting bill:', err);
      setError(err.message || 'Failed to delete bill');
    }
  };

  const handleEditClick = (bill: any) => {
    setSelectedBill(bill);
    setFormData({
      title: bill.title,
      description: bill.description,
      summary: bill.summary || '',
      department_id: '',
      priority: bill.priority,
      status: bill.status,
      review_deadline: bill.review_deadline || '',
      tags: bill.tags || [],
    });
    setIsEditDialogOpen(true);
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <ProtectedRoute allowedRoles={['government', 'superuser']}>
      <Layout userType="government" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} userEmail={user?.email || ''} showPortalNav={true}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#003153] rounded-lg flex items-center justify-center">
                        <Gavel className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Bill Proposals</h1>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Create and manage legislative proposals</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href="/government">
                      <Button 
                        variant="outline" 
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <Home className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button 
                      className="bg-[#003153] hover:bg-[#003153]/90 text-white border-0"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Bill
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search bills..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 border-slate-300 dark:border-slate-600"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                        <SelectTrigger className="w-[140px] border-slate-300 dark:border-slate-600">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="implemented">Implemented</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                        <SelectTrigger className="w-[140px] border-slate-300 dark:border-slate-600">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priority</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-[140px] border-slate-300 dark:border-slate-600">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="votes">Votes</SelectItem>
                          <SelectItem value="comments">Comments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No bills found</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Get started by creating your first bill proposal</p>
                  <Button 
                    className="bg-[#003153] hover:bg-[#003153]/90 text-white"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Bill
                  </Button>
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
                              <Badge className={getPriorityColor(bill.priority)}>
                                {bill.priority}
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
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {bill.views} Views
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/government/bills/${bill.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(bill)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBill(bill.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Create Bill Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Bill Proposal</DialogTitle>
                  <DialogDescription>
                    Create a new legislative proposal for review and public feedback
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
                        Department *
                      </label>
                      <Select value={formData.department_id} onValueChange={(value) => setFormData({ ...formData, department_id: value })}>
                        <SelectTrigger className="border-slate-300 dark:border-slate-600">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                        </SelectContent>
                      </Select>
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
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#003153] hover:bg-[#003153]/90 text-white"
                      onClick={handleCreateBill}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Bill'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

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

