"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Users, Shield, Menu, X, Home, Phone } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  userType?: "citizen" | "business" | "government";
  userName?: string;
  userEmail?: string;
}

export default function Header({ userType, userName, userEmail }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getIcon = () => {
    switch (userType) {
      case "citizen":
        return <Users className="h-6 w-6" />;
      case "business":
        return <Building2 className="h-6 w-6" />;
      case "government":
        return <Shield className="h-6 w-6" />;
      default:
        return <Building2 className="h-6 w-6" />;
    }
  };

  const getBadgeColor = () => {
    switch (userType) {
      case "citizen":
        return "bg-[#003153]/10 text-[#003153]";
      case "business":
        return "bg-green-100 text-green-800";
      case "government":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBadgeText = () => {
    switch (userType) {
      case "citizen":
        return "Citizen";
      case "business":
        return "Business Owner";
      case "government":
        return "Government Official";
      default:
        return "User";
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-1 sm:space-x-2"
        >
          <div className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center">
            {getIcon()}
          </div>
          <span className="text-lg sm:text-xl font-bold">TownHall</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <Button variant="ghost" className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/emergency">
            <Button variant="ghost" className="text-sm font-medium flex items-center gap-2 text-red-600 hover:text-red-700">
              <Phone className="h-4 w-4" />
              Emergency
            </Button>
          </Link>
          {userType === "citizen" ? (
            <>
              <Link href="/citizen/complaints"><Button variant="ghost" className="text-sm font-medium">My Complaints</Button></Link>
              <Link href="/citizen/file-new"><Button variant="ghost" className="text-sm font-medium">File New</Button></Link>
              <Link href="/citizen/services"><Button variant="ghost" className="text-sm font-medium">Services</Button></Link>
              <Link href="/citizen/notifications"><Button variant="ghost" className="text-sm font-medium">Notifications</Button></Link>
            </>
          ) : userType === "business" ? (
            <>
              <Link href="/business">
                <Button variant="ghost" className="text-sm font-medium">
                  Dashboard
                </Button>
              </Link>
              <Link href="/business/licenses">
                <Button variant="ghost" className="text-sm font-medium">
                  Licenses
                </Button>
              </Link>
              <Link href="/business/permits">
                <Button variant="ghost" className="text-sm font-medium">
                  Permits
                </Button>
              </Link>
              <Link href="/business/events">
                <Button variant="ghost" className="text-sm font-medium">
                  Events
                </Button>
              </Link>
              <Link href="/business/applications">
                <Button variant="ghost" className="text-sm font-medium">
                  Applications
                </Button>
              </Link>
            </>
          ) : userType === "government" ? (
            <>
              <Link href="/government">
                <Button variant="ghost" className="text-sm font-medium">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" className="text-sm font-medium bg-purple-100 hover:bg-purple-200">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin Panel
                </Button>
              </Link>
              <Link href="/government/complaints">
                <Button variant="ghost" className="text-sm font-medium">
                  Complaints
                </Button>
              </Link>
              <Link href="/government/announcements">
                <Button variant="ghost" className="text-sm font-medium">
                  Announcements
                </Button>
              </Link>
              <Link href="/government/reports">
                <Button variant="ghost" className="text-sm font-medium">
                  Reports
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/for-citizens">
                <Button variant="ghost" className="text-sm font-medium">
                  For Citizens
                </Button>
              </Link>
              <Link href="/for-businesses">
                <Button variant="ghost" className="text-sm font-medium">
                  For Businesses
                </Button>
              </Link>
              <Link href="/for-government">
                <Button variant="ghost" className="text-sm font-medium">
                  For Government
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="text-sm font-medium">
                  Contact
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">
                  Login
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {userType && (
            <Badge className={`${getBadgeColor()} text-xs hidden sm:inline-flex`}>
              {getBadgeText()}
            </Badge>
          )}
          
          {userName ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                    <AvatarFallback className="text-xs">
                      {userName.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Login
              </Button>
              <Button size="sm" className="text-xs sm:text-sm">
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-8 w-8 p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t bg-background"
        >
          <div className="container px-3 py-3 space-y-1">
            {userType && (
              <div className="px-3 py-2 mb-2">
                <Badge className={`${getBadgeColor()} text-xs`}>
                  {getBadgeText()}
                </Badge>
                {userName && (
                  <p className="text-sm text-muted-foreground mt-1">Welcome, {userName}</p>
                )}
              </div>
            )}
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-sm flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/emergency">
              <Button variant="ghost" className="w-full justify-start text-sm flex items-center gap-2 text-red-600">
                <Phone className="h-4 w-4" />
                Emergency
              </Button>
            </Link>
            {userType === "citizen" ? (
              <>
                <Link href="/citizen/complaints"><Button variant="ghost" className="w-full justify-start text-sm">My Complaints</Button></Link>
                <Link href="/citizen/file-new"><Button variant="ghost" className="w-full justify-start text-sm">File New</Button></Link>
                <Link href="/citizen/services"><Button variant="ghost" className="w-full justify-start text-sm">Services</Button></Link>
                <Link href="/citizen/notifications"><Button variant="ghost" className="w-full justify-start text-sm">Notifications</Button></Link>
              </>
            ) : userType === "business" ? (
              <>
                <Link href="/business">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/business/licenses">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Licenses
                  </Button>
                </Link>
                <Link href="/business/permits">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Permits
                  </Button>
                </Link>
                <Link href="/business/events">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Events
                  </Button>
                </Link>
                <Link href="/business/applications">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Applications
                  </Button>
                </Link>
              </>
            ) : userType === "government" ? (
              <>
                <Link href="/government">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="ghost" className="w-full justify-start text-sm bg-purple-100">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
                <Link href="/government/complaints">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Complaints
                  </Button>
                </Link>
                <Link href="/government/announcements">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Announcements
                  </Button>
                </Link>
                <Link href="/government/reports">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Reports
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/for-citizens">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    For Citizens
                  </Button>
                </Link>
                <Link href="/for-businesses">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    For Businesses
                  </Button>
                </Link>
                <Link href="/for-government">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    For Government
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Contact
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
