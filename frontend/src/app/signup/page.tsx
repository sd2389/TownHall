"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Building2, 
  Users, 
  Shield,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
  IdCard,
  CreditCard,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [selectedIdType, setSelectedIdType] = useState("drivers_license");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    townId: "",
    
    // Address fields (structured)
    streetAddress: "",
    aptSuite: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Citizen specific
    address: "",
    dateOfBirth: "",
    
    // Business specific
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessRegistrationNumber: "",
    website: "",
    
    // Government specific
    employeeId: "",
    department: "",
    position: "",
    officeAddress: "",
    
    // ID Verification
    idNumber: "",
  });
  
  const [availableTowns, setAvailableTowns] = useState<any[]>([]);
  const [isLoadingTowns, setIsLoadingTowns] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const getIDOptions = () => {
    switch (userType) {
      case "government":
        return [{ value: 'government', label: 'Government ID', icon: Shield }];
      case "citizen":
      case "business":
        return [
          { value: 'drivers_license', label: "Driver's License", icon: IdCard },
          { value: 'state_id', label: 'State ID', icon: CreditCard },
          { value: 'passport', label: 'Passport', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { signup, isLoading } = useAuth();
  const router = useRouter();

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Fetch active towns
  useEffect(() => {
    const fetchTowns = async () => {
      setIsLoadingTowns(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/towns/active/`);
        if (response.ok) {
          const towns = await response.json();
          setAvailableTowns(towns);
        }
      } catch (error) {
        console.error('Error fetching towns:', error);
      } finally {
        setIsLoadingTowns(false);
      }
    };
    
    if (isMounted && userType) {
      fetchTowns();
    }
  }, [isMounted, userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    const signupData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      userType: userType,
      phone: formData.phone,
      townId: formData.townId,
      // Structured address fields
      streetAddress: formData.streetAddress,
      aptSuite: formData.aptSuite,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      // Citizen specific
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      // Business specific
      businessName: formData.businessName,
      businessType: formData.businessType,
      businessAddress: formData.businessAddress,
      businessRegistrationNumber: formData.businessRegistrationNumber,
      website: formData.website,
      // Government specific
      employeeId: formData.employeeId,
      department: formData.department,
      position: formData.position,
      officeAddress: formData.officeAddress,
    };

    const success = await signup(signupData);
    if (success) {
      // Redirect to appropriate portal based on user type
      const redirectPaths = {
        citizen: '/citizen',
        business: '/business',
        government: '/government'
      };
      router.push(redirectPaths[userType as keyof typeof redirectPaths] || '/');
    } else {
      setError("Failed to create account. Please try again.");
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "citizen":
        return <Users className="h-5 w-5" />;
      case "business":
        return <Building2 className="h-5 w-5" />;
      case "government":
        return <Shield className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "citizen":
        return "bg-blue-100 text-blue-800";
      case "business":
        return "bg-green-100 text-green-800";
      case "government":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="userType">Account Type *</Label>
              {isMounted ? (
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizen">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Citizen
                      </div>
                    </SelectItem>
                    <SelectItem value="business">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Business Owner
                      </div>
                    </SelectItem>
                    <SelectItem value="government">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Government Official
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="text-muted-foreground">Select your account type</span>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Town Selection */}
            {userType && (
              <div className="space-y-2">
                <Label htmlFor="townId">Select Your Town *</Label>
                {isLoadingTowns ? (
                  <div className="text-sm text-muted-foreground">Loading towns...</div>
                ) : (
                  <Select 
                    value={formData.townId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, townId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your town" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTowns.map((town) => (
                        <SelectItem key={town.id} value={town.id.toString()}>
                          {town.name}, {town.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* User Type Specific Fields */}
            {userType === "citizen" && (
              <>
                {/* Structured Address */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-sm">Billing Address</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        placeholder="Street address"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aptSuite">Apt/Suite/Unit</Label>
                    <Input
                      id="aptSuite"
                      name="aptSuite"
                      placeholder="Apt, suite, unit, etc."
                      value={formData.aptSuite}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address (Legacy)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {userType === "business" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      name="businessName"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    name="businessType"
                    placeholder="e.g., Restaurant, Retail, Service"
                    value={formData.businessType}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Business Billing Address */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-sm">Billing Address</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        placeholder="Street address"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aptSuite">Apt/Suite/Unit</Label>
                    <Input
                      id="aptSuite"
                      name="aptSuite"
                      placeholder="Apt, suite, unit, etc."
                      value={formData.aptSuite}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="businessAddress"
                      name="businessAddress"
                      placeholder="Enter your business address"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                  <Input
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    placeholder="Enter registration number"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://your-website.com"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {userType === "government" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    placeholder="Enter your employee ID"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Enter your position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeAddress">Office Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="officeAddress"
                      name="officeAddress"
                      placeholder="Enter your office address"
                      value={formData.officeAddress}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center">
              <Shield className="h-6 w-6 mr-2 text-purple-600" />
              ID Verification
            </h3>
            
            {/* ID Type Selection (for Citizens and Business Owners) */}
            {userType !== "government" && (
              <div>
                <Label className="mb-2 block">ID Type</Label>
                <div className="grid grid-cols-3 gap-3">
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
            <div>
              <Label htmlFor="idNumber">
                {userType === 'government' ? 'Government ID Number *' : 'ID Number *'}
              </Label>
              <Input
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder={userType === 'government' 
                  ? 'Enter Government ID Number' 
                  : 'Enter ID Number'}
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <Label>Upload ID Document *</Label>
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
                  <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Review Your Information</h3>
              <p className="text-muted-foreground mb-6">
                Please review your information before creating your account
              </p>
            </div>

            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {getUserTypeIcon(userType)}
                <span className="font-medium">
                  {userType === 'citizen' ? 'Citizen' : 
                   userType === 'business' ? 'Business Owner' : 
                   'Government Official'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{formData.email}</p>
                </div>
                {formData.idNumber && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">ID Number:</span>
                    <p className="font-medium">{formData.idNumber}</p>
                  </div>
                )}
                {uploadedFiles.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Documents:</span>
                    <p className="font-medium">{uploadedFiles.length} file(s) uploaded</p>
                  </div>
                )}
                {userType === "business" && formData.businessName && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Business:</span>
                    <p className="font-medium">{formData.businessName}</p>
                  </div>
                )}
                {userType === "government" && formData.department && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Department:</span>
                    <p className="font-medium">{formData.department}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Signup Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
                <CardDescription>
                  Join TownHall and start making a difference in your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-700"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}
                
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`w-16 h-1 mx-2 ${
                            step < currentStep ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  {renderStepContent()}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <Button type="button" variant="outline" onClick={handlePrevious}>
                        Previous
                      </Button>
                    )}
                    {currentStep < 4 ? (
                      <Button type="button" onClick={handleNext} className="ml-auto">
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" className="ml-auto" disabled={!formData.agreeToTerms || isLoading || uploadedFiles.length === 0}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    )}
                  </div>
                </form>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
