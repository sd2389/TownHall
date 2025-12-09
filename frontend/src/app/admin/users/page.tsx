"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Search, Users as UsersIcon, Building, Shield, Filter } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface User {
  user_id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  is_approved: boolean;
  town?: string;
  created_at: string;
  approved_at?: string;
  approved_by?: number;
}

export default function AdminUsers() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "citizen" | "business" | "government">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved">("all");
  const [loading, setLoading] = useState(true);

  // Get admin token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      setAdminToken(token);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/all-users/`, {
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched users:', data);
        setAllUsers(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching users:', errorData);
        alert(`Error: ${errorData.error || 'Failed to fetch users'}`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      fetchAllUsers();
    }
  }, [adminToken, fetchAllUsers]);

  const handleApproveUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/approve-user/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchAllUsers();
        alert('User approved successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to approve user');
    }
  };

  const handleRejectUser = async (userId: number) => {
    if (!confirm('Are you sure you want to reject this user? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reject-user/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchAllUsers();
        alert('User rejected and removed successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to reject user');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'citizen': return <UsersIcon className="h-5 w-5 text-gray-600" />;
      case 'business': return <Building className="h-5 w-5 text-gray-600" />;
      case 'government': return <Shield className="h-5 w-5 text-gray-600" />;
      default: return <UsersIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      citizen: 'bg-blue-100 text-blue-700',
      business: 'bg-green-100 text-green-700',
      government: 'bg-purple-100 text-purple-700',
    };
    return <Badge className={colors[role as keyof typeof colors]}>{role}</Badge>;
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoleFilter = filterRole === "all" || user.role === filterRole;
    
    const matchesStatusFilter = filterStatus === "all" || 
      (filterStatus === "pending" && !user.is_approved) ||
      (filterStatus === "approved" && user.is_approved);
    
    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  });

  return (
    <AdminProtectedRoute>
      <AdminLayout currentPage="users">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage all users across the platform</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-gray-700 py-2">Role:</span>
                    <Button
                      variant={filterRole === "all" ? "default" : "outline"}
                      onClick={() => setFilterRole("all")}
                      size="sm"
                    >
                      All
                    </Button>
                    <Button
                      variant={filterRole === "citizen" ? "default" : "outline"}
                      onClick={() => setFilterRole("citizen")}
                      size="sm"
                    >
                      Citizens
                    </Button>
                    <Button
                      variant={filterRole === "business" ? "default" : "outline"}
                      onClick={() => setFilterRole("business")}
                      size="sm"
                    >
                      Businesses
                    </Button>
                    <Button
                      variant={filterRole === "government" ? "default" : "outline"}
                      onClick={() => setFilterRole("government")}
                      size="sm"
                    >
                      Government
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-gray-700 py-2">Status:</span>
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      onClick={() => setFilterStatus("all")}
                      size="sm"
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStatus === "pending" ? "default" : "outline"}
                      onClick={() => setFilterStatus("pending")}
                      size="sm"
                    >
                      Pending
                    </Button>
                    <Button
                      variant={filterStatus === "approved" ? "default" : "outline"}
                      onClick={() => setFilterStatus("approved")}
                      size="sm"
                    >
                      Approved
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">Loading users...</p>
              </CardContent>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UsersIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
                {(searchTerm || filterRole !== "all" || filterStatus !== "all") ? (
                  <Button variant="outline" onClick={() => { setSearchTerm(""); setFilterRole("all"); setFilterStatus("all"); }} className="mt-4">
                    Clear Filters
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.user_id} className="border-l-4 border-l-gray-400">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <Badge className={user.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                              {user.is_approved ? 'Approved' : 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {getRoleBadge(user.role)}
                            {user.town && (
                              <Badge variant="outline">{user.town}</Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              Registered {new Date(user.created_at).toLocaleDateString()}
                            </span>
                            {user.is_approved && user.approved_at && (
                              <span className="text-xs text-gray-500">
                                • Approved {new Date(user.approved_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!user.is_approved && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveUser(user.user_id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectUser(user.user_id)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}

