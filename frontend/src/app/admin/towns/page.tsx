"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Search, CheckCircle, Clock, Plus } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Town {
  id: number;
  name: string;
  state: string;
  is_active: boolean;
  zip_codes: string[];
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

export default function AdminTowns() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [townChangeRequests, setTownChangeRequests] = useState<TownChangeRequest[]>([]);
  const [activeTowns, setActiveTowns] = useState<Town[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"changes" | "towns">("towns");
  const [isAddTownDialogOpen, setIsAddTownDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTown, setNewTown] = useState({
    name: '',
    state: '',
    zip_codes: '' as string | string[]
  });
  const [error, setError] = useState<string | null>(null);

  // Get admin token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      setAdminToken(token);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!adminToken) return;
    
    try {
      const [townChangesRes, townsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/towns/change-requests/`, {
          headers: {
            'Authorization': `Token ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_BASE_URL}/towns/active/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (townChangesRes.ok) {
        const changesData = await townChangesRes.json();
        setTownChangeRequests(changesData);
      }

      if (townsRes.ok) {
        const townsData = await townsRes.json();
        setActiveTowns(townsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      fetchData();
    }
  }, [adminToken, fetchData]);

  const handleApprove = async (requestId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/towns/change-request/${requestId}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchData();
        alert('Request approved successfully!');
      }
    } catch (error) {
      alert('Failed to approve request');
    }
  };

  const handleReject = async (requestId: number) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch(`${API_BASE_URL}/towns/change-request/${requestId}/reject/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        fetchData();
        alert('Request rejected successfully!');
      }
    } catch (error) {
      alert('Failed to reject request');
    }
  };

  const handleAddTown = async () => {
    if (!newTown.name || !newTown.state) {
      setError('Town name and state are required');
      return;
    }

    if (!adminToken) {
      setError('Admin token not found. Please log in again.');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      // Parse zip codes (comma-separated string to array)
      const zipCodes = newTown.zip_codes
        ? (typeof newTown.zip_codes === 'string' 
            ? newTown.zip_codes.split(',').map(z => z.trim()).filter(z => z)
            : newTown.zip_codes)
        : [];

      const response = await fetch(`${API_BASE_URL}/towns/active/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTown.name.trim(),
          state: newTown.state.trim(),
          zip_codes: zipCodes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAddTownDialogOpen(false);
        setNewTown({ name: '', state: '', zip_codes: '' });
        fetchData();
        alert('Town created successfully!');
      } else {
        setError(data.error || 'Failed to create town');
      }
    } catch (error) {
      console.error('Error creating town:', error);
      setError('Failed to create town. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-gray-100 text-gray-700', icon: Clock },
      approved_current: { color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
      completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
    };
    const config = configs[status as keyof typeof configs] || { color: 'bg-gray-100 text-gray-700', icon: Clock };
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout currentPage="towns">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedTab("towns")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  selectedTab === "towns"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Active Towns ({activeTowns.length})
              </button>
              <button
                onClick={() => setSelectedTab("changes")}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  selectedTab === "changes"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Town Changes ({townChangeRequests.length})
              </button>
            </div>
          </div>

          {selectedTab === "changes" ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Town Change Requests</h2>
                <p className="text-gray-600">Review and manage location change requests</p>
              </div>

              {loading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-600">Loading requests...</p>
                  </CardContent>
                </Card>
              ) : townChangeRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No pending town change requests</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {townChangeRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-l-gray-400">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{request.user_name}</h3>
                            <p className="text-sm text-gray-600">{request.user_email}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">From</p>
                            <p className="font-semibold">{request.current_town}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">To</p>
                            <p className="font-semibold">{request.requested_town}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Button
                            onClick={() => handleApprove(request.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={request.status !== 'pending' && request.status !== 'approved_current'}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(request.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                          Requested: {new Date(request.requested_at).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Active Towns</h2>
                  <p className="text-gray-600">Manage town information and settings</p>
                </div>
                <Dialog open={isAddTownDialogOpen} onOpenChange={setIsAddTownDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gray-900 hover:bg-gray-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Town
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Town</DialogTitle>
                      <DialogDescription>
                        Create a new town in the system
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-800">{error}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium">Town Name *</label>
                        <Input
                          value={newTown.name}
                          onChange={(e) => setNewTown({ ...newTown, name: e.target.value })}
                          placeholder="e.g., Secaucus"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">State *</label>
                        <Input
                          value={newTown.state}
                          onChange={(e) => setNewTown({ ...newTown, state: e.target.value })}
                          placeholder="e.g., New Jersey"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">ZIP Codes (optional)</label>
                        <Input
                          value={typeof newTown.zip_codes === 'string' ? newTown.zip_codes : newTown.zip_codes.join(', ')}
                          onChange={(e) => setNewTown({ ...newTown, zip_codes: e.target.value })}
                          placeholder="e.g., 07094, 07095 (comma-separated)"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter ZIP codes separated by commas</p>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddTownDialogOpen(false);
                            setNewTown({ name: '', state: '', zip_codes: '' });
                            setError(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddTown}
                          disabled={isCreating || !newTown.name || !newTown.state}
                          className="bg-gray-900 hover:bg-gray-800"
                        >
                          {isCreating ? 'Creating...' : 'Create Town'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-600">Loading towns...</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeTowns.map((town) => (
                    <Card key={town.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <MapPin className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{town.name}</h3>
                              <p className="text-sm text-gray-600">{town.state}</p>
                            </div>
                          </div>
                          {town.is_active && (
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          )}
                        </div>
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-2">ZIP Codes</p>
                          <p className="text-sm text-gray-700">
                            {town.zip_codes && town.zip_codes.length > 0 
                              ? town.zip_codes.join(', ') 
                              : 'Not specified'}
                          </p>
                        </div>
                        <Button variant="outline" className="w-full mt-4" size="sm">
                          Edit Town
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}

