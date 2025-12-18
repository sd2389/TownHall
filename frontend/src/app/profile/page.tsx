"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, Save, ArrowLeft, Upload, FileText, IdCard, CreditCard, Shield, MapPin, Trash2, Download, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Town {
  id: number;
  name: string;
  state: string;
}

interface UserDocument {
  id: number;
  document_type: string;
  document_type_display: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  description: string;
  uploaded_at: string;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIdType, setSelectedIdType] = useState(user?.role === 'government' ? 'government_id' : 'drivers_license');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    address: "",
    idNumber: "",
    town: "",
  });

  // Fetch towns list
  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/towns/active/`);
        if (response.ok) {
          const data = await response.json();
          setTowns(data);
        }
      } catch (error) {
        console.error('Error fetching towns:', error);
      }
    };
    fetchTowns();
  }, []);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        department: "",
        address: "",
        idNumber: "",
        town: "",
      });
      setSelectedTown(user.town || "");
    }
  }, [user]);

  // Fetch user documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) return;
      
      setIsLoadingDocuments(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/documents/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserDocuments(data);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };
    
    if (token) {
      fetchDocuments();
    }
  }, [token]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !token) return;
    
    const file = files[0]; // Handle one file at a time for now
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', selectedIdType);
      formData.append('description', `Uploaded ${file.name}`);
      
      const response = await fetch(`${API_BASE_URL}/auth/documents/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserDocuments(prev => [data.document, ...prev]);
        toast({
          title: "File Uploaded",
          description: "Your document has been uploaded successfully.",
        });
        // Reset file input
        e.target.value = '';
      } else {
        const error = await response.json();
        toast({
          title: "Upload Failed",
          description: error.error || "Failed to upload file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/documents/${documentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setUserDocuments(prev => prev.filter(doc => doc.id !== documentId));
        toast({
          title: "Document Deleted",
          description: "The document has been deleted successfully.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Delete Failed",
          description: error.error || "Failed to delete document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif'].some(ext => fileType.includes(ext));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to change your password",
        variant: "destructive",
      });
      return;
    }

    // Validation
    if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setIsPasswordDialogOpen(false);
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || data.details?.join(', ') || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "An error occurred while changing your password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getDashboardUrl = () => {
    switch (user?.role) {
      case 'government': return '/government';
      case 'business': return '/business';
      case 'citizen': return '/citizen';
      default: return '/';
    }
  };

  const getDisplayName = () => {
    switch (user?.role) {
      case 'government': return 'Government ID';
      case 'citizen': return 'ID Verification';
      case 'business': return 'Business ID Verification';
      default: return 'ID Documents';
    }
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'citizen': return 'bg-blue-100 text-blue-700';
      case 'business': return 'bg-green-100 text-green-700';
      case 'government': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'citizen': return 'Citizen';
      case 'business': return 'Business Owner';
      case 'government': return 'Government Official';
      default: return 'User';
    }
  };

  const getIDOptions = () => {
    switch (user?.role) {
      case 'government':
        return [
          { value: 'government_id', label: 'Government ID', icon: Shield },
        ];
      case 'citizen':
      case 'business':
        return [
          { value: 'drivers_license', label: "Driver's License", icon: IdCard },
          { value: 'state_id', label: 'State ID', icon: CreditCard },
          { value: 'passport', label: 'Passport', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTownChange = async (newTownId: string) => {
    if (!token || !user) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/towns/change-request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          new_town_id: parseInt(newTownId),
          reason: 'User requested town change from profile'
        }),
      });

      if (response.ok) {
        toast({
          title: "Town Change Request Submitted",
          description: "Your request to change your town has been submitted and is pending approval.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to submit town change request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting town change:', error);
      toast({
        title: "Error",
        description: "Failed to submit town change request",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    // TODO: Implement API call to save profile data
    console.log("Saving profile data:", formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsEditing(false);
    setIsSubmitting(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <ProtectedRoute allowedRoles={['citizen', 'business', 'government']}>
      <Layout showPortalNav={true}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link href={getDashboardUrl()} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Profile & Settings
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">Manage your personal information and account settings</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-semibold text-sm border ${getRoleBadge()}`}>
                  {getRoleName()}
                </div>
              </div>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b pb-6 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-gray-900 dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-md border-2 border-gray-200 dark:border-gray-600">
                        <span className="text-2xl font-bold text-white">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : 'User Profile'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2" />
                          {user?.email || 'email@example.com'}
                        </p>
                      </div>
                    </div>
                    {!isEditing && (
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        variant="outline"
                        className="font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6" style={{ paddingTop: '1.5rem' } as React.CSSProperties}>
                    {/* Personal Information */}
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                        <User className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className={`${!isEditing ? "bg-gray-50" : "bg-white"} pl-10`}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className={`${!isEditing ? "bg-gray-50" : "bg-white"} pl-10`}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                        <Building2 className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                        Address Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address" className="text-sm font-semibold">Street Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50 mt-2" : "mt-2"}
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Current Town
                          </Label>
                          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedTown || "No town assigned"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="town" className="text-sm font-semibold">Change Town</Label>
                          <Select
                            value={formData.town}
                            onValueChange={(value) => {
                              setFormData({ ...formData, town: value });
                              handleTownChange(value);
                            }}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select a new town" />
                            </SelectTrigger>
                            <SelectContent>
                              {towns.map((town) => (
                                <SelectItem key={town.id} value={town.id.toString()}>
                                  {town.name}, {town.state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            Your request will be reviewed by government officials
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ID Verification Section */}
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                        <Shield className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                        {getDisplayName()}
                      </h3>
                      
                      {/* ID Type Selection (for Citizens and Business Owners) */}
                      {user?.role !== 'government' && (
                        <div className="mb-6">
                          <Label className="text-sm font-semibold block mb-3">Select ID Type</Label>
                          <div className="grid grid-cols-3 gap-4">
                            {getIDOptions().map((option) => {
                              const Icon = option.icon;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => setSelectedIdType(option.value)}
                                  className={`flex flex-col items-center p-5 border-2 rounded-lg transition-all duration-300 ${
                                    selectedIdType === option.value
                                      ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700 shadow-sm'
                                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                  }`}
                                >
                                  <Icon className={`h-8 w-8 mb-3 ${
                                    selectedIdType === option.value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
                                  }`} />
                                  <span className={`text-sm font-semibold ${
                                    selectedIdType === option.value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {option.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ID Number Input */}
                      <div className="mb-4">
                        <Label htmlFor="idNumber">ID Number</Label>
                        <Input
                          id="idNumber"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder={user?.role === 'government' 
                            ? 'Enter Government ID Number' 
                            : 'Enter ID Number'}
                        />
                      </div>

                      {/* File Upload */}
                      <div>
                        <Label>Upload ID Document</Label>
                        <div className="mt-2 flex justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <span className="mt-2 text-sm text-purple-600 font-medium hover:text-purple-500">
                                  Upload a file
                                </span>
                              </label>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileUpload}
                                disabled={!isEditing}
                                multiple
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                PNG, JPG, PDF up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Uploaded Documents List */}
                        {isLoadingDocuments ? (
                          <div className="mt-4 text-center py-4">
                            <p className="text-sm text-gray-500">Loading documents...</p>
                          </div>
                        ) : userDocuments.length > 0 ? (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Your Uploaded Documents</h4>
                            <div className="space-y-3">
                              {userDocuments.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    {isImageFile(doc.file_type) ? (
                                      <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    ) : (
                                      <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {doc.file_name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {doc.document_type_display}
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {formatFileSize(doc.file_size)}
                                        </span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {new Date(doc.uploaded_at).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-3">
                                    {doc.file_url && (
                                      <a
                                        href={doc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        title="Download"
                                      >
                                        <Download className="h-4 w-4" />
                                      </a>
                                    )}
                                    {isEditing && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteDocument(doc.id)}
                                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 text-center py-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No documents uploaded yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="font-semibold border-2"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSave} 
                          disabled={isSubmitting}
                          className="bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold border-2 border-gray-900 dark:border-gray-100"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b bg-white dark:bg-gray-800">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Security & Privacy</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Change Password</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update your password to keep your account secure</p>
                      </div>
                      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="border-2">Change</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password and choose a new password
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                              <Label htmlFor="old_password">Current Password</Label>
                              <Input
                                id="old_password"
                                type="password"
                                value={passwordData.old_password}
                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                required
                                className="mt-1"
                                placeholder="Enter current password"
                              />
                            </div>
                            <div>
                              <Label htmlFor="new_password">New Password</Label>
                              <Input
                                id="new_password"
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                required
                                className="mt-1"
                                placeholder="Enter new password"
                                minLength={8}
                              />
                              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                            </div>
                            <div>
                              <Label htmlFor="confirm_password">Confirm New Password</Label>
                              <Input
                                id="confirm_password"
                                type="password"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                required
                                className="mt-1"
                                placeholder="Confirm new password"
                                minLength={8}
                              />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsPasswordDialogOpen(false);
                                  setPasswordData({
                                    old_password: "",
                                    new_password: "",
                                    confirm_password: "",
                                  });
                                }}
                                disabled={isChangingPassword}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={isChangingPassword}
                                className="bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900"
                              >
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
