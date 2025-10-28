"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function FileNewComplaintPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'infrastructure',
    location: '',
    description: ''
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Filter for image files only
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
      
      // Limit to 5 images
      const remainingSlots = 5 - uploadedImages.length;
      const filesToAdd = imageFiles.slice(0, remainingSlots);
      
      setUploadedImages(prev => [...prev, ...filesToAdd]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission with images
    console.log('Form Data:', formData);
    console.log('Uploaded Images:', uploadedImages);
    alert('Complaint submitted successfully!');
  };

  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">File New Complaint</CardTitle>
              <CardDescription>Provide details below to submit a new complaint</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Brief title for your complaint" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="safety">Public Safety</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Street, Area" 
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[140px]" 
                      placeholder="Describe the issue with as much detail as possible" 
                      required
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Attach Images (Optional)
                    <span className="text-xs text-gray-500 font-normal">(Max 5 images)</span>
                  </label>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-[#003153] transition-colors">
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Upload className="h-10 w-10 text-gray-400" />
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Click to upload or drag and drop
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </div>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadedImages.length >= 5}
                      />
                    </label>
                  </div>

                  {/* Preview Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-[#003153] hover:bg-[#003153]/90">
                    Submit Complaint
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
