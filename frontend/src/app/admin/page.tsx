"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  MapPin as MapPinIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [townChangeRequests, setTownChangeRequests] = useState<TownChangeRequest[]>([]);
  const [stats, setStats] = useState({
    pendingUsers: 0,
    pendingTownChanges: 0,
    approvedToday: 0,
    rejectedToday: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, townChangesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/auth/pending-users/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_BASE_URL}/towns/change-requests/`, {
          headers: {
            'Authorization': `Token ${token}`,
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
        const townChangesData = await townChangesRes.json();
        setTownChangeRequests(townChangesData);
        setStats(prev => ({ ...prev, pendingTownChanges: townChangesData.length }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (user?.role === 'government') {
      fetchData();
    }
  }, [user, fetchData]);

  const handleApproveUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/approve-user/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchData();
        setStats(prev => ({ ...prev, approvedToday: prev.approvedToday + 1 }));
      }
    } catch (err) {
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
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchData();
        setStats(prev => ({ ...prev, rejectedToday: prev.rejectedToday + 1 }));
      }
    } catch (err) {
      alert('Failed to reject user');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'citizen': return <Users className="h-5 w-5 text-gray-600" />;
      case 'business': return <Building className="h-5 w-5 text-gray-600" />;
      case 'government': return <Shield className="h-5 w-5 text-gray-600" />;
      default: return <Users className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['government', 'superuser']}>
      <AdminLayout currentPage="dashboard">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, {user?.firstName}. Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Pending Users Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                {stats.pendingUsers > 0 && (
                  <Badge className="bg-blue-100 text-blue-700">Action Required</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending User Approvals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingUsers}</p>
                <p className="text-xs text-gray-500 mt-2">Awaiting your review</p>
              </div>
            </CardContent>
          </Card>

          {/* Town Changes Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-gray-600" />
                </div>
                {stats.pendingTownChanges > 0 && (
                  <Badge className="bg-gray-100 text-gray-700">Review Needed</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Town Change Requests</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingTownChanges}</p>
                <p className="text-xs text-gray-500 mt-2">Pending location changes</p>
              </div>
            </CardContent>
          </Card>

          {/* Today's Approvals Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved Today</p>
                <p className="text-3xl font-bold text-gray-900">{stats.approvedToday}</p>
                <p className="text-xs text-gray-500 mt-2">Accounts activated</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Activity className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">System Status</p>
                <p className="text-3xl font-bold text-green-600">Active</p>
                <p className="text-xs text-gray-500 mt-2">All systems operational</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pending Actions - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Pending Users Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Pending User Approvals</CardTitle>
                      <p className="text-xs text-gray-600">Review and approve new registrations</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/admin/users'}
                    className="text-sm"
                  >
                    View All →
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading...</p>
                  </div>
                ) : pendingUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium text-sm">No pending users</p>
                    <p className="text-xs text-gray-500 mt-1">All users have been reviewed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.slice(0, 3).map((pendingUser) => (
                      <div key={pendingUser.user_id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getRoleIcon(pendingUser.role)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {pendingUser.firstName} {pendingUser.lastName}
                              </h3>
                              <p className="text-xs text-gray-600">{pendingUser.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-gray-100 text-gray-700">{pendingUser.role}</Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(pendingUser.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveUser(pendingUser.user_id)}
                              size="sm"
                              className="bg-gray-900 hover:bg-gray-800 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectUser(pendingUser.user_id)}
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pendingUsers.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="outline" onClick={() => window.location.href = '/admin/users'}>
                          View all {pendingUsers.length} pending users →
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Town Changes Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Recent Town Change Requests</CardTitle>
                      <p className="text-xs text-gray-600">Location change approvals</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/admin/towns'}
                    className="text-sm"
                  >
                    View All →
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading...</p>
                  </div>
                ) : townChangeRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium text-sm">No pending requests</p>
                    <p className="text-xs text-gray-500 mt-1">All requests have been processed</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {townChangeRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{request.user_name}</h3>
                            <p className="text-xs text-gray-600">{request.user_email}</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-700 text-xs">
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs mb-2">
                          <div>
                            <span className="text-gray-600">From:</span>
                            <span className="ml-2 font-medium text-gray-900">{request.current_town}</span>
                          </div>
                          <span className="text-gray-400">→</span>
                          <div>
                            <span className="text-gray-600">To:</span>
                            <span className="ml-2 font-medium text-gray-900">{request.requested_town}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                          <Button
                            size="sm"
                            className="bg-gray-900 hover:bg-gray-800 text-white flex-1 text-xs"
                          >
                            Review
                          </Button>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          Requested {new Date(request.requested_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    {townChangeRequests.length > 3 && (
                      <div className="text-center pt-1">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/towns'}>
                          View all {townChangeRequests.length} requests →
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/admin/users'}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/admin/towns'}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Town Management
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/admin/reports'}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/admin/settings'}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  Today's Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Approved</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.approvedToday}</span>
                </div>
                
                <div className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-gray-700">Rejected</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.rejectedToday}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Pending</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.pendingUsers}</span>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-900 rounded-full mb-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">TownHall Admin</h3>
                  <p className="text-xs text-gray-600 mb-3">Administration Control Panel</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Status:</span>
                      <span className="font-medium text-green-600">Operational</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Role:</span>
                      <span className="font-medium text-gray-900">{user?.role}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Town:</span>
                      <span className="font-medium text-gray-900">{user?.town || 'All'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
