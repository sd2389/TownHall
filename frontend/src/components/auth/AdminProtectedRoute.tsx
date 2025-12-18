"use client";

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminAuth = () => {
      if (typeof window !== 'undefined') {
        const adminToken = localStorage.getItem('admin_token');
        const adminUser = localStorage.getItem('admin_user');
        
        if (adminToken && adminUser) {
          setIsAuthenticated(true);
          return;
        }
        
        // No admin token found
        setIsAuthenticated(false);
        router.push('/admin');
      }
    };
    
    checkAdminAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003153]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}










