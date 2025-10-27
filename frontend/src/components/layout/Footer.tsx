"use client";

import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-muted/50 border-t"
    >
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Building2 className="h-6 w-6" />
              <span className="text-xl font-bold">TownHall</span>
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Connecting citizens, businesses, and government for better community engagement.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Portals</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/for-citizens" className="hover:text-foreground transition-colors">
                  Citizen Portal
                </Link>
              </li>
              <li>
                <Link href="/for-businesses" className="hover:text-foreground transition-colors">
                  Business Portal
                </Link>
              </li>
              <li>
                <Link href="/for-government" className="hover:text-foreground transition-colors">
                  Government Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@townhall.gov" className="hover:text-foreground transition-colors">
                  contact@townhall.gov
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+15551234567" className="hover:text-foreground transition-colors">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=123+Government+St+City" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  123 Government St, City
                </a>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground"
        >
          <p>&copy; 2024 TownHall. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
