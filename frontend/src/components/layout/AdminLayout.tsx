"use client";

import { Shield, Users, MapPin, FileText, Settings, Clock, LogOut, Building2, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: 'dashboard' | 'users' | 'towns' | 'departments' | 'reports' | 'settings' | 'officials';
}

export default function AdminLayout({ children, currentPage = 'dashboard' }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield, href: '/admin' },
    { id: 'users', label: 'User Management', icon: Users, href: '/admin/users' },
    { id: 'officials', label: 'Government Officials', icon: UserCheck, href: '/admin/officials' },
    { id: 'towns', label: 'Towns', icon: MapPin, href: '/admin/towns' },
    { id: 'departments', label: 'Departments', icon: Building2, href: '/admin/departments' },
    { id: 'reports', label: 'Reports', icon: FileText, href: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {/* Logo and Title */}
            <div className="p-4 border-b border-gray-200">
              <Link href="/admin" className="flex items-center space-x-3 mb-4">
                <div className="bg-gray-900 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">TownHall Admin</h1>
                  <p className="text-xs text-gray-500">Control Center</p>
                </div>
              </Link>
              
              {/* User Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'government' ? 'Government Official' : 'System Admin'}
                </p>
                {user?.town && (
                  <Badge className="mt-1 bg-gray-100 text-gray-700">
                    {user.town}
                  </Badge>
                )}
              </div>
            </div>

            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <Link key={item.id} href={item.href}>
                    <div className={`
                      flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}>
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Links
                </p>
                <div className="mt-1 space-y-1">
                  <Link href="/admin/users">
                    <div className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Pending Users</span>
                    </div>
                  </Link>
                  <Link href="/admin/towns">
                    <div className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Town Changes</span>
                    </div>
                  </Link>
                  <Link href="/admin/departments">
                    <div className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      <Building2 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Manage Departments</span>
                    </div>
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          {/* Logout Button at Bottom */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 w-full">
          <div className="p-4 sm:p-5">
            {children}
          </div>
        </main>
    </div>
  );
}

