"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Shield, 
  Search, 
  CheckCircle, 
  XCircle,
  Building,
  MapPin,
  Mail,
  Phone,
  Save,
  RefreshCw
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface GovernmentOfficial {
  id: number;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  department: string;
  position: string;
  phone_number: string;
  office_address: string;
  town: {
    id: number;
    name: string;
    state: string;
  } | null;
  can_view_users: boolean;
  can_approve_users: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminOfficials() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [officials, setOfficials] = useState<GovernmentOfficial[]>([]);
  const [filteredOfficials, setFilteredOfficials] = useState<GovernmentOfficial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<Record<number, { can_view_users: boolean; can_approve_users: boolean }>>({});

  // Get admin token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      setAdminToken(token);
    }
  }, []);

  const fetchOfficials = useCallback(async () => {
    if (!adminToken) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/government/officials/`, {
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOfficials(data);
        setFilteredOfficials(data);
        // Initialize permissions state
        const perms: Record<number, { can_view_users: boolean; can_approve_users: boolean }> = {};
        data.forEach((official: GovernmentOfficial) => {
          perms[official.id] = {
            can_view_users: official.can_view_users,
            can_approve_users: official.can_approve_users,
          };
        });
        setPermissions(perms);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to fetch government officials'}`);
      }
    } catch (error) {
      console.error('Error fetching officials:', error);
      alert('Failed to fetch government officials. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      fetchOfficials();
    }
  }, [adminToken, fetchOfficials]);

  // Filter officials based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOfficials(officials);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = officials.filter(official => 
      official.email.toLowerCase().includes(term) ||
      official.first_name.toLowerCase().includes(term) ||
      official.last_name.toLowerCase().includes(term) ||
      official.employee_id.toLowerCase().includes(term) ||
      official.department.toLowerCase().includes(term) ||
      official.position.toLowerCase().includes(term) ||
      (official.town && official.town.name.toLowerCase().includes(term))
    );
    setFilteredOfficials(filtered);
  }, [searchTerm, officials]);

  const handlePermissionChange = (officialId: number, permission: 'can_view_users' | 'can_approve_users', value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [officialId]: {
        ...prev[officialId],
        [permission]: value,
      }
    }));
  };

  const handleSavePermissions = async (officialId: number) => {
    if (!adminToken) return;

    try {
      setSaving(officialId);
      const officialPerms = permissions[officialId];
      
      const response = await fetch(`${API_BASE_URL}/government/officials/${officialId}/permissions/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          can_view_users: officialPerms.can_view_users,
          can_approve_users: officialPerms.can_approve_users,
        }),
      });

      if (response.ok) {
        // Update the official in the list
        setOfficials(prev => prev.map(official => 
          official.id === officialId 
            ? { ...official, ...officialPerms }
            : official
        ));
        alert('Permissions updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to update permissions'}`);
        // Revert permissions
        fetchOfficials();
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Failed to update permissions. Please check the console for details.');
      // Revert permissions
      fetchOfficials();
    } finally {
      setSaving(null);
    }
  };

  const hasChanges = (officialId: number): boolean => {
    const official = officials.find(o => o.id === officialId);
    if (!official) return false;
    const perms = permissions[officialId];
    return perms.can_view_users !== official.can_view_users || 
           perms.can_approve_users !== official.can_approve_users;
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout currentPage="officials">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Government Officials Management</h2>
            <p className="text-gray-600">Manage permissions for government officials</p>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, employee ID, department, position, or town..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Officials List */}
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003153]"></div>
                <p className="text-gray-600 mt-4">Loading government officials...</p>
              </CardContent>
            </Card>
          ) : filteredOfficials.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {officials.length === 0 ? 'No Government Officials' : 'No Officials Found'}
                </h3>
                <p className="text-gray-600">
                  {officials.length === 0 
                    ? 'There are no government officials in the system yet.'
                    : 'Try adjusting your search criteria.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOfficials.map((official) => (
                <Card key={official.id} className="border border-gray-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="h-5 w-5 text-[#003153]" />
                          <CardTitle className="text-lg">
                            {official.first_name} {official.last_name}
                          </CardTitle>
                          {!official.is_approved && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pending Approval
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {official.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {official.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {official.position}
                            </span>
                            {official.town && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {official.town.name}, {official.town.state}
                              </span>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Permissions Section */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Permissions</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`view-${official.id}`}
                                checked={permissions[official.id]?.can_view_users || false}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(official.id, 'can_view_users', checked as boolean)
                                }
                              />
                              <label 
                                htmlFor={`view-${official.id}`}
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                Can View Users
                              </label>
                            </div>
                            <span className="text-xs text-gray-500">
                              View citizen/business owner details
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`approve-${official.id}`}
                                checked={permissions[official.id]?.can_approve_users || false}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(official.id, 'can_approve_users', checked as boolean)
                                }
                              />
                              <label 
                                htmlFor={`approve-${official.id}`}
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                Can Approve Users
                              </label>
                            </div>
                            <span className="text-xs text-gray-500">
                              Approve/reject users from their town
                            </span>
                          </div>
                        </div>
                        {hasChanges(official.id) && (
                          <div className="mt-4 flex justify-end">
                            <Button
                              onClick={() => handleSavePermissions(official.id)}
                              disabled={saving === official.id}
                              className="bg-[#003153] hover:bg-[#003153]/90 text-white"
                            >
                              {saving === official.id ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="border-t pt-4 text-xs text-gray-500">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Employee ID:</span> {official.employee_id}
                          </div>
                          {official.phone_number && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {official.phone_number}
                            </div>
                          )}
                        </div>
                        {official.office_address && (
                          <div className="mt-2">
                            <span className="font-medium">Office Address:</span> {official.office_address}
                          </div>
                        )}
                      </div>
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










