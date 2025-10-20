"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Shield, ArrowRight, CheckCircle, Star } from "lucide-react";
import Link from "next/link";

export default function QuickAccess() {
  const portals = [
    {
      id: "citizen",
      title: "Citizen Portal",
      description: "File complaints, provide feedback, and stay informed about local issues.",
      icon: Users,
      gradient: "from-[#003153] to-[#003153]",
      bgGradient: "from-[#003153]/5 to-[#003153]/5",
      hoverGradient: "from-[#003153] to-[#003153]",
      href: "/citizen",
      features: ["File Complaints", "Track Status", "Vote on Issues", "View Announcements"],
      stats: "2,500+ Active Users"
    },
    {
      id: "business",
      title: "Business Owner Portal",
      description: "Manage licenses, file business complaints, and promote your business.",
      icon: Building2,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      hoverGradient: "from-emerald-600 to-green-600",
      href: "/business",
      features: ["License Management", "Business Complaints", "Event Promotion", "Permit Applications"],
      stats: "150+ Business Partners"
    },
    {
      id: "government",
      title: "Government Portal",
      description: "Manage departments, respond to complaints, and create announcements.",
      icon: Shield,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      hoverGradient: "from-purple-600 to-violet-600",
      href: "/government",
      features: ["Department Management", "Complaint Responses", "Public Announcements", "Service Management"],
      stats: "50+ Government Officials"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Choose Your Portal
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the portal that best describes your role in the community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.3 + index * 0.1,
                  ease: "easeOut" 
                }}
                className="group"
              >
                <Card className="h-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
                  <CardHeader className="text-center pb-6">
                    {/* Icon Container */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${portal.gradient} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {portal.title}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {portal.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {portal.features.map((feature, idx) => (
                          <li 
                            key={idx} 
                            className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                          >
                            <div className={`w-1.5 h-1.5 bg-gradient-to-r ${portal.gradient} rounded-full mr-3 flex-shrink-0`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href={portal.href} className="block">
                      <Button 
                        className={`w-full bg-gradient-to-r ${portal.gradient} hover:${portal.hoverGradient} text-white border-0 font-medium py-4 text-base`}
                      >
                        Access Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
