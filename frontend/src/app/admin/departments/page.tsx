"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Mail,
  Phone,
  Save,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Department {
  id: number;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
}

export default function AdminDepartments() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
  });

  // Get admin token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      setAdminToken(token);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      // Since the endpoint has AllowAny for GET, we can call it without auth
      // But we'll include the token if available for consistency
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (adminToken) {
        headers['Authorization'] = `Token ${adminToken}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/government/departments/`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch departments' }));
        console.error('Error fetching departments:', errorData);
        alert(`Error: ${errorData.error || 'Failed to fetch departments'}`);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Failed to fetch departments. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreateDepartment = async () => {
    if (!formData.name.trim()) {
      alert('Department name is required');
      return;
    }

    if (!adminToken) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/government/departments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchDepartments();
        setIsCreateDialogOpen(false);
        setFormData({ name: "", description: "", contact_email: "", contact_phone: "" });
        alert('Department created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create department'}`);
      }
    } catch (error) {
      alert('Failed to create department');
    }
  };

  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      contact_email: dept.contact_email,
      contact_phone: dept.contact_phone,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDepartment = async () => {
    if (!formData.name.trim() || !editingDepartment) {
      alert('Department name is required');
      return;
    }

    if (!adminToken) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/government/departments/${editingDepartment.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchDepartments();
        setIsEditDialogOpen(false);
        setEditingDepartment(null);
        setFormData({ name: "", description: "", contact_email: "", contact_phone: "" });
        alert('Department updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update department'}`);
      }
    } catch (error) {
      alert('Failed to update department');
    }
  };

  const handleDeleteDepartment = async (deptId: number) => {
    if (!confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return;
    }

    if (!adminToken) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/government/departments/${deptId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchDepartments();
        alert('Department deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to delete department'}`);
      }
    } catch (error) {
      alert('Failed to delete department');
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminProtectedRoute>
      <AdminLayout currentPage="departments">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Department Management</h1>
              <p className="text-gray-600 mt-2">Create and manage government departments</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-700 hover:bg-slate-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Department
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Department</DialogTitle>
                  <DialogDescription>
                    Add a new government department to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Public Works, Parks & Recreation"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the department's responsibilities..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact_email"
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                          placeholder="dept@city.gov"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact_phone"
                          type="tel"
                          value={formData.contact_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                          placeholder="(555) 123-4567"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDepartment} className="bg-slate-700 hover:bg-slate-800 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Create Department
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Departments List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading departments...</p>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Departments Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'No departments match your search.' : 'Get started by creating your first department.'}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-slate-700 hover:bg-slate-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Department
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map((dept) => (
                <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditDepartment(dept)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {dept.description && (
                      <CardDescription className="mb-4 line-clamp-3">
                        {dept.description}
                      </CardDescription>
                    )}
                    <div className="space-y-2 text-sm">
                      {dept.contact_email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{dept.contact_email}</span>
                        </div>
                      )}
                      {dept.contact_phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{dept.contact_phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Department</DialogTitle>
                <DialogDescription>
                  Update department information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Department Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Public Works, Parks & Recreation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the department's responsibilities..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact_email">Contact Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="edit-contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                        placeholder="dept@city.gov"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact_phone">Contact Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="edit-contact_phone"
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                        placeholder="(555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingDepartment(null);
                    setFormData({ name: "", description: "", contact_email: "", contact_phone: "" });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateDepartment} className="bg-slate-700 hover:bg-slate-800 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Update Department
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}

