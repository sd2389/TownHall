"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp, Users, CheckCircle, Clock, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ReportsSummary {
  summary: {
    total_complaints: number;
    resolved_complaints: number;
    pending_complaints: number;
    in_progress_complaints: number;
    total_users: number;
    pending_users: number;
    approved_users: number;
    new_registrations: number;
    total_businesses: number;
    total_licenses: number;
    pending_licenses: number;
    approved_licenses: number;
    expiring_licenses: number;
    total_towns: number;
    recent_complaints: number;
    recent_registrations: number;
    total_events: number;
    approved_events: number;
    pending_events: number;
    total_services: number;
    active_services: number;
  };
}

export default function AdminReports() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<ReportsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Get admin token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      setAdminToken(token);
    }
  }, []);

  // Fetch reports summary
  const fetchReportsSummary = useCallback(async () => {
    if (!adminToken) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/auth/admin/reports/summary/?days=30`, {
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch reports');
      }

      const data = await response.json();
      setReportsData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      fetchReportsSummary();
    }
  }, [adminToken, fetchReportsSummary]);

  // Download report as JSON
  const downloadReport = async (reportType: string, endpoint: string, filename: string) => {
    if (!adminToken) return;
    
    try {
      setDownloading(reportType);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download report');
      }

      const data = await response.json();
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Error downloading report: ${err.message}`);
      console.error('Error downloading report:', err);
    } finally {
      setDownloading(null);
    }
  };

  // Download as CSV
  const downloadReportCSV = async (reportType: string, endpoint: string, filename: string) => {
    if (!adminToken) return;
    
    try {
      setDownloading(reportType);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download report');
      }

      const data = await response.json();
      
      // Convert to CSV (basic implementation)
      let csv = '';
      if (reportType === 'users' && data.registrations) {
        csv = 'ID,Email,First Name,Last Name,Role,Approved,Town,Created At\n';
        data.registrations.forEach((item: any) => {
          csv += `${item.id},${item.email},${item.first_name},${item.last_name},${item.role_display},${item.is_approved},${item.town_name || ''},${item.created_at}\n`;
        });
      } else if (reportType === 'complaints' && data.complaints) {
        csv = 'ID,Type,Title,Category,Status,Priority,Created At\n';
        data.complaints.forEach((item: any) => {
          csv += `${item.id},${item.type},${item.title},${item.category},${item.status},${item.priority},${item.created_at}\n`;
        });
      } else if (reportType === 'licenses' && data.licenses) {
        csv = 'ID,License Type,License Number,Status,Business Name,Issue Date,Expiry Date\n';
        data.licenses.forEach((item: any) => {
          csv += `${item.id},${item.license_type},${item.license_number},${item.status},${item.business_name},${item.issue_date || ''},${item.expiry_date || ''}\n`;
        });
      } else if (reportType === 'towns' && data.towns) {
        csv = 'Town ID,Town Name,Total Users,Citizens,Businesses,Government,Total Complaints,Resolved,Pending\n';
        data.towns.forEach((item: any) => {
          csv += `${item.town_id},${item.town_name},${item.users.total},${item.users.citizens},${item.users.businesses},${item.users.government},${item.complaints.total},${item.complaints.resolved},${item.complaints.pending}\n`;
        });
      }
      
      if (csv) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      alert(`Error downloading report: ${err.message}`);
      console.error('Error downloading report:', err);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout currentPage="reports">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-600" />
              <p className="mt-4 text-gray-600">Loading reports...</p>
            </div>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  if (error) {
    return (
      <AdminProtectedRoute>
        <AdminLayout currentPage="reports">
          <div className="max-w-7xl mx-auto">
            <Card className="border-red-300">
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <p className="font-semibold">Error loading reports</p>
                  <p className="text-sm mt-2">{error}</p>
                  <Button 
                    onClick={fetchReportsSummary} 
                    className="mt-4"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  const summary = reportsData?.summary || {
    total_complaints: 0,
    resolved_complaints: 0,
    pending_complaints: 0,
    in_progress_complaints: 0,
    total_users: 0,
    pending_users: 0,
    approved_users: 0,
    new_registrations: 0,
    total_businesses: 0,
    total_licenses: 0,
    pending_licenses: 0,
    approved_licenses: 0,
    expiring_licenses: 0,
    total_towns: 0,
    recent_complaints: 0,
    recent_registrations: 0,
    total_events: 0,
    approved_events: 0,
    pending_events: 0,
    total_services: 0,
    active_services: 0,
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout currentPage="reports">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>
            <p className="text-gray-600">View system reports and analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Complaints</p>
                    <p className="text-3xl font-semibold text-gray-900">{summary.total_complaints}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {summary.resolved_complaints} resolved, {summary.pending_complaints} pending
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-3xl font-semibold text-green-600">{summary.resolved_complaints}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {summary.total_complaints > 0 
                        ? Math.round((summary.resolved_complaints / summary.total_complaints) * 100) 
                        : 0}% resolution rate
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-3xl font-semibold text-yellow-600">{summary.pending_complaints}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {summary.in_progress_complaints} in progress
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.total_users}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.new_registrations} new (30 days)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Businesses</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.total_businesses}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.total_licenses} licenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Towns</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.total_towns}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-semibold text-orange-600">{summary.pending_users + summary.pending_licenses}</p>
                <p className="text-xs text-gray-500 mt-1">{summary.pending_users} users, {summary.pending_licenses} licenses</p>
              </CardContent>
            </Card>
          </div>

          {/* Available Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  User Reports
                </CardTitle>
                <CardDescription>View user registration and activity reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadReport('users', '/auth/admin/reports/users/?days=30', 'user_registrations')}
                    disabled={downloading === 'users'}
                  >
                    {downloading === 'users' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    New Registrations Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadReportCSV('users', '/auth/admin/reports/users/?days=30', 'user_registrations')}
                    disabled={downloading === 'users-csv'}
                  >
                    {downloading === 'users-csv' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Complaint Reports
                </CardTitle>
                <CardDescription>Analyze complaints and resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadReport('complaints', '/auth/admin/reports/complaints/?days=30', 'complaints')}
                    disabled={downloading === 'complaints'}
                  >
                    {downloading === 'complaints' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-2" />
                    )}
                    Complaints Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadReportCSV('complaints', '/auth/admin/reports/complaints/?days=30', 'complaints')}
                    disabled={downloading === 'complaints-csv'}
                  >
                    {downloading === 'complaints-csv' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                  Business Reports
                </CardTitle>
                <CardDescription>Business licenses and permits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadReport('licenses', '/auth/admin/reports/licenses/', 'business_licenses')}
                    disabled={downloading === 'licenses'}
                  >
                    {downloading === 'licenses' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    License Applications
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadReportCSV('licenses', '/auth/admin/reports/licenses/', 'business_licenses')}
                    disabled={downloading === 'licenses-csv'}
                  >
                    {downloading === 'licenses-csv' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  Town Reports
                </CardTitle>
                <CardDescription>Town-level analytics and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadReport('towns', '/auth/admin/reports/towns/', 'town_statistics')}
                    disabled={downloading === 'towns'}
                  >
                    {downloading === 'towns' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Users className="h-4 w-4 mr-2" />
                    )}
                    Town Statistics
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadReportCSV('towns', '/auth/admin/reports/towns/', 'town_statistics')}
                    disabled={downloading === 'towns-csv'}
                  >
                    {downloading === 'towns-csv' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
