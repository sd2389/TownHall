"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Building, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  MapPin,
  Activity,
  Calendar,
  UserCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  MapPin as MapPinIcon
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface PendingUser {
  user_id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  created_at: string;
}

interface TownChangeRequest {
  id: number;
  user_name: string;
  user_email: string;
  current_town: string;
  requested_town: string;
  status: string;
  requested_at: string;
}

// Admin Login Component
function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

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
      const response = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        if (data.user) {
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        }
        // Small delay to ensure localStorage is set, then redirect
        setTimeout(() => {
          window.location.href = '/admin';
        }, 100);
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-md">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#003153] rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>Sign in to access the admin panel</CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#003153] hover:bg-[#003153]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [townChangeRequests, setTownChangeRequests] = useState<TownChangeRequest[]>([]);
  const [stats, setStats] = useState({
    pendingUsers: 0,
    pendingTownChanges: 0,
    approvedToday: 0,
    rejectedToday: 0
  });
  // Initialize state by checking localStorage immediately (synchronously)
  const getInitialAdminToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  };

  const getInitialAdminUser = (): any => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing admin user:', e);
        }
      }
    }
    return null;
  };

  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(getInitialAdminToken);
  const [adminUser, setAdminUser] = useState<any>(getInitialAdminUser);

  // Check for admin authentication - run immediately on mount
  useEffect(() => {
    const checkAdminAuth = () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('admin_user');
        
        if (storedToken && storedUser) {
          setAdminToken(storedToken);
          try {
            setAdminUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Error parsing admin user:', e);
          }
          setLoading(false);
          return;
        }
        
        // Check if user is superuser from regular auth
        if (user?.is_superuser || user?.role === 'superuser') {
          // Allow access with regular token
          setAdminToken(token || '');
          setAdminUser(user);
          setLoading(false);
          return;
        }
        
        // No admin token found
        setLoading(false);
      }
    };
    
    // If we already have a token from initial state, don't reload
    if (adminToken) {
      setLoading(false);
      return;
    }
    
    // Check immediately
    checkAdminAuth();
    
    // Also listen for storage changes (in case token is set in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_token' || e.key === 'admin_user') {
        checkAdminAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, token, adminToken]);

  const fetchData = useCallback(async () => {
    if (!adminToken) return;
    
    try {
      const [usersRes, townChangesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/auth/users/?status=pending`, {
          headers: {
            'Authorization': `Token ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_BASE_URL}/towns/change-requests/`, {
          headers: {
            'Authorization': `Token ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setPendingUsers(usersData);
        setStats(prev => ({ ...prev, pendingUsers: usersData.length }));
      }

      if (townChangesRes.ok) {
        const townData = await townChangesRes.json();
        setTownChangeRequests(townData);
        setStats(prev => ({ ...prev, pendingTownChanges: townData.length }));
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      fetchData();
    } else {
      // If no token after checking, stop loading
      setLoading(false);
    }
  }, [adminToken, fetchData]);

  // Show login if not authenticated
  if (!adminToken && !loading) {
    return <AdminLoginForm />;
  }

  if (loading || !adminToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003153]"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="dashboard">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600">Manage users, towns, and system settings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#003153] rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Town Changes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingTownChanges}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.approvedToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.rejectedToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Users */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pending User Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No pending users</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <Badge className="mt-2">{user.role}</Badge>
                      </div>
                      <Button
                        onClick={() => router.push(`/admin/users`)}
                        size="sm"
                        className="bg-[#003153] hover:bg-[#003153]/90"
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Town Change Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Town Change Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {townChangeRequests.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No pending town change requests</p>
              ) : (
                <div className="space-y-4">
                  {townChangeRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{request.user_name}</p>
                        <p className="text-sm text-gray-600">{request.user_email}</p>
                        <p className="text-sm mt-1">
                          <span className="text-gray-500">{request.current_town}</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">{request.requested_town}</span>
                        </p>
                      </div>
                      <Badge>{request.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
  );
}

export default function AdminPage() {
  return <AdminDashboard />;
}
