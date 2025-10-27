"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('citizen' | 'business' | 'government' | 'superuser')[];
  redirectTo?: string;
}

interface UserWithSuperuser {
  role: 'citizen' | 'business' | 'government' | 'superuser';
  is_superuser?: boolean;
  [key: string]: any;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check if user is a superuser
      // For superusers, we need to check both the is_superuser flag AND allow them to access any portal
      // Also check if the user has superuser privileges (is_superuser flag)
      const isSuperuser = user?.is_superuser === true || user?.role === 'superuser';
      
      if (isSuperuser) {
        // Superusers can access all portals, skip role check
        return;
      }

      // If not a superuser and role doesn't match allowed roles, redirect
      if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate portal based on user role
        const roleRedirects = {
          citizen: '/citizen',
          business: '/business',
          government: '/government',
          superuser: '/government' // Superusers default to government portal
        };
        router.push(roleRedirects[user.role as keyof typeof roleRedirects] || '/');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Superusers can access all portals
  if (user?.is_superuser || user?.role === 'superuser') {
    return <>{children}</>;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
