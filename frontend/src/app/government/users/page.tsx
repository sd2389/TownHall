"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Building2, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Search, 
  UserCheck,
  Clock,
  AlertCircle,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PendingUser {
  user_id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  town?: string;
  created_at: string;
}

export default function GovernmentUsers() {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "citizen" | "business">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Fetch pending users
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setIsLoading(true);
        setPermissionError(null); // Clear any previous permission errors
        const data = await usersApi.listPending();
        setPendingUsers(data);
      } catch (error: any) {
        // Don't show alert for permission errors - we'll show a card instead
        if (error.message && (error.message.includes('permission') || error.message.includes('Permission'))) {
          setPermissionError(error.message);
          setPendingUsers([]); // Set empty to show permission error card
          // Log debug info if available
          if (error.debug_info) {
            console.log('Permission debug info:', error.debug_info);
          }
        } else {
          console.error('Error fetching pending users:', error);
          setPermissionError(null);
          alert(error.message || 'Failed to fetch pending users');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPendingUsers();
    }
  }, [user]);

  // Fetch user details
  const fetchUserDetails = async (userId: number) => {
    try {
      setIsLoadingDetails(true);
      const details = await usersApi.getDetails(userId);
      setUserDetails(details);
      setIsDetailsDialogOpen(true);
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      alert(error.message || 'Failed to fetch user details');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Handle approve user
  const handleApprove = async (userId: number) => {
    if (!confirm('Are you sure you want to approve this user account?')) {
      return;
    }

    try {
      setIsProcessing(userId);
      await usersApi.approve(userId);
      // Remove approved user from list
      setPendingUsers(prev => prev.filter(u => u.user_id !== userId));
      alert('User approved successfully!');
    } catch (error: any) {
      console.error('Error approving user:', error);
      alert(error.message || 'Failed to approve user');
    } finally {
      setIsProcessing(null);
    }
  };

  // Handle reject user
  const handleReject = async (userId: number) => {
    if (!confirm('Are you sure you want to reject this user account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsProcessing(userId);
      await usersApi.reject(userId);
      // Remove rejected user from list
      setPendingUsers(prev => prev.filter(u => u.user_id !== userId));
      alert('User rejected successfully!');
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      alert(error.message || 'Failed to reject user');
    } finally {
      setIsProcessing(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'citizen': return <Users className="h-5 w-5 text-[#003153]" />;
      case 'business': return <Building2 className="h-5 w-5 text-[#003153]" />;
      default: return <UserCheck className="h-5 w-5 text-[#003153]" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      citizen: 'bg-blue-600 text-white',
      business: 'bg-green-600 text-white',
    };
    return (
      <Badge className={colors[role as keyof typeof colors] || 'bg-gray-600 text-white'}>
        {role === 'citizen' ? 'Citizen' : role === 'business' ? 'Business Owner' : role}
      </Badge>
    );
  };

  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <ProtectedRoute allowedRoles={['government']}>
      <Layout 
        userType="government" 
        userName={`${user?.firstName || ''} ${user?.lastName || ''}`} 
        userEmail={user?.email || ''} 
        showPortalNav={true}
      >
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#003153] rounded-lg flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                          User Account Approvals
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                          Review and approve citizen and business owner accounts from your town
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500 text-white px-4 py-1.5 text-sm font-medium border-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {pendingUsers.length} Pending
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={filterRole === "all" ? "default" : "outline"}
                        onClick={() => setFilterRole("all")}
                        size="sm"
                        className={filterRole === "all" ? "bg-[#003153] hover:bg-[#003153]/90 text-white" : ""}
                      >
                        All
                      </Button>
                      <Button
                        variant={filterRole === "citizen" ? "default" : "outline"}
                        onClick={() => setFilterRole("citizen")}
                        size="sm"
                        className={filterRole === "citizen" ? "bg-[#003153] hover:bg-[#003153]/90 text-white" : ""}
                      >
                        Citizens
                      </Button>
                      <Button
                        variant={filterRole === "business" ? "default" : "outline"}
                        onClick={() => setFilterRole("business")}
                        size="sm"
                        className={filterRole === "business" ? "bg-[#003153] hover:bg-[#003153]/90 text-white" : ""}
                      >
                        Business Owners
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pending Users List */}
            {isLoading ? (
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardContent className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003153]"></div>
                  <p className="text-slate-600 dark:text-slate-300 mt-4">Loading pending users...</p>
                </CardContent>
              </Card>
            ) : permissionError ? (
              <Card className="border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-16 w-16 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Permission Required
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {permissionError}
                  </p>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-left max-w-2xl mx-auto mt-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      To grant this permission:
                    </p>
                    <ol className="text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside space-y-2">
                      <li>Log in to the admin panel at <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">/admin</code></li>
                      <li>Navigate to <strong>Government Officials</strong> in the sidebar</li>
                      <li>Find your government official profile (search by your email)</li>
                      <li>Check the <strong>"Can Approve Users"</strong> checkbox</li>
                      <li>Click <strong>"Save Changes"</strong> button</li>
                      <li>Refresh this page</li>
                    </ol>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 italic">
                      Note: Only administrators can grant this permission. If you don't have admin access, contact your system administrator.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredUsers.length === 0 ? (
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardContent className="p-12 text-center">
                  <UserCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {pendingUsers.length === 0 ? 'No Pending Users' : 'No Users Found'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {pendingUsers.length === 0
                      ? 'All user accounts from your town have been reviewed.'
                      : 'No users match your current filters.'}
                  </p>
                  {(searchTerm || filterRole !== "all") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterRole("all");
                      }}
                      className="border-slate-300 dark:border-slate-600"
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                {filteredUsers.map((pendingUser, index) => (
                  <motion.div
                    key={pendingUser.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-[#003153]/10 rounded-lg">
                              {getRoleIcon(pendingUser.role)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                                  {pendingUser.firstName} {pendingUser.lastName}
                                </h3>
                                {getRoleBadge(pendingUser.role)}
                                <Badge className="bg-yellow-500 text-white">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending Approval
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{pendingUser.email}</span>
                                </div>
                                {pendingUser.town && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{pendingUser.town}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Registered {new Date(pendingUser.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(pendingUser);
                                fetchUserDetails(pendingUser.user_id);
                              }}
                              className="border-slate-300 dark:border-slate-600"
                              disabled={isLoadingDetails}
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(pendingUser.user_id)}
                              className="bg-green-600 hover:bg-green-700 text-white border-0"
                              disabled={isProcessing === pendingUser.user_id}
                            >
                              {isProcessing === pendingUser.user_id ? (
                                <>
                                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(pendingUser.user_id)}
                              className="border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              disabled={isProcessing === pendingUser.user_id}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* User Details Dialog */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    User Account Details
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 dark:text-slate-300">
                    Review user information before approving or rejecting
                  </DialogDescription>
                </DialogHeader>
                {isLoadingDetails ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003153]"></div>
                    <p className="text-slate-600 dark:text-slate-300 mt-4">Loading details...</p>
                  </div>
                ) : userDetails ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                        <p className="text-slate-900 dark:text-white">{userDetails.firstName} {userDetails.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <p className="text-slate-900 dark:text-white">{userDetails.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                        <p className="text-slate-900 dark:text-white">{userDetails.role}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Town</label>
                        <p className="text-slate-900 dark:text-white">{userDetails.town || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                        <p className="text-slate-900 dark:text-white">{userDetails.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Registered</label>
                        <p className="text-slate-900 dark:text-white">
                          {new Date(userDetails.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {userDetails.address && (
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                        <p className="text-slate-900 dark:text-white">{userDetails.address}</p>
                      </div>
                    )}
                    {userDetails.businessName && (
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                        <p className="text-slate-900 dark:text-white">{userDetails.businessName}</p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        onClick={() => {
                          if (selectedUser) handleApprove(selectedUser.user_id);
                          setIsDetailsDialogOpen(false);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Account
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (selectedUser) handleReject(selectedUser.user_id);
                          setIsDetailsDialogOpen(false);
                        }}
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Account
                      </Button>
                    </div>
                  </div>
                ) : null}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

