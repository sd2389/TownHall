"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Phone, Building2, Save, ArrowLeft, Upload, FileText, IdCard, CreditCard, Shield } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIdType, setSelectedIdType] = useState(user?.role === 'government' ? 'government' : 'drivers_license');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    address: "",
    idNumber: "",
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: "",
        department: "",
        address: "",
        idNumber: "",
      });
    }
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
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

  const getIDOptions = () => {
    switch (user?.role) {
      case 'government':
        return [
          { value: 'government', label: 'Government ID', icon: Shield },
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

  const handleSave = () => {
    // TODO: Implement API call to save profile data
    console.log("Saving profile data:", formData);
    setIsEditing(false);
  };

  return (
    <ProtectedRoute allowedRoles={['citizen', 'business', 'government']}>
      <Layout showPortalNav={false}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link href="/government" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Profile & Settings
              </h1>
              <p className="text-gray-600 text-lg">Manage your personal information and account settings</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-2xl font-bold text-white">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">
                            {user?.firstName && user?.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : 'User Profile'}
                          </h2>
                          <p className="text-gray-600">{user?.email || 'email@example.com'}</p>
                        </div>
                      </CardTitle>
                    </div>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-purple-600" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                        Address
                      </h3>
                      <div>
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>

                    {/* ID Verification Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-purple-600" />
                        {getDisplayName()}
                      </h3>
                      
                      {/* ID Type Selection (for Citizens and Business Owners) */}
                      {user?.role !== 'government' && (
                        <div className="mb-4">
                          <Label>ID Type</Label>
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            {getIDOptions().map((option) => {
                              const Icon = option.icon;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => setSelectedIdType(option.value)}
                                  className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                                    selectedIdType === option.value
                                      ? 'border-purple-600 bg-purple-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <Icon className={`h-6 w-6 mb-2 ${
                                    selectedIdType === option.value ? 'text-purple-600' : 'text-gray-400'
                                  }`} />
                                  <span className={`text-sm ${
                                    selectedIdType === option.value ? 'font-medium text-gray-900' : 'text-gray-600'
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

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Files</h4>
                            <ul className="space-y-2">
                              {uploadedFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-900">{file}</span>
                                  </div>
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                                      className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
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
              <Card>
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Enable</Button>
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
