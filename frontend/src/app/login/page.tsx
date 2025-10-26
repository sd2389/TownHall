"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  LogIn, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Building2, 
  Users, 
  Shield,
  Mail,
  Lock,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

function LoginFormComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!userType) {
      setError("Please select your account type");
      return;
    }

    const success = await login(formData.email, formData.password, userType);
    if (success) {
      // Redirect to appropriate portal based on user type
      const redirectPaths = {
        citizen: '/citizen',
        business: '/business',
        government: '/government'
      };
      router.push(redirectPaths[userType as keyof typeof redirectPaths] || '/');
    } else {
      setError("Invalid credentials or account type mismatch");
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

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="w-full max-w-md">
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

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your TownHall account to continue
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
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="userType">Account Type</Label>
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
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
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

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                        }
                      />
                      <Label htmlFor="rememberMe" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    <LogIn className="mr-2 h-4 w-4" />
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  {/* User Type Indicator */}
                  {userType && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg"
                    >
                      {getUserTypeIcon(userType)}
                      <span className="text-sm font-medium">
                        Signing in as {userType === 'citizen' ? 'Citizen' : 
                                      userType === 'business' ? 'Business Owner' : 
                                      'Government Official'}
                      </span>
                    </motion.div>
                  )}
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary hover:underline font-medium">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Access Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Quick Access</p>
              <div className="flex justify-center gap-4">
                <Link href="/citizen">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Citizen Portal
                  </Button>
                </Link>
                <Link href="/business">
                  <Button variant="outline" size="sm">
                    <Building2 className="h-4 w-4 mr-2" />
                    Business Portal
                  </Button>
                </Link>
                <Link href="/government">
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Government Portal
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

// Disable SSR to prevent hydration issues
const LoginForm = dynamic(() => Promise.resolve(LoginFormComponent), { ssr: false });

export default function LoginPage() {
  return <LoginForm />;
}
