"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  Search,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Users,
  Shield,
  Building2
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import Link from "next/link";

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const quickGuides = [
    {
      title: "Getting Started",
      description: "Learn the basics of using TownHall platform",
      icon: BookOpen,
      href: "/help/getting-started",
      count: "5 articles"
    },
    {
      title: "Filing Complaints",
      description: "Complete guide to submitting complaints",
      icon: FileText,
      href: "/help/filing-complaints",
      count: "8 articles"
    },
    {
      title: "Business Services",
      description: "Everything about permits and licenses",
      icon: Building2,
      href: "/help/business-services",
      count: "12 articles"
    },
    {
      title: "Government Portal",
      description: "Managing your government dashboard",
      icon: Shield,
      href: "/help/government-portal",
      count: "7 articles"
    }
  ];

  const videoGuides = [
    {
      title: "How to File Your First Complaint",
      duration: "5:23",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400"
    },
    {
      title: "Understanding Proposal Voting",
      duration: "4:15",
      thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400"
    },
    {
      title: "Business License Application",
      duration: "6:42",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400"
    }
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click the 'Sign Up' button on the homepage. You'll need to provide your email, password, and select your account type (citizen, business, or government). Complete the registration form and verify your email address."
    },
    {
      question: "What information do I need to file a complaint?",
      answer: "When filing a complaint, you should provide: the location of the issue, a clear description with photos if possible, your contact information, and any relevant details that will help officials address the problem effectively."
    },
    {
      question: "How long does it take to process permits?",
      answer: "Processing times vary by permit type. Simple permits typically take 2-3 business days, standard permits 5-7 business days, and complex permits may take 10-14 business days. You'll receive email notifications at each stage."
    },
    {
      question: "Can I track the status of my complaint?",
      answer: "Yes! Log into your Citizen Portal dashboard and click on 'My Complaints'. You'll see real-time status updates, comments from officials, and can add additional information or photos to support your case."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your profile page (click your name in the top right corner), then click 'Edit Profile'. Make your changes and click 'Save Changes'. Your updated information is saved immediately."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "Click 'Forgot Password' on the login page. Enter your email address and you'll receive a password reset link. Follow the instructions in the email to create a new password."
    },
    {
      question: "How can businesses apply for licenses?",
      answer: "Navigate to the Business Portal and select 'Apply for License'. Fill out the required application form, upload necessary documents, and submit. You'll receive a confirmation email with your application tracking number."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your data. Only authorized government officials directly involved in processing your requests have access to your information. Read our Privacy Policy for more details."
    }
  ];

  const contactOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      available: "Available 9 AM - 5 PM EST",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email anytime",
      available: "support@townhall.gov",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us directly",
      available: "Mon-Fri: 9 AM - 5 PM",
      action: "Call Now"
    }
  ];

  const resources = [
    {
      title: "Knowledge Base",
      description: "Browse articles and guides",
      icon: BookOpen,
      count: "50+ articles"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      icon: Video,
      count: "20+ videos"
    },
    {
      title: "Community Forum",
      description: "Ask questions and share tips",
      icon: Users,
      count: "2,500+ members"
    },
    {
      title: "Status Updates",
      description: "Check system status and maintenance",
      icon: Info,
      count: "Real-time"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"></div>
        
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 sm:h-10 sm:w-10 text-gray-900 dark:text-gray-100" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white px-2">
              Help Center
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
              Find answers to common questions or get in touch with our support team
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-gray-500 dark:focus:border-gray-500 focus:outline-none text-sm sm:text-base"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">
            Quick Access
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickGuides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                      </div>
                      <CardTitle className="text-lg font-bold mb-2">{guide.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{guide.count}</span>
                        <ArrowRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Video className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900 dark:text-gray-100" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">Video Tutorials</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Watch step-by-step video guides</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoGuides.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all overflow-hidden">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{video.duration}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Quick answers to the most common questions</p>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-4 sm:p-6 text-left"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white pr-4 flex-1 text-left">
                        {faq.question}
                      </h3>
                      <ChevronDown 
                        className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0 mt-0.5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, maxHeight: 0 }}
                        animate={{ opacity: 1, maxHeight: 1000 }}
                        exit={{ opacity: 0, maxHeight: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 overflow-hidden"
                      >
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">Still Need Help?</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Get in touch with our support team</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                      </div>
                      <CardTitle className="text-xl font-bold mb-2">{option.title}</CardTitle>
                      <CardDescription className="text-sm">{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{option.available}</p>
                      <Button 
                        variant="outline" 
                        className="w-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">
            Additional Resources
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                      </div>
                      <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white">{resource.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{resource.description}</p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{resource.count}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

