"use client";

import { Shield, Home, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminNavbarProps {
  currentPage?: 'dashboard' | 'users' | 'towns' | 'reports';
}

export default function AdminNavbar({ currentPage = 'dashboard' }: AdminNavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin' },
    { id: 'users', label: 'User Management', href: '/admin/users' },
    { id: 'towns', label: 'Towns', href: '/admin/towns' },
    { id: 'reports', label: 'Reports', href: '/admin/reports' },
    // Settings hidden for now
    // { id: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">TownHall Administration</h1>
                  <p className="text-xs text-gray-400">Control Center</p>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-white hover:bg-white/10 ${
                      currentPage === item.id ? 'bg-white/20' : ''
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Right: User Info and Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400">
                  {user?.role === 'government' ? 'Government Official' : 'Administrator'}
                </p>
              </div>
              
              <Badge className="bg-white/20 text-white border-white/30 hidden sm:flex">
                {user?.town || 'System Admin'}
              </Badge>
              
              <Link href="/government">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Portal</span>
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-red-600 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full text-left text-white hover:bg-white/10 justify-start ${
                    currentPage === item.id ? 'bg-white/20' : ''
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}






