"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, FileText, MapPin, AlertCircle, CheckCircle, Loader2, Upload, X, Image as ImageIcon, File } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { complaintsApi } from "@/lib/api";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const COMPLAINT_CATEGORIES = [
  { value: "infrastructure", label: "Infrastructure" },
  { value: "utilities", label: "Utilities" },
  { value: "public_safety", label: "Public Safety" },
  { value: "environment", label: "Environment" },
  { value: "traffic", label: "Traffic & Parking" },
  { value: "noise", label: "Noise Complaint" },
  { value: "code_enforcement", label: "Code Enforcement" },
  { value: "parks_recreation", label: "Parks & Recreation" },
  { value: "waste_management", label: "Waste Management" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function CreateComplaintPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "medium",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Filter for valid file types (images, PDFs, documents)
      const validFiles = fileArray.filter(file => {
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        const validTypes = [
          'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf',
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ];
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.txt'];
        const hasValidType = validTypes.includes(fileType);
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        return hasValidType || hasValidExtension;
      });
      
      // Limit to 5 files total
      const remainingSlots = 5 - uploadedFiles.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      
      // Check file sizes (max 10MB per file)
      const validSizeFiles = filesToAdd.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          setError(`${file.name} is too large. Maximum file size is 10MB.`);
          return false;
        }
        return true;
      });
      
      setUploadedFiles(prev => [...prev, ...validSizeFiles]);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
      return false;
    }
    if (formData.description.trim().length < 10) {
      setError("Description must be at least 10 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await complaintsApi.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location.trim(),
        priority: formData.priority,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });

      setSuccess(true);
      
      // Redirect to complaints list after 2 seconds
      setTimeout(() => {
        router.push("/citizen/complaints");
      }, 2000);
    } catch (err: any) {
      console.error("Error creating complaint:", err);
      setError(err.message || "Failed to create complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['citizen']}>
      <Layout 
        userType="citizen" 
        userName={`${user?.firstName || ''} ${user?.lastName || ''}`} 
        userEmail={user?.email || ''} 
        showPortalNav={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4 text-[#003153] hover:text-[#003153]/80 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Complaints
              </Button>
              
              <div className="bg-gradient-to-r from-[#003153] to-[#003153]/90 rounded-2xl p-6 shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  File New Complaint
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  Submit a complaint or report an issue to your local government
                </p>
              </div>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#003153]" />
                    Complaint Details
                  </CardTitle>
                  <CardDescription>
                    Please provide as much detail as possible to help us address your concern
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert */}
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                      </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Complaint submitted successfully! Redirecting to your complaints...
                        </p>
                      </div>
                    )}

                    {/* Title */}
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="e.g., Pothole on Main Street"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="border-2 focus:border-[#003153]"
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Brief summary of your complaint (max 200 characters)
                      </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                        required
                      >
                        <SelectTrigger className="border-2 focus:border-[#003153]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPLAINT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-[#003153]" />
                        Location
                      </label>
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        placeholder="e.g., Main St & 5th Ave, or specific address"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="border-2 focus:border-[#003153]"
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Where is this issue located? (optional but recommended)
                      </p>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <label htmlFor="priority" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-[#003153]" />
                        Priority
                      </label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange("priority", value)}
                      >
                        <SelectTrigger className="border-2 focus:border-[#003153]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        How urgent is this issue? (default: Medium)
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Provide detailed information about the issue, including when it started, how it affects you, and any other relevant details..."
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="border-2 focus:border-[#003153] min-h-[150px]"
                        maxLength={2000}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Minimum 10 characters required
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formData.description.length}/2000
                        </p>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <label htmlFor="files" className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <Upload className="h-4 w-4 text-[#003153]" />
                        Attach Files (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-[#003153] transition-colors">
                        <input
                          type="file"
                          id="files"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={uploadedFiles.length >= 5}
                        />
                        <label
                          htmlFor="files"
                          className={`cursor-pointer ${uploadedFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Images, PDFs, Documents (Max 5 files, 10MB each)
                          </p>
                        </label>
                      </div>
                      
                      {/* Uploaded Files Preview */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Uploaded Files ({uploadedFiles.length}/5):
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                              >
                                {isImageFile(file) ? (
                                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    <File className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                                >
                                  <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#003153] hover:bg-[#003153]/90 text-white"
                        disabled={isSubmitting || success}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Submit Complaint
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

