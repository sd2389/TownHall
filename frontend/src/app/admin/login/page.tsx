"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  // Check if API URL is accessible on mount
  useEffect(() => {
    // Test API connection
    const testConnection = async () => {
      setBackendStatus('checking');
      try {
        // Try a simple GET request to check if server is up
        const testUrl = API_BASE_URL.replace('/api', '') || 'http://localhost:8000';
        const testResponse = await fetch(`${testUrl}/admin/`, {
          method: 'GET',
          mode: 'no-cors', // This won't throw on CORS errors, just check if server responds
        });
        setBackendStatus('online');
        console.log('Backend server is reachable');
      } catch (err: any) {
        // Try the actual API endpoint
        try {
          const apiTest = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
            method: 'OPTIONS',
          });
          if (apiTest.status === 200 || apiTest.status === 405) {
            setBackendStatus('online');
            console.log('Backend API is reachable');
          } else {
            setBackendStatus('offline');
          }
        } catch (apiErr) {
          setBackendStatus('offline');
          console.warn('Backend API may not be running. Please ensure the Django server is running on port 8000.');
          console.warn('Error details:', apiErr);
        }
      }
    };
    
    // Only test if we're in the browser
    if (typeof window !== 'undefined') {
      // Delay the test slightly to avoid race conditions
      const timer = setTimeout(() => {
        testConnection();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [API_BASE_URL]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Authenticate with Django admin
      let response;
      try {
        const url = `${API_BASE_URL}/auth/admin-login/`;
        console.log('Attempting to connect to:', url);
        console.log('Current origin:', typeof window !== 'undefined' ? window.location.origin : 'server-side');
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Remove credentials for now to avoid CORS issues
          // credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        
        console.log('Response status:', response.status, response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      } catch (fetchError: any) {
        // Handle network errors (connection refused, CORS, etc.)
        console.error('Network error details:', {
          name: fetchError.name,
          message: fetchError.message,
          stack: fetchError.stack,
          url: `${API_BASE_URL}/auth/admin-login/`
        });
        
        // More specific error messages
        if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
          throw new Error(`Cannot connect to the server at ${API_BASE_URL}. Please ensure:
1. The Django backend is running: python manage.py runserver
2. The backend is accessible at http://localhost:8000
3. CORS is properly configured in settings.py`);
        }
        
        if (fetchError.message) {
          throw new Error(`Network error: ${fetchError.message}`);
        }
        
        throw new Error('Network error. Please check your connection and ensure the backend server is running on http://localhost:8000');
      }

      // Check if response is ok before parsing JSON
      let data;
      try {
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server.');
        }
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Invalid response from server. Please check if the backend is running and accessible.');
      }

      if (response.ok) {
        // Store admin session info
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        if (data.user) {
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        }
        
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      
      // More specific error messages
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to the server. Please ensure the backend is running on http://localhost:8000');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
            <CardDescription className="text-base">
              Access the administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {backendStatus === 'checking' && (
              <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm">
                <p className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  Checking backend connection...
                </p>
              </div>
            )}
            {backendStatus === 'offline' && (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
                <p className="font-semibold">⚠️ Backend server appears to be offline</p>
                <p className="mt-1">Please ensure the Django server is running:</p>
                <code className="block mt-2 p-2 bg-amber-100 dark:bg-amber-900/40 rounded text-xs whitespace-pre">
                  {`cd /home/smitdesai/Coding/TownHall
source townhallvenv/bin/activate
python manage.py runserver`}
                </code>
                <div className="mt-2 text-xs space-y-1">
                  <p>API URL: <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">{API_BASE_URL}</code></p>
                  {typeof window !== 'undefined' && (
                    <p>Frontend Origin: <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">{window.location.origin}</code></p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={async () => {
                    setBackendStatus('checking');
                    try {
                      const test = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
                        method: 'OPTIONS',
                      });
                      if (test.status === 200 || test.status === 405) {
                        setBackendStatus('online');
                        alert('Backend is now reachable!');
                      } else {
                        setBackendStatus('offline');
                      }
                    } catch (err) {
                      setBackendStatus('offline');
                      console.error('Connection test failed:', err);
                    }
                  }}
                >
                  Test Connection Again
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

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
                    autoComplete="current-password"
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In to Admin Panel"
                )}
              </Button>

              <div className="text-center pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>For authorized administrators only</p>
        </div>
      </motion.div>
    </div>
  );
}

