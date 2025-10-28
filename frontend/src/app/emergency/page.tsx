"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import EmergencyContacts from "@/components/ui/emergency-contacts";
import { Card, CardContent } from "@/components/ui/card";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/Layout";

interface EmergencyContactData {
  town_name: string;
  emergency_contacts: {
    police?: string;
    fire?: string;
    medical?: string;
    non_urgent?: string;
    dispatch?: string;
  };
}

export default function EmergencyPage() {
  const { user, token } = useAuth();
  const [emergencyData, setEmergencyData] = useState<EmergencyContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/towns/emergency-contacts/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmergencyData(data);
        } else {
          setError('Failed to load emergency contacts');
        }
      } catch (err) {
        setError('Error fetching emergency contacts');
        console.error('Error fetching emergency contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchEmergencyContacts();
    }
  }, [token, user]);

  const userRole = user?.role || 'citizen';
  const userName = user ? `${user.firstName} ${user.lastName}` : '';
  const userEmail = user?.email || '';

  return (
    <ProtectedRoute allowedRoles={['citizen', 'business', 'government']}>
      <Layout 
        userType={userRole} 
        userName={userName}
        userEmail={userEmail} 
        showPortalNav={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Emergency Contacts
              </h1>
              <p className="text-lg text-gray-600">
                Quick access to emergency services in your town
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading emergency contacts...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">
                      Please ensure you are logged in and assigned to a town.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contacts */}
            {emergencyData && !loading && (
              <div className="max-w-2xl mx-auto">
                <EmergencyContacts 
                  townName={emergencyData.town_name}
                  contacts={emergencyData.emergency_contacts}
                />
                
                {/* Important Notice */}
                <Card className="mt-6 border-yellow-200 bg-yellow-50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-yellow-800 mb-2">
                      ⚠️ Important Notice
                    </h3>
                    <p className="text-sm text-yellow-700">
                      In case of a life-threatening emergency, always call <strong>911</strong> first. 
                      This page provides additional town-specific emergency contacts for your convenience.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}


