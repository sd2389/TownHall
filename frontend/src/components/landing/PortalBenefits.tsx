"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building2, 
  Shield, 
  CheckCircle,
  ArrowRight,
  FileText,
  MessageSquare,
  Calendar,
  Globe,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Briefcase,
  FileCheck,
  Megaphone,
  BarChart,
  Mail,
  ClipboardList,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function PortalBenefits() {
  const portals = [
    {
      id: "citizen",
      title: "Citizen Portal",
      subtitle: "Your voice, heard and acted upon",
      description: "Engage with your community, report issues, and track their resolution in real-time. Participate in local governance and stay informed about what matters to you.",
      icon: Users,
      stats: "2,500+ Active Citizens",
      ctaText: "Join as Citizen",
      ctaLink: "/signup",
      gradient: "from-[#003153] to-[#003153]",
      benefits: [
        {
          icon: FileText,
          title: "File & Track Complaints",
          description: "Report issues quickly with real-time status tracking"
        },
        {
          icon: MessageSquare,
          title: "Vote on Proposals",
          description: "Participate in community decisions and bill proposals"
        },
        {
          icon: Calendar,
          title: "Access Services",
          description: "Request services 24/7 with instant notifications"
        },
        {
          icon: Megaphone,
          title: "View Announcements",
          description: "Stay informed about local news and updates"
        },
        {
          icon: Users,
          title: "Community Engagement",
          description: "Connect with neighbors and participate in discussions"
        },
        {
          icon: BarChart,
          title: "Transparent Process",
          description: "Track everything from submission to resolution"
        },
        {
          icon: AlertCircle,
          title: "Priority Issues",
          description: "Get faster responses for urgent matters"
        },
        {
          icon: TrendingUp,
          title: "Track Progress",
          description: "See how your complaints are being resolved"
        }
      ]
    },
    {
      id: "business",
      title: "Business Owner Portal",
      subtitle: "Streamline your business operations",
      description: "Manage licenses, permits, and business services all in one place. Get dedicated support for your business needs and connect with your community.",
      icon: Building2,
      stats: "150+ Business Partners",
      ctaText: "Join as Business",
      ctaLink: "/signup",
      gradient: "from-green-600 to-green-600",
      benefits: [
        {
          icon: FileCheck,
          title: "License Management",
          description: "Streamlined applications and renewals"
        },
        {
          icon: Briefcase,
          title: "Permit Applications",
          description: "Fast-track processing for all business permits"
        },
        {
          icon: MessageSquare,
          title: "Business Complaints",
          description: "Dedicated support channel for business issues"
        },
        {
          icon: Megaphone,
          title: "Event Promotion",
          description: "Reach the community with your events"
        },
        {
          icon: Calendar,
          title: "Compliance Tracking",
          description: "Stay updated on regulations and deadlines"
        },
        {
          icon: Lightbulb,
          title: "Business Resources",
          description: "Access guides, tools, and support materials"
        },
        {
          icon: BarChart,
          title: "Performance Analytics",
          description: "Track your business metrics and growth"
        },
        {
          icon: Users,
          title: "Market Insights",
          description: "Understand your customer base and trends"
        }
      ]
    },
    {
      id: "government",
      title: "Government Portal",
      subtitle: "Efficient public administration",
      description: "Manage departments, respond to citizen needs, and make data-driven decisions. Improve transparency and citizen satisfaction with powerful tools.",
      icon: Shield,
      stats: "50+ Government Officials",
      ctaText: "Join as Official",
      ctaLink: "/signup",
      gradient: "from-purple-600 to-purple-600",
      benefits: [
        {
          icon: ClipboardList,
          title: "Manage Complaints",
          description: "Centralized dashboard for all citizen requests"
        },
        {
          icon: Users,
          title: "Department Coordination",
          description: "Cross-team collaboration and workflow management"
        },
        {
          icon: BarChart,
          title: "Analytics & Reports",
          description: "Data-driven insights for better decision making"
        },
        {
          icon: Megaphone,
          title: "Public Communication",
          description: "Broadcast announcements and updates"
        },
        {
          icon: Settings,
          title: "Service Management",
          description: "Track performance and optimize service delivery"
        },
        {
          icon: MessageSquare,
          title: "Citizen Feedback",
          description: "Direct engagement and feedback collection"
        },
        {
          icon: TrendingUp,
          title: "Performance Metrics",
          description: "Monitor KPIs and operational efficiency"
        },
        {
          icon: CheckCircle,
          title: "Issue Resolution",
          description: "Streamlined workflow for faster response times"
        }
      ]
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Choose Your Portal
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the benefits and features tailored for your role
          </p>
        </motion.div>

        {/* Portal Sections */}
        <div className="space-y-20 sm:space-y-24">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={portal.id}
                id={`${portal.id}-benefits`}
                className="scroll-mt-20"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="border-2 border-gray-300 dark:border-gray-600 shadow-xl overflow-hidden">
                  {/* Header Section */}
                  <CardHeader className="border-b-2 border-gray-200 dark:border-gray-700 pb-6 sm:p-8">
                    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}>
                      {/* Icon */}
                      <div className="w-24 h-24 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Icon className="h-12 w-12 text-white dark:text-gray-900" />
                      </div>
                      
                      {/* Text Content */}
                      <div className={`flex-1 text-center ${isEven ? 'lg:text-left' : 'lg:text-right'}`}>
                        <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {portal.stats}
                          </span>
                        </div>
                        <CardTitle className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
                          {portal.title}
                        </CardTitle>
                        <CardDescription className="text-lg mb-4 text-gray-600 dark:text-gray-400">
                          {portal.subtitle}
                        </CardDescription>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                          {portal.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Benefits Grid */}
                  <CardContent className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                      {portal.benefits.map((benefit, idx) => {
                        const BenefitIcon = benefit.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            whileHover={{ y: -4 }}
                          >
                            <div className="h-full p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all group">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BenefitIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                              </div>
                              <h3 className="font-bold text-sm sm:text-base mb-2 text-gray-900 dark:text-white">
                                {benefit.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {benefit.description}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* CTA Button */}
                    <div className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                      <Link href={portal.ctaLink}>
                        <Button 
                          size="lg" 
                          className={`text-base sm:text-lg px-8 py-6 font-bold shadow-lg hover:shadow-xl transition-all`}
                          style={{ 
                            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                            border: 'none'
                          }}
                        >
                          {portal.ctaText}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
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


































