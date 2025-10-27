"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Phone, Mail, FileText, Zap, ArrowRight } from "lucide-react";

const SERVICES = [
  { icon: FileText, title: "File a Complaint", desc: "Submit a new complaint to the municipality.", action: "Start" },
  { icon: Wrench, title: "Service Request", desc: "Request maintenance or civic services.", action: "Request" },
  { icon: Phone, title: "Emergency Contacts", desc: "Essential numbers for quick help.", action: "View" },
  { icon: Mail, title: "Contact Departments", desc: "Reach out to specific departments.", action: "Contact" },
];

export default function CitizenServicesPage() {
  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-[#003153] to-[#003153]/90 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-8 w-8 text-white" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Citizen Services
                </h1>
              </div>
              <p className="text-blue-100 text-sm sm:text-base">
                Quick access to commonly used municipal services
              </p>
            </div>
          </motion.div>

          <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#003153] rounded-full animate-pulse"></div>
                <CardTitle className="text-xl font-bold">Available Services</CardTitle>
              </div>
              <CardDescription className="text-sm">Choose a service to get started</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {SERVICES.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#003153] to-[#003153]/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{s.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{s.desc}</p>
                      <Button 
                        size="lg" 
                        className="w-full bg-[#003153] hover:bg-[#003153]/90 font-semibold shadow-md group-hover:shadow-lg transition-shadow"
                        onClick={() => alert(`Redirecting to ${s.title}...`)}
                      >
                        {s.action} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
