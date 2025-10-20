"use client";

import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import PortalNavigation from "../navigation/PortalNavigation";

interface LayoutProps {
  children: React.ReactNode;
  userType?: "citizen" | "business" | "government";
  userName?: string;
  userEmail?: string;
  showPortalNav?: boolean;
}

export default function Layout({ 
  children, 
  userType, 
  userName, 
  userEmail,
  showPortalNav = false
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userType={userType} userName={userName} userEmail={userEmail} />
      
      {showPortalNav && (
        <PortalNavigation currentUserType={userType} userName={userName} />
      )}
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1"
      >
        {children}
      </motion.main>
      
      <Footer />
    </div>
  );
}
