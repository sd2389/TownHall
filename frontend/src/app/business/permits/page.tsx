"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Clipboard, 
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
  SortDesc,
  MapPin,
  Users,
  Shield
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import React, { useState } from "react";

export default function BusinessPermits() {
  const [selectedPermit, setSelectedPermit] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');

  const permits = [
    {
      id: 1,
      name: "Outdoor Seating Permit",
      type: "Special Use Permit",
      status: "approved",
      applicationDate: "2024-01-15",
      approvalDate: "2024-01-22",
      expiryDate: "2024-12-31",
      fee: "$75",
      description: "Permit for outdoor dining area with 20 seats",
      location: "123 Main Street, Downtown",
      requirements: ["Site Plan", "Safety Certificate", "Neighbor Consent", "Insurance Coverage"],
      documents: ["Site Plan Drawing", "Safety Inspection Report", "Neighbor Consent Forms", "Insurance Policy"],
      conditions: ["Maximum 20 seats", "Noise restrictions after 10 PM", "Regular safety inspections"]
    },
    {
      id: 2,
      name: "Signage Permit",
      type: "Advertising Permit",
      status: "pending",
      applicationDate: "2024-02-01",
      approvalDate: null,
      expiryDate: "2025-02-01",
      fee: "$50",
      description: "Permit for illuminated business sign",
      location: "123 Main Street, Downtown",
      requirements: ["Sign Design", "Electrical Certificate", "Property Owner Consent"],
      documents: ["Sign Design Drawing", "Electrical Certificate", "Property Consent Form"],
      conditions: ["Maximum 4ft x 8ft size", "No flashing lights", "Compliance with zoning"]
    },
    {
      id: 3,
      name: "Event Permit - Community Festival",
      type: "Special Event Permit",
      status: "rejected",
      applicationDate: "2024-01-10",
      approvalDate: null,
      expiryDate: null,
      fee: "$200",
      description: "Permit for annual community festival",
      location: "Downtown Plaza",
      requirements: ["Event Plan", "Security Arrangements", "Insurance", "Traffic Management"],
      documents: ["Event Plan", "Security Contract", "Insurance Policy", "Traffic Plan"],
      conditions: ["Maximum 500 attendees", "Security required", "Cleanup within 24 hours"]
    },
    {
      id: 4,
      name: "Parking Permit",
      type: "Parking Permit",
      status: "expired",
      applicationDate: "2023-06-01",
      approvalDate: "2023-06-05",
      expiryDate: "2024-01-01",
      fee: "$100",
      description: "Permit for employee parking spaces",
      location: "Municipal Parking Lot B",
      requirements: ["Business Registration", "Employee List", "Parking Agreement"],
      documents: ["Business Registration", "Employee Roster", "Parking Agreement"],
      conditions: ["5 spaces maximum", "Employee use only", "Annual renewal required"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
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
      case "rejected":
        return XCircle;
      case "expired":
        return AlertTriangle;
      default:
        return AlertCircle;
    }
  };

  const filteredPermits = permits.filter(permit => {
    const matchesSearch = permit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || permit.status === filterStatus;
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Business Permits</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your business permits and special use authorizations</p>
              </div>
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Apply for New Permit
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
                        placeholder="Search permits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'approved' | 'pending' | 'rejected' | 'expired') => setFilterStatus(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'status') => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Permits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPermits.map((permit, index) => {
              const StatusIcon = getStatusIcon(permit.status);
              return (
                <motion.div
                  key={permit.id}
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
                                {permit.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-300 text-sm">
                                {permit.type}
                              </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(permit.status)} text-xs ml-3 px-2 py-1 flex items-center justify-center`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {permit.status.charAt(0).toUpperCase() + permit.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Application Date:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{permit.applicationDate}</span>
                            </div>
                            {permit.approvalDate && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Approval Date:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{permit.approvalDate}</span>
                              </div>
                            )}
                            {permit.expiryDate && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Expiry Date:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{permit.expiryDate}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Fee:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{permit.fee}</span>
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
                          {permit.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                          Permit Details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Permit Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Permit Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Type:</span>
                              <p className="text-gray-600 dark:text-gray-300">{permit.type}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                              <Badge className={`${getStatusColor(permit.status)} text-xs ml-2`}>
                                {permit.status.charAt(0).toUpperCase() + permit.status.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Application Date:</span>
                              <p className="text-gray-600 dark:text-gray-300">{permit.applicationDate}</p>
                            </div>
                            {permit.approvalDate && (
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">Approval Date:</span>
                                <p className="text-gray-600 dark:text-gray-300">{permit.approvalDate}</p>
                              </div>
                            )}
                            {permit.expiryDate && (
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">Expiry Date:</span>
                                <p className="text-gray-600 dark:text-gray-300">{permit.expiryDate}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Fee:</span>
                              <p className="text-gray-600 dark:text-gray-300">{permit.fee}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description and Location */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{permit.description}</p>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <MapPin className="h-4 w-4 mr-2" />
                            {permit.location}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {permit.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Documents */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Required Documents</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {permit.documents.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Conditions */}
                        {permit.conditions && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Permit Conditions</h4>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                              {permit.conditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {permit.status === 'approved' && (
                            <Button className="bg-[#003153] hover:bg-[#003153]/90">
                              <Download className="h-4 w-4 mr-2" />
                              Download Permit
                            </Button>
                          )}
                          {permit.status === 'pending' && (
                            <Button variant="outline">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Application
                            </Button>
                          )}
                          {permit.status === 'rejected' && (
                            <Button className="bg-[#003153] hover:bg-[#003153]/90">
                              <Plus className="h-4 w-4 mr-2" />
                              Reapply
                            </Button>
                          )}
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
          {filteredPermits.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <Clipboard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Permits Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No permits match your current filters.' 
                  : 'You don\'t have any permits yet.'}
              </p>
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Apply for Your First Permit
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
