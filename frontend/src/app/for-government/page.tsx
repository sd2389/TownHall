"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield,
  ClipboardList,
  Users,
  BarChart,
  Megaphone,
  Settings,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Bell,
  Database,
  Zap,
  Target
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";

// Add shimmer animation
const shimmerStyle = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

export default function ForGovernmentPage() {
  const benefits = [
    {
      icon: ClipboardList,
      title: "Manage Complaints",
      description: "Centralized dashboard for all citizen requests with prioritization and assignment tools.",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: Users,
      title: "Department Coordination",
      description: "Cross-team collaboration and workflow management for seamless operations.",
      color: "bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: BarChart,
      title: "Analytics & Reports",
      description: "Data-driven insights for better decision making and resource allocation.",
      color: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      icon: Megaphone,
      title: "Public Communication",
      description: "Broadcast announcements and updates to keep citizens informed.",
      color: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      icon: Settings,
      title: "Service Management",
      description: "Track performance and optimize service delivery across departments.",
      color: "bg-cyan-100 dark:bg-cyan-900/30"
    },
    {
      icon: MessageSquare,
      title: "Citizen Feedback",
      description: "Direct engagement and feedback collection for continuous improvement.",
      color: "bg-pink-100 dark:bg-pink-900/30"
    },
    {
      icon: TrendingUp,
      title: "Performance Metrics",
      description: "Monitor KPIs and operational efficiency with real-time dashboards.",
      color: "bg-indigo-100 dark:bg-indigo-900/30"
    },
    {
      icon: CheckCircle,
      title: "Issue Resolution",
      description: "Streamlined workflow for faster response times and better outcomes.",
      color: "bg-teal-100 dark:bg-teal-900/30"
    }
  ];

  const capabilities = [
    {
      title: "Digital Transformation",
      description: "Modernize government operations with cloud-based solutions",
      icon: Zap,
      stats: "95% reduction in paperwork",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Citizen Engagement",
      description: "Increase public participation in governance and decision-making",
      icon: Users,
      stats: "300% increase in feedback",
      color: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Data-Driven Decisions",
      description: "Make informed choices based on real-time analytics and trends",
      icon: Database,
      stats: "70% improvement in efficiency",
      color: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Accountability & Transparency",
      description: "Build public trust through open, trackable processes",
      icon: Target,
      stats: "85% satisfaction rate",
      color: "bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyle }} />
      <Layout>
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"></div>
        
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white px-2">
              For Government Officials
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
              Efficient public administration with powerful tools for managing departments, responding to citizens, and making data-driven decisions.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-10 py-7 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold border-0 shadow-xl relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" style={{ backgroundPosition: '200% 0' }}></span>
                <span className="relative z-10 flex items-center">
                  Join as Official
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Officials", value: "50+" },
              { label: "Departments", value: "12+" },
              { label: "Avg. Response", value: "< 24hrs" },
              { label: "Citizen Satisfaction", value: "92%" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Administrative Excellence
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive tools for modern government operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all">
                    <CardHeader className="pb-4">
                      <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                        <Icon className="h-7 w-7 text-gray-900 dark:text-gray-100" />
                      </div>
                      <CardTitle className="text-base sm:text-lg font-bold text-center text-gray-900 dark:text-white min-h-[48px]">
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Transform Government Operations
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Achieve greater efficiency, transparency, and citizen satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-14 h-14 ${capability.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-7 w-7 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                            {capability.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-auto flex-1">
                            {capability.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-semibold mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <TrendingUp className="h-4 w-4" />
                            <span>{capability.stats}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-gray-300 dark:border-gray-600 shadow-xl">
            <CardHeader className="text-center border-b-2 border-gray-200 dark:border-gray-700 pb-6">
              <div className="w-16 h-16 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="h-8 w-8 text-white dark:text-gray-900" />
              </div>
              <CardTitle className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Ready to Improve Your Government?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Join government officials who are transforming their communities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  Get started today and streamline government operations, improve citizen engagement, and make data-driven decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      className="text-base sm:text-lg px-10 py-6 font-bold shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                        border: 'none'
                      }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" style={{ backgroundPosition: '200% 0' }}></span>
                      <span className="relative z-10 flex items-center">
                        Create Official Account
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="text-base sm:text-lg px-10 py-6 font-bold border-2"
                    >
                      Request Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </Layout>
    </>
  );
}

