"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText,
  MessageSquare,
  Calendar,
  Megaphone,
  BarChart,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Bell,
  Heart,
  TrendingDown
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

export default function ForCitizensPage() {
  const benefits = [
    {
      icon: FileText,
      title: "File & Track Complaints",
      description: "Report issues quickly with real-time status tracking. Get instant confirmation and updates as your complaint is processed.",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: MessageSquare,
      title: "Vote on Proposals",
      description: "Participate in community decisions and bill proposals. Your voice matters in shaping local policies.",
      color: "bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: Calendar,
      title: "Access Services",
      description: "Request services 24/7 with instant notifications. No more waiting in lines or missing important deadlines.",
      color: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      icon: Megaphone,
      title: "View Announcements",
      description: "Stay informed about local news, events, and government updates directly from your dashboard.",
      color: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      icon: Users,
      title: "Community Engagement",
      description: "Connect with neighbors and participate in discussions about issues affecting your community.",
      color: "bg-pink-100 dark:bg-pink-900/30"
    },
    {
      icon: BarChart,
      title: "Transparent Process",
      description: "Track everything from submission to resolution. Complete transparency in government operations.",
      color: "bg-indigo-100 dark:bg-indigo-900/30"
    },
    {
      icon: AlertCircle,
      title: "Priority Issues",
      description: "Get faster responses for urgent matters that affect public safety and community health.",
      color: "bg-red-100 dark:bg-red-900/30"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "See how your complaints are being resolved with detailed status updates and official responses.",
      color: "bg-cyan-100 dark:bg-cyan-900/30"
    }
  ];

  const useCases = [
    {
      title: "Report Potholes",
      description: "Document road issues with photos and see them fixed quickly",
      stats: "2,300+ reports resolved this year",
      icon: FileText,
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Street Lighting",
      description: "Request repairs to broken street lights in your neighborhood",
      stats: "Average resolution time: 3-5 days",
      icon: AlertCircle,
      color: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      title: "Community Events",
      description: "Stay updated about local events, meetings, and public hearings",
      stats: "150+ events posted monthly",
      icon: Calendar,
      color: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Public Safety",
      description: "Report safety concerns and receive priority response",
      stats: "24/7 monitoring and response",
      icon: Shield,
      color: "bg-red-100 dark:bg-red-900/30"
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
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white px-2">
              For Citizens
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
              Your voice matters. Engage with your community, report issues, and watch them get resolved.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-10 py-7 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold border-0 shadow-xl relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" style={{ backgroundPosition: '200% 0' }}></span>
                <span className="relative z-10 flex items-center">
                  Join as Citizen
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
              { label: "Active Citizens", value: "2,500+" },
              { label: "Issues Resolved", value: "1,200+" },
              { label: "Response Time", value: "< 48hrs" },
              { label: "Satisfaction", value: "4.8/5" }
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
              Why Join as a Citizen?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover how our platform empowers you to make a difference in your community
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
                      <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-md`}>
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

      {/* Use Cases Section */}
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
              Real-World Use Cases
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See how other citizens are using the platform to improve their communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
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
                        <div className={`w-14 h-14 ${useCase.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <Icon className="h-7 w-7 text-gray-900 dark:text-gray-100" />
                        </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          {useCase.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-auto flex-1">
                          {useCase.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-semibold">{useCase.stats}</span>
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
                <Heart className="h-8 w-8 text-white dark:text-gray-900" />
              </div>
              <CardTitle className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Ready to Make a Difference?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Join thousands of citizens who are actively improving their communities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                  Get started today and start participating in local governance, reporting issues, and tracking their resolution.
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
                        Create Your Account
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
                      Learn More
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

