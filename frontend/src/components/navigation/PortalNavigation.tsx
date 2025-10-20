"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PortalNavigationProps {
  currentUserType?: "citizen" | "business" | "government";
  userName?: string;
}

export default function PortalNavigation({ currentUserType, userName }: PortalNavigationProps) {
  const pathname = usePathname();

  const getCurrentPortal = () => {
    if (pathname.startsWith("/citizen")) {
      return {
        name: "Citizen Portal",
        icon: Users,
        color: "bg-[#003153]",
        description: "File complaints and provide feedback"
      };
    } else if (pathname.startsWith("/business")) {
      return {
        name: "Business Portal",
        icon: Building2,
        color: "bg-green-500",
        description: "Manage licenses and promote business"
      };
    } else if (pathname.startsWith("/government")) {
      return {
        name: "Government Portal",
        icon: Shield,
        color: "bg-purple-500",
        description: "Manage departments and respond to complaints"
      };
    }
    return null;
  };

  const currentPortal = getCurrentPortal();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <div className="container mx-auto px-4 py-3 sm:py-4">
        {/* Mobile Layout */}
        <div className="flex flex-col space-y-3 sm:hidden">
          {/* Top Row - Back and Portal Info */}
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs">
                <ArrowLeft className="h-3 w-3" />
                Back to Home
              </Button>
            </Link>
            
            {userName && (
              <Badge variant="outline" className="text-xs">
                Welcome, {userName}
              </Badge>
            )}
          </div>

          {/* Current Portal Info */}
          {currentPortal && (
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 ${currentPortal.color} rounded-full flex items-center justify-center`}>
                <currentPortal.icon className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm truncate">{currentPortal.name}</h2>
                <p className="text-xs text-muted-foreground truncate">{currentPortal.description}</p>
              </div>
            </div>
          )}

        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Back to Home */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Current Portal Info */}
          {currentPortal && (
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${currentPortal.color} rounded-full flex items-center justify-center`}>
                <currentPortal.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{currentPortal.name}</h2>
                <p className="text-sm text-muted-foreground">{currentPortal.description}</p>
              </div>
              {userName && (
                <Badge variant="outline" className="ml-2">
                  Welcome, {userName}
                </Badge>
              )}
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
