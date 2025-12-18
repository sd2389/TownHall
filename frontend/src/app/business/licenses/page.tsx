"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
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
  SortDesc
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { businessApi } from "@/lib/api";
import { getLicenseRequirements, getLicenseDocuments } from "@/lib/licenseData";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Create License Form Component
function CreateLicenseForm({ onSuccess }: { onSuccess: () => void }) {
  const [licenseType, setLicenseType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseType.trim()) {
      toast({
        title: "Error",
        description: "License type is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await businessApi.licenses.create({
        license_type: licenseType,
        description: description.trim(),
      });
      toast({
        title: "Success",
        description: "License application submitted successfully",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="license_type">License Type *</Label>
        <Input
          id="license_type"
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
          placeholder="e.g., Business License, Operating Permit, etc."
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about your license application..."
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#003153] hover:bg-[#003153]/90" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}

export default function BusinessLicenses() {
  const { user } = useAuth();
  const [selectedLicense, setSelectedLicense] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'expiry' | 'status'>('name');
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch licenses from API
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const filters: any = {};
        if (filterStatus !== 'all') {
          filters.status = filterStatus === 'active' ? 'approved' : filterStatus;
        }
        const data = await businessApi.licenses.list(filters);
        // Map API data to component format
        const mappedLicenses = data.map((license: any) => ({
          id: license.id,
          name: license.license_type,
          type: license.license_type,
          license_number: license.license_number || '',
          status: license.status === 'approved' ? 'active' : license.status,
          issueDate: license.issue_date || license.created_at,
          expiryDate: license.expiry_date || null,
          fee: license.fee ? `$${parseFloat(license.fee).toFixed(2)}` : 'N/A',
          fee_paid: license.fee_paid || false,
          description: license.description || '',
          review_comment: license.review_comment || '',
          review_date: license.review_date || null,
          reviewed_by: license.reviewed_by || null,
          attachments: license.attachments || [],
          renewal_required: license.renewal_required || false,
          created_at: license.created_at || '',
          requirements: license.requirements || getLicenseRequirements(license.license_type),
          documents: license.documents || license.attachments || getLicenseDocuments(license.license_type)
        }));
        setLicenses(mappedLicenses);
      } catch (err: any) {
        console.error('Error fetching licenses:', err);
        setError(err.message || 'Failed to load licenses');
        setLicenses([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchLicenses();
    }
  }, [user, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle2;
      case "expired":
        return XCircle;
      case "pending":
        return Clock3;
      default:
        return AlertCircle;
    }
  };

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || license.status === filterStatus;
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Business Licenses</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your business licenses and permits</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#003153] hover:bg-[#003153]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for New License
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Apply for New License</DialogTitle>
                    <DialogDescription>
                      Submit a new license application for government review
                    </DialogDescription>
                  </DialogHeader>
                  <CreateLicenseForm onSuccess={() => {
                    window.location.reload();
                  }} />
                </DialogContent>
              </Dialog>
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
              <p className="text-gray-600 dark:text-gray-400">Loading licenses...</p>
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
                        placeholder="Search licenses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'expired' | 'pending') => setFilterStatus(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'name' | 'expiry' | 'status') => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="expiry">Expiry Date</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Licenses Grid */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredLicenses.map((license, index) => {
              const StatusIcon = getStatusIcon(license.status);
              return (
                <motion.div
                  key={license.id}
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
                                {license.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-300 text-sm">
                                {license.type}
                              </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(license.status)} text-xs ml-3 px-2 py-1 flex items-center justify-center`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Issue Date:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{license.issueDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Expiry Date:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{license.expiryDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">License #:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{license.license_number || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Fee:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{license.fee}</span>
                            </div>
                            {license.fee_paid && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-600 dark:text-green-400">Payment Status:</span>
                                <span className="font-medium text-green-600 dark:text-green-400">Paid</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          {license.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                          License Details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* License Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">License Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Type:</span>
                              <p className="text-gray-600 dark:text-gray-300">{license.type}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                              <Badge className={`${getStatusColor(license.status)} text-xs ml-2`}>
                                {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Issue Date:</span>
                              <p className="text-gray-600 dark:text-gray-300">{license.issueDate}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Expiry Date:</span>
                              <p className="text-gray-600 dark:text-gray-300">{license.expiryDate}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">License Number:</span>
                              <p className="text-gray-600 dark:text-gray-300">{license.license_number || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Fee:</span>
                              <p className="text-gray-600 dark:text-gray-300">{license.fee}</p>
                            </div>
                            {license.fee_paid && (
                              <div>
                                <span className="font-medium text-green-600 dark:text-green-400">Payment Status:</span>
                                <p className="text-green-600 dark:text-green-400">Paid</p>
                              </div>
                            )}
                            {license.renewal_required && (
                              <div>
                                <span className="font-medium text-orange-600 dark:text-orange-400">Renewal:</span>
                                <p className="text-orange-600 dark:text-orange-400">Required</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300">{license.description || 'No description provided'}</p>
                        </div>

                        {/* Government Review Information */}
                        {license.review_comment && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Government Review</h4>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">{license.review_comment}</p>
                            {license.reviewed_by && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Reviewed by: {license.reviewed_by.name} ({license.reviewed_by.position})
                              </p>
                            )}
                            {license.review_date && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Review Date: {new Date(license.review_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Attachments */}
                        {license.attachments && license.attachments.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Attachments</h4>
                            <div className="space-y-2">
                              {license.attachments.map((attachment: string, index: number) => (
                                <a
                                  key={index}
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Attachment {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {license.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Documents */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Required Documents</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {license.documents.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button className="bg-[#003153] hover:bg-[#003153]/90">
                            <Edit className="h-4 w-4 mr-2" />
                            Renew License
                          </Button>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Certificate
                          </Button>
                          <Button variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Requirements
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
          {!isLoading && filteredLicenses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Licenses Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No licenses match your current filters.' 
                  : 'You don\'t have any licenses yet.'}
              </p>
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Apply for Your First License
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  );
}
