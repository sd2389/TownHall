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
  ArrowLeft,
  Settings,
  Key,
  Server
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
    const testConnection = async () => {
      setBackendStatus('checking');
      try {
        const testUrl = API_BASE_URL.replace('/api', '') || 'http://localhost:8000';
        const testResponse = await fetch(`${testUrl}/admin/`, {
          method: 'GET',
          mode: 'no-cors',
        });
        setBackendStatus('online');
      } catch (err: any) {
        try {
          const apiTest = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
            method: 'OPTIONS',
          });
          if (apiTest.status === 200 || apiTest.status === 405) {
            setBackendStatus('online');
          } else {
            setBackendStatus('offline');
          }
        } catch (apiErr) {
          setBackendStatus('offline');
        }
      }
    };
    
    if (typeof window !== 'undefined') {
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
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let response;
      try {
        const url = `${API_BASE_URL}/auth/admin-login/`;
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
      } catch (fetchError: any) {
        if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
          throw new Error(`Cannot connect to the server at ${API_BASE_URL}. Please ensure:
1. The Django backend is running: python manage.py runserver
2. The backend is accessible at http://localhost:8000
3. CORS is properly configured in settings.py`);
        }
        throw new Error('Network error. Please check your connection and ensure the backend server is running on http://localhost:8000');
      }

      let data;
      try {
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server.');
        }
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Invalid response from server. Please check if the backend is running and accessible.');
      }

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        if (data.user) {
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        }
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        <Card className="shadow-2xl border-slate-700 bg-slate-800/95 backdrop-blur-lg">
          <CardHeader className="space-y-1 text-center pb-6 pt-8">
            {/* Admin Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#003153] rounded-full blur-xl opacity-50"></div>
                <div className="relative p-4 rounded-full bg-gradient-to-br from-[#003153] to-slate-700 border-2 border-slate-600">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>
            
            <CardTitle className="text-3xl font-bold text-white">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-slate-400 text-base">
              System Administration Dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {/* Backend Status */}
            {backendStatus === 'checking' && (
              <div className="mb-4 p-3 rounded-lg bg-blue-900/30 border border-blue-700 text-blue-300 text-sm">
                <p className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                  Checking backend connection...
                </p>
              </div>
            )}
            
            {backendStatus === 'offline' && (
              <div className="mb-4 p-4 rounded-lg bg-amber-900/30 border border-amber-700 text-amber-300 text-sm">
                <p className="font-semibold flex items-center gap-2 mb-2">
                  <Server className="h-4 w-4" />
                  Backend server appears to be offline
                </p>
                <p className="text-xs text-amber-400 mb-2">Please ensure the Django server is running:</p>
                <code className="block p-2 bg-slate-900 rounded text-xs text-amber-200 whitespace-pre border border-amber-800">
                  {`cd /home/smitdesai/Coding/TownHall
source townhallvenv/bin/activate
python manage.py runserver`}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full border-amber-700 text-amber-300 hover:bg-amber-900/20"
                  onClick={async () => {
                    setBackendStatus('checking');
                    try {
                      const test = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
                        method: 'OPTIONS',
                      });
                      if (test.status === 200 || test.status === 405) {
                        setBackendStatus('online');
                      } else {
                        setBackendStatus('offline');
                      }
                    } catch (err) {
                      setBackendStatus('offline');
                    }
                  }}
                >
                  Test Connection Again
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-[#003153] focus:ring-[#003153]"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-[#003153] focus:ring-[#003153]"
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
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

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-[#003153] hover:bg-[#003153]/90 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Sign In to Admin Panel
                  </span>
                )}
              </Button>

              {/* Security Notice */}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                  <Settings className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-slate-400">
                    <p className="font-semibold text-slate-300 mb-1">Security Notice</p>
                    <p>This is a restricted access area. All login attempts are logged and monitored.</p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Authorized administrators only
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Unauthorized access is prohibited
          </p>
        </div>
      </motion.div>
    </div>
  );
}
