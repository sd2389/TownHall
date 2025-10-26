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
import React, { useState } from "react";

export default function BusinessLicenses() {
  const [selectedLicense, setSelectedLicense] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'expiry' | 'status'>('name');

  const licenses = [
    {
      id: 1,
      name: "Business License - Priya's Café",
      type: "General Business License",
      status: "active",
      issueDate: "2024-01-15",
      expiryDate: "2025-01-15",
      fee: "$150",
      description: "Primary business license for food service operations",
      requirements: ["Health Certificate", "Fire Safety Certificate", "Insurance Proof"],
      documents: ["Business Registration", "Tax Certificate", "Insurance Policy"]
    },
    {
      id: 2,
      name: "Food Service License",
      type: "Health Department License",
      status: "active",
      issueDate: "2024-01-20",
      expiryDate: "2024-07-20",
      fee: "$75",
      description: "License for food preparation and service",
      requirements: ["Food Handler Certificate", "Kitchen Inspection", "Health Department Approval"],
      documents: ["Food Handler Certificate", "Kitchen Inspection Report", "Health Certificate"]
    },
    {
      id: 3,
      name: "Liquor License",
      type: "Alcohol Service License",
      status: "pending",
      issueDate: "2024-02-01",
      expiryDate: "2025-02-01",
      fee: "$300",
      description: "License for serving alcoholic beverages",
      requirements: ["Background Check", "Training Certificate", "Insurance Coverage"],
      documents: ["Background Check Report", "Training Certificate", "Insurance Policy"]
    },
    {
      id: 4,
      name: "Outdoor Seating License",
      type: "Special Use License",
      status: "expired",
      issueDate: "2023-06-01",
      expiryDate: "2024-01-01",
      fee: "$100",
      description: "License for outdoor dining area",
      requirements: ["Site Plan Approval", "Neighbor Consent", "Safety Inspection"],
      documents: ["Site Plan", "Neighbor Consent Forms", "Safety Inspection Report"]
    }
  ];

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
    <Layout userType="business" userName="Priya Singh" userEmail="priya.singh@email.com" showPortalNav={true}>
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
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Apply for New License
              </Button>
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
                              <span className="text-gray-500 dark:text-gray-400">Fee:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{license.fee}</span>
                            </div>
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
                              <span className="font-medium text-gray-900 dark:text-white">Fee:</span>
                              <p className="text-gray-600 dark:text-gray-300">{license.fee}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300">{license.description}</p>
                        </div>

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

          {/* Empty State */}
          {filteredLicenses.length === 0 && (
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
  );
}
