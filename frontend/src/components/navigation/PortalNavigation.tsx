"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  Shield, 
  ArrowLeft, 
  Home,
  FileText,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  User,
  ClipboardList,
  CreditCard,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  Phone,
  UserCheck,
  Gavel
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PortalNavigationProps {
  currentUserType?: "citizen" | "business" | "government";
  userName?: string;
}

export default function PortalNavigation({ currentUserType, userName }: PortalNavigationProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Determine current portal based on pathname first (for superusers), then user role
  const getCurrentPortal = () => {
    // For superusers, prioritize pathname to show the correct portal navbar
    if (pathname.startsWith("/citizen") || (!pathname.startsWith("/business") && !pathname.startsWith("/government") && user?.role === "citizen")) {
      return {
        name: "Citizen Portal",
        icon: Users,
        color: "bg-blue-600",
        description: "File complaints and provide feedback",
        role: "citizen" as const
      };
    } else if (pathname.startsWith("/business") || (!pathname.startsWith("/citizen") && !pathname.startsWith("/government") && user?.role === "business")) {
      return {
        name: "Business Portal", 
        icon: Building2,
        color: "bg-green-600",
        description: "Manage licenses and promote business",
        role: "business" as const
      };
    } else if (pathname.startsWith("/government") || (!pathname.startsWith("/citizen") && !pathname.startsWith("/business") && user?.role === "government")) {
      return {
        name: "Government Portal",
        icon: Shield,
        color: "bg-slate-700", 
        description: "Manage departments and respond to complaints",
        role: "government" as const
      };
    }
    return null;
  };

  const currentPortal = getCurrentPortal();
  // For navigation items, use portal role if pathname is specific, otherwise use user role
  const userRole = currentPortal?.role || user?.role || currentUserType;

  // Role-specific navigation items
  const getNavigationItems = () => {
    // Common emergency link
    const emergencyLink = { name: "Emergency", href: "/emergency", icon: Phone };
    
    const roleNavItems = (() => {
      switch (userRole) {
        case "citizen":
          return [
            { name: "Dashboard", href: "/citizen", icon: BarChart3 },
            { name: "Complaints", href: "/citizen/complaints", icon: FileText },
            { name: "Bills", href: "/citizen/bills", icon: Gavel },
            { name: "Services", href: "/citizen/services", icon: ClipboardList },
            { name: "Events", href: "/citizen/events", icon: Calendar },
            { name: "Notifications", href: "/citizen/notifications", icon: Bell }
          ];
        case "business":
          return [
            { name: "Dashboard", href: "/business", icon: BarChart3 },
            { name: "Applications", href: "/business/applications", icon: ClipboardList },
            { name: "Licenses", href: "/business/licenses", icon: CreditCard },
            { name: "Permits", href: "/business/permits", icon: CheckCircle },
            { name: "Events", href: "/business/events", icon: Calendar },
            { name: "Announcements", href: "/business/announcements", icon: Bell },
            { name: "Bills", href: "/business/bills", icon: Gavel }
          ];
        case "government":
          return [
            { name: "Dashboard", href: "/government", icon: BarChart3 },
            { name: "Complaints", href: "/government/complaints", icon: FileText },
            { name: "Business Applications", href: "/government/business-applications", icon: Building2 },
            { name: "Events", href: "/government/events", icon: Calendar },
            { name: "Announcements", href: "/government/announcements", icon: Bell },
            { name: "Bill Proposals", href: "/government/bills", icon: Gavel },
            { name: "Users", href: "/government/users", icon: UserCheck }
          ];
        default:
          return [];
      }
    })();
    
    // Prepend emergency link to all role navigation items
    return [emergencyLink, ...roleNavItems];
  };

  const navigationItems = getNavigationItems();

  // Improved active state logic
  const isItemActive = (itemHref: string) => {
    // Exact match
    if (pathname === itemHref) return true;
    
    // For sub-pages, only highlight if we're actually on that sub-page
    if (pathname.startsWith(itemHref + '/')) {
      // Special case: Dashboard should only be active on exact match
      if (itemHref === '/government') return false;
      return true;
    }
    
    return false;
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case "citizen": return "Citizen";
      case "business": return "Business Owner";
      case "government": return "Government Official";
      default: return "User";
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "citizen": return "bg-blue-100 text-blue-800";
      case "business": return "bg-green-100 text-green-800";
      case "government": return "bg-slate-100 text-slate-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!currentPortal) return null;

  const Icon = currentPortal.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      {/* Top strip */}
      <div className="bg-gray-800 h-1"></div>
      
      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Branding */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${currentPortal.color} rounded-lg flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TownHall</span>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = isItemActive(item.href);
              const isEmergency = item.name === "Emergency";
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isEmergency
                      ? isActive
                        ? 'text-red-700 bg-red-50'
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      : isActive
                      ? `${currentPortal.color.replace('bg-', 'text-')} bg-gray-100`
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ItemIcon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: User Info */}
          <div className="flex items-center space-x-4">
            {/* Role Badge - No hover effect */}
            <Badge className={`${getRoleColor()} px-3 py-1 text-xs font-medium`}>
              {getRoleDisplayName()}
            </Badge>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 h-auto p-2 hover:bg-gray-100 rounded-full"
                >
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {getUserInitials()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : userName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'email@example.com'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile & Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <Badge className={`${getRoleColor()} px-2 py-1 text-xs`}>
              {getRoleDisplayName()}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 h-auto p-2"
                >
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {getUserInitials()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : userName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'email@example.com'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile & Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile Navigation Links */}
          <div className="mt-2 flex flex-wrap gap-2">
            {navigationItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = isItemActive(item.href);
              const isEmergency = item.name === "Emergency";
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    isEmergency
                      ? isActive
                        ? 'text-red-700 bg-red-50'
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      : isActive
                      ? `${currentPortal.color.replace('bg-', 'text-')} bg-gray-100`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ItemIcon className="h-3 w-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
