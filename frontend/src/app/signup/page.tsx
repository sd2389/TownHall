"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
  const [availableDepartments, setAvailableDepartments] = useState<any[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [availablePositions, setAvailablePositions] = useState<any[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data has been loaded from localStorage
  const isDataLoadedRef = useRef(false); // Use ref for immediate checks
  
  // Use refs to store latest values for localStorage saving
  const formDataRef = useRef(formData);
  const userTypeRef = useRef(userType);
  const currentStepRef = useRef(currentStep);
  const selectedIdTypeRef = useRef(selectedIdType);
  
  // Update refs when state changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);
  
  useEffect(() => {
    userTypeRef.current = userType;
  }, [userType]);
  
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  
  useEffect(() => {
    selectedIdTypeRef.current = selectedIdType;
  }, [selectedIdType]);

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
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      // Save to localStorage after state update (only if data is loaded)
      if (isDataLoaded) {
        setTimeout(() => saveToLocalStorage(), 0);
      }
      return updated;
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        agreeToTerms: checked
      };
      // Save to localStorage after state update (only if data is loaded)
      if (isDataLoaded) {
        setTimeout(() => saveToLocalStorage(), 0);
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      // Save to localStorage after state update (only if data is loaded)
      if (isDataLoaded) {
        setTimeout(() => saveToLocalStorage(), 0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Save to localStorage after state update (only if data is loaded)
      if (isDataLoaded) {
        setTimeout(() => saveToLocalStorage(), 0);
      }
    }
  };

  const { signup, isLoading } = useAuth();
  const router = useRouter();

  // localStorage key
  const STORAGE_KEY = 'townhall_signup_data';
  const STORAGE_TIMESTAMP_KEY = 'townhall_signup_timestamp';
  const STORAGE_EXPIRY_HOURS = 1; // 1 hour expiry

  // Check if localStorage data is expired
  const isStorageExpired = (): boolean => {
    if (typeof window === 'undefined') return true;
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    if (!timestamp) return true;
    
    const savedTime = parseInt(timestamp, 10);
    const currentTime = Date.now();
    const hoursElapsed = (currentTime - savedTime) / (1000 * 60 * 60);
    
    return hoursElapsed >= STORAGE_EXPIRY_HOURS;
  };

  // Save form data to localStorage
  const saveToLocalStorage = () => {
    if (typeof window === 'undefined') return;
    
    // Don't save if data hasn't been loaded yet (to prevent overwriting with empty data)
    // Use ref for immediate check to avoid race conditions
    if (!isDataLoadedRef.current) {
      console.log('Skipping save - data not loaded yet');
      return;
    }
    
    try {
      // Use refs to get the latest values
      const dataToSave = {
        formData: formDataRef.current,
        userType: userTypeRef.current,
        currentStep: currentStepRef.current,
        selectedIdType: selectedIdTypeRef.current,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
      console.log('Saved to localStorage:', { 
        userType: userTypeRef.current, 
        currentStep: currentStepRef.current, 
        hasFormData: !!formDataRef.current.email 
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load form data from localStorage
  const loadFromLocalStorage = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check if data is expired
      if (isStorageExpired()) {
        console.log('localStorage data expired, clearing...');
        clearLocalStorage();
        isDataLoadedRef.current = true; // Mark as loaded even if expired
        setIsDataLoaded(true);
        return false;
      }

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) {
        console.log('No saved data in localStorage');
        isDataLoadedRef.current = true; // Mark as loaded even if no data
        setIsDataLoaded(true);
        return false;
      }

      const parsed = JSON.parse(savedData);
      console.log('Loading from localStorage:', { 
        hasFormData: !!parsed.formData, 
        userType: parsed.userType, 
        currentStep: parsed.currentStep 
      });
      
      // Update refs first to ensure they have the latest values
      if (parsed.formData) {
        formDataRef.current = parsed.formData;
        setFormData(parsed.formData); // Replace entirely instead of merging
      }
      if (parsed.userType) {
        userTypeRef.current = parsed.userType;
        setUserType(parsed.userType);
      }
      if (parsed.currentStep) {
        currentStepRef.current = parsed.currentStep;
        setCurrentStep(parsed.currentStep);
      }
      if (parsed.selectedIdType) {
        selectedIdTypeRef.current = parsed.selectedIdType;
        setSelectedIdType(parsed.selectedIdType);
      }
      
      // Mark as loaded AFTER updating state and refs (use ref for immediate effect)
      isDataLoadedRef.current = true;
      setIsDataLoaded(true);
      
      return true;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      clearLocalStorage();
      isDataLoadedRef.current = true; // Mark as loaded even on error
      setIsDataLoaded(true);
      return false;
    }
  };

  // Clear localStorage
  const clearLocalStorage = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load saved data after mount (with delay to avoid hydration mismatch)
  useEffect(() => {
    if (isMounted) {
      // Use setTimeout to ensure this runs after initial render
      const timer = setTimeout(() => {
        loadFromLocalStorage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);
  
  // Save to localStorage when userType changes (only after data is loaded)
  useEffect(() => {
    if (!isMounted || !isDataLoaded || !userType) return;
    saveToLocalStorage();
  }, [userType, isMounted, isDataLoaded]);

  // Save to localStorage when selectedIdType changes (only after data is loaded)
  useEffect(() => {
    if (!isMounted || !isDataLoaded || !selectedIdType) return;
    saveToLocalStorage();
  }, [selectedIdType, isMounted, isDataLoaded]);

  // Save to localStorage when formData changes (debounced, only after data is loaded)
  useEffect(() => {
    if (!isMounted || !isDataLoaded) return;
    
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 500); // Debounce by 500ms
    
    return () => clearTimeout(timeoutId);
  }, [formData, isMounted, isDataLoaded]);

  // Save to localStorage when currentStep changes (only after data is loaded)
  useEffect(() => {
    if (!isMounted || !isDataLoaded) return;
    saveToLocalStorage();
  }, [currentStep, isMounted, isDataLoaded]);

  // Periodic check to clear expired localStorage data (every 5 minutes)
  useEffect(() => {
    if (!isMounted) return;

    const checkExpiry = () => {
      if (isStorageExpired()) {
        clearLocalStorage();
      }
    };

    // Check immediately
    checkExpiry();

    // Check every 5 minutes
    const intervalId = setInterval(checkExpiry, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isMounted]);

  // Fetch active towns
  useEffect(() => {
    if (!isMounted || !userType) return;

    const fetchTowns = async () => {
      setIsLoadingTowns(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const url = `${apiUrl}/towns/active/`;
        console.log('Fetching towns from:', url); // Debug log
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        console.log('Towns API response status:', response.status); // Debug log
        
        if (response.ok) {
          const towns = await response.json();
          console.log('Fetched towns successfully:', towns); // Debug log
          
          if (Array.isArray(towns) && towns.length > 0) {
            setAvailableTowns(towns);
            console.log(`Loaded ${towns.length} towns into dropdown`); // Debug log
          } else {
            console.warn('Towns array is empty or invalid:', towns);
            setAvailableTowns([]);
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch towns:', response.status, response.statusText, errorText);
          setAvailableTowns([]);
        }
      } catch (error: any) {
        console.error('Error fetching towns:', error);
        console.error('Error details:', {
          message: error?.message,
          name: error?.name,
          stack: error?.stack
        });
        setAvailableTowns([]);
      } finally {
        setIsLoadingTowns(false);
      }
    };
    
    // Add a small delay to ensure backend is ready
    const timer = setTimeout(() => {
      fetchTowns();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isMounted, userType]);

  // Fetch departments for government users
  useEffect(() => {
    if (!isMounted || userType !== 'government') return;

    const fetchDepartments = async () => {
      setIsLoadingDepartments(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/government/departments/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (response.ok) {
          const departments = await response.json();
          console.log('Fetched departments:', departments);
          setAvailableDepartments(Array.isArray(departments) ? departments : []);
        } else {
          console.warn('Failed to fetch departments:', response.status, response.statusText);
          setAvailableDepartments([]);
        }
      } catch (error) {
        console.warn('Error fetching departments (backend may not be running):', error);
        setAvailableDepartments([]);
      } finally {
        setIsLoadingDepartments(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchDepartments();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isMounted, userType]);

  // Fetch positions when department is selected
  useEffect(() => {
    if (!isMounted || userType !== 'government' || !formData.department) {
      setAvailablePositions([]);
      return;
    }

    const fetchPositions = async () => {
      // Find the department ID from the department name
      const selectedDept = availableDepartments.find(dept => dept.name === formData.department);
      if (!selectedDept) {
        setAvailablePositions([]);
        return;
      }

      setIsLoadingPositions(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/government/positions/?department_id=${selectedDept.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (response.ok) {
          const positions = await response.json();
          console.log('Fetched positions:', positions);
          setAvailablePositions(Array.isArray(positions) ? positions : []);
        } else {
          console.warn('Failed to fetch positions:', response.status, response.statusText);
          setAvailablePositions([]);
        }
      } catch (error) {
        console.warn('Error fetching positions:', error);
        setAvailablePositions([]);
      } finally {
        setIsLoadingPositions(false);
      }
    };
    
    const timer = setTimeout(() => {
      fetchPositions();
    }, 300); // Debounce to avoid too many calls
    
    return () => clearTimeout(timer);
  }, [isMounted, userType, formData.department, availableDepartments]);

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

    // Validate required fields before submission
    if (!formData.townId) {
      setError("Please select a town");
      return;
    }

    const townIdInt = parseInt(formData.townId, 10);
    if (isNaN(townIdInt)) {
      setError("Invalid town selected. Please select a town again.");
      return;
    }

    if (userType === 'government') {
      if (!formData.employeeId) {
        setError("Employee ID is required for government accounts");
        return;
      }
      if (!formData.department) {
        setError("Please select a department");
        return;
      }
      if (!formData.position) {
        setError("Please select a position");
        return;
      }
    }

    if (userType === 'business' && !formData.businessName) {
      setError("Business name is required");
      return;
    }

    const signupData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      userType: userType,
      phone: formData.phone || '',
      townId: townIdInt, // Ensure townId is an integer
      // Structured address fields
      streetAddress: formData.streetAddress || '',
      aptSuite: formData.aptSuite || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      // Citizen specific
      address: formData.address || '',
      dateOfBirth: formData.dateOfBirth || null,
      // Business specific
      businessName: formData.businessName || '',
      businessType: formData.businessType || '',
      businessAddress: formData.businessAddress || '',
      businessRegistrationNumber: formData.businessRegistrationNumber || '',
      website: formData.website || '',
      // Government specific
      employeeId: formData.employeeId || '',
      department: formData.department || '',
      position: formData.position || '',
      officeAddress: formData.officeAddress || '',
    };

    console.log('Submitting signup data:', { ...signupData, password: '***' }); // Debug log

    try {
      const result: { success: boolean; error?: string; details?: any } = await signup(signupData);
      if (result.success) {
        // Clear localStorage on successful signup
        clearLocalStorage();
        
        // Redirect to appropriate portal based on user type
        const redirectPaths = {
          citizen: '/citizen',
          business: '/business',
          government: '/government'
        };
        router.push(redirectPaths[userType as keyof typeof redirectPaths] || '/');
      } else {
        // Format validation errors for display
        if (result.details) {
          const errorMessages = Object.entries(result.details)
            .map(([field, errors]: [string, any]) => {
              const errorList = Array.isArray(errors) ? errors : [errors];
              const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return `${fieldName}: ${errorList.join(', ')}`;
            })
            .join('\n');
          setError(errorMessages || "Please check all required fields and try again.");
        } else {
          setError(result.error || "Failed to create account. Please check all required fields and try again.");
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || "Failed to create account. Please try again.");
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
                <Select value={userType} onValueChange={(value) => {
                  setUserType(value);
                  if (isDataLoaded) {
                    setTimeout(() => saveToLocalStorage(), 0);
                  }
                }}>
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
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    suppressHydrationWarning
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
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    suppressHydrationWarning
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
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  suppressHydrationWarning
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
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="pl-10"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Town Selection */}
            {userType && (
              <div className="space-y-2">
                <Label htmlFor="townId">Select Your Town *</Label>
                {isLoadingTowns ? (
                  <div className="text-sm text-muted-foreground">Loading towns...</div>
                ) : availableTowns.length === 0 ? (
                  <div className="text-sm text-amber-600 dark:text-amber-400">
                    No towns available. Please ensure the backend is running and towns are configured.
                  </div>
                ) : (
                  <Select 
                    value={formData.townId || ''} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, townId: value }));
                    if (isDataLoaded) {
                      setTimeout(() => saveToLocalStorage(), 0);
                    }
                  }}
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
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="employeeId"
                      name="employeeId"
                      placeholder="Enter your employee ID"
                      value={formData.employeeId || ''}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your unique employee identification number
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  {isLoadingDepartments ? (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      Loading departments...
                    </div>
                  ) : availableDepartments.length === 0 ? (
                    <div className="text-sm text-amber-600 dark:text-amber-400 p-3 border border-amber-200 dark:border-amber-800 rounded-md bg-amber-50 dark:bg-amber-950">
                      No departments available. Please contact an administrator to create departments.
                    </div>
                  ) : (
                    <Select 
                      value={formData.department || ''} 
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, department: value, position: '' })); // Clear position when department changes
                        if (isDataLoaded) {
                          setTimeout(() => saveToLocalStorage(), 0);
                        }
                      }}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDepartments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the department you work in
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  {!formData.department ? (
                    <div className="text-sm text-muted-foreground p-3 border border-gray-200 dark:border-gray-800 rounded-md bg-muted/30">
                      Please select a department first to view available positions
                    </div>
                  ) : isLoadingPositions ? (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      Loading positions...
                    </div>
                  ) : availablePositions.length === 0 ? (
                    <div className="text-sm text-amber-600 dark:text-amber-400 p-3 border border-amber-200 dark:border-amber-800 rounded-md bg-amber-50 dark:bg-amber-950">
                      No positions available for this department. Please contact an administrator.
                    </div>
                  ) : (
                    <Select 
                      value={formData.position || ''} 
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, position: value }));
                        if (isDataLoaded) {
                          setTimeout(() => saveToLocalStorage(), 0);
                        }
                      }}
                      required
                      disabled={!formData.department}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your position" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePositions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.name}>
                            {pos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Select your job title or position within the department
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeAddress">Office Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="officeAddress"
                      name="officeAddress"
                      placeholder="Enter your office address"
                      value={formData.officeAddress || ''}
                      onChange={handleInputChange}
                      className="pl-10 min-h-[100px]"
                      suppressHydrationWarning
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the complete address of your office location
                  </p>
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
                        onClick={() => {
                          setSelectedIdType(option.value);
                          if (isDataLoaded) {
                            setTimeout(() => saveToLocalStorage(), 0);
                          }
                        }}
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 px-4 sm:px-6">
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
            <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
              <CardHeader className="text-center pb-6 pt-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <UserPlus className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </motion.div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</CardTitle>
                <CardDescription className="text-sm sm:text-base mt-2">
                  Join TownHall and start making a difference in your community
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-300 shadow-sm"
                  >
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
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

                <form onSubmit={handleSubmit} suppressHydrationWarning>
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
                      <Button 
                        type="submit" 
                        className="ml-auto h-12 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                        disabled={!formData.agreeToTerms || isLoading || uploadedFiles.length === 0}
                      >
                        <UserPlus className="mr-2 h-5 w-5" />
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
