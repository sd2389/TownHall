"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield,
  Lock,
  Eye,
  FileText,
  Calendar,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        "Personal identification information (name, email, phone number)",
        "Address and location information for service delivery",
        "Government ID numbers for verification purposes",
        "Business registration details for business accounts",
        "Usage data and platform activity logs",
        "Communication records with government officials"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To process and respond to your complaints and service requests",
        "To verify your identity and prevent fraud",
        "To improve our platform and user experience",
        "To send important notifications about your requests",
        "To comply with legal and regulatory requirements",
        "To generate anonymous statistics and reports"
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        "We share your information only with authorized government officials",
        "Information is shared strictly for the purpose of processing your requests",
        "We do not sell your personal information to third parties",
        "Aggregate, anonymized data may be used for city planning and improvement",
        "Legal authorities may access information when required by law",
        "All information sharing follows strict data protection protocols"
      ]
    },
    {
      icon: FileText,
      title: "Data Security",
      content: [
        "Industry-standard encryption for data transmission (SSL/TLS)",
        "Secure storage with regular security audits",
        "Access controls limiting data access to authorized personnel only",
        "Regular security training for all staff members",
        "Incident response procedures for data breaches",
        "Regular backups and disaster recovery planning"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Right to access your personal information",
        "Right to correct inaccurate data",
        "Right to request deletion of your account",
        "Right to data portability",
        "Right to object to certain processing",
        "Right to file complaints with regulatory authorities"
      ]
    },
    {
      icon: Calendar,
      title: "Data Retention",
      content: [
        "Active accounts: Data retained while account is active",
        "Closed accounts: Data retained for 7 years for legal compliance",
        "Complaint records: Retained according to legal requirements",
        "Financial records: Retained as required by tax and financial regulations",
        "You can request data deletion at any time",
        "Some data may be retained longer if legally required"
      ]
    }
  ];

  const keyPoints = [
    {
      title: "GDPR Compliant",
      description: "We follow European General Data Protection Regulation standards"
    },
    {
      title: "HIPAA Compliant",
      description: "Healthcare information is protected per HIPAA requirements"
    },
    {
      title: "Regular Audits",
      description: "Third-party security audits conducted annually"
    },
    {
      title: "User Control",
      description: "You control your data and privacy settings"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"></div>
        
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-gray-900 dark:text-gray-100" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white px-2">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed max-w-3xl mx-auto px-2">
              Your privacy and data security are our top priorities
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: January 15, 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 border-gray-300 dark:border-gray-600 shadow-xl">
            <CardHeader className="pb-4 border-b-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">Introduction</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                At TownHall, we are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, share, and safeguard your information when you 
                use our platform.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. 
                We will not use or share your information except as described in this Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
              Key Privacy Commitments
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Our promise to protect your data
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {keyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      <Shield className="h-7 w-7 text-white dark:text-gray-900" />
                    </div>
                    <h3 className="font-bold text-base mb-3 text-gray-900 dark:text-white">{point.title}</h3>
                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{point.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
              Privacy Details
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Comprehensive information about our privacy practices
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                    <CardHeader className="border-b-2 border-gray-100 dark:border-gray-700 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center shadow-md">
                          <Icon className="h-8 w-8 text-white dark:text-gray-900" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {section.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.content.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <CheckCircle className="h-5 w-5 text-gray-900 dark:text-gray-100 flex-shrink-0 mt-0.5" />
                            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cookies & Tracking */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 border-gray-300 dark:border-gray-600 shadow-xl">
            <CardHeader className="border-b-2 border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">Cookies and Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900 dark:text-white">What are Cookies?</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Cookies are small text files placed on your device to enhance your browsing experience and provide 
                  personalized services.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-base sm:text-lg mb-3 text-gray-900 dark:text-white">Types of Cookies We Use</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <span className="font-bold text-gray-900 dark:text-white">Essential Cookies:</span>
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Required for the platform to function properly</span>
                  </li>
                  <li className="flex items-start gap-3 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <span className="font-bold text-gray-900 dark:text-white">Analytics Cookies:</span>
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Help us understand how you use the platform (anonymized)</span>
                  </li>
                  <li className="flex items-start gap-3 p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <span className="font-bold text-gray-900 dark:text-white">Preference Cookies:</span>
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Remember your settings and preferences</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900 dark:text-white">Managing Cookies</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  You can control cookie settings through your browser preferences. Note that disabling certain cookies 
                  may affect platform functionality.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 border-gray-300 dark:border-gray-600 shadow-xl">
            <CardHeader className="border-b-2 border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold">Privacy Questions or Concerns?</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Contact our Privacy Officer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                If you have questions about this Privacy Policy or how we handle your personal information, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <a href="mailto:privacy@townhall.gov" className="text-gray-900 dark:text-white font-bold hover:underline text-sm sm:text-base">
                      privacy@townhall.gov
                    </a>
                  </div>
                </div>
                <div className="p-5 bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                    <span className="text-gray-900 dark:text-white font-bold text-sm sm:text-base">(555) 123-4567</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Changes to Privacy Policy */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 border-gray-300 dark:border-gray-600 shadow-lg">
            <CardHeader className="border-b-2 border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold">Changes to This Privacy Policy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to 
                review this Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

