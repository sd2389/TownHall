"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText,
  AlertTriangle,
  Scale,
  CheckCircle,
  XCircle,
  User,
  Shield,
  Lock,
  Mail,
  Phone
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function TermsOfServicePage() {
  const terms = [
    {
      icon: User,
      title: "User Responsibilities",
      points: [
        "Provide accurate and truthful information when creating your account",
        "Maintain the security of your account credentials",
        "Use the platform only for lawful purposes",
        "Respect the rights of other users and government officials",
        "Notify us immediately of any unauthorized account access",
        "Comply with all applicable local, state, and federal laws"
      ]
    },
    {
      icon: FileText,
      title: "Content and Communication",
      points: [
        "You are responsible for all content you submit through the platform",
        "Content must be truthful, accurate, and not misleading",
        "Do not submit offensive, discriminatory, or illegal content",
        "False or fraudulent complaints may result in legal action",
        "All communications should be professional and respectful",
        "We reserve the right to remove inappropriate content"
      ]
    },
    {
      icon: Shield,
      title: "Prohibited Activities",
      points: [
        "Unauthorized access or hacking attempts",
        "Spreading malware, viruses, or malicious code",
        "Spamming or sending unsolicited messages",
        "Impersonating government officials or other users",
        "Violating any applicable laws or regulations",
        "Reverse engineering or copying our platform technology"
      ]
    },
    {
      icon: Scale,
      title: "Service Availability",
      points: [
        "We strive to maintain 24/7 platform availability",
        "Scheduled maintenance may temporarily restrict access",
        "We are not liable for interruptions beyond our control",
        "Service may be modified or discontinued with advance notice",
        "We reserve the right to limit or terminate abusive accounts",
        "Availability is subject to technical constraints and capacity"
      ]
    },
    {
      icon: Lock,
      title: "Intellectual Property",
      points: [
        "All platform content is property of TownHall",
        "You may not reproduce content without permission",
        "User-submitted content grants us limited usage rights",
        "Logos and trademarks are protected by law",
        "Third-party content is used with proper licensing",
        "Report copyright violations to legal@townhall.gov"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Disclaimer of Warranties",
      points: [
        "Platform is provided 'as is' without warranties",
        "We do not guarantee error-free operation",
        "We are not responsible for third-party content",
        "Service may not meet all individual requirements",
        "Data loss is not our responsibility - maintain backups",
        "Use platform at your own risk"
      ]
    }
  ];

  const importantNotes = [
    {
      title: "Account Termination",
      description: "We may suspend or terminate accounts that violate these terms. Appeals can be submitted within 30 days."
    },
    {
      title: "Governing Law",
      description: "These terms are governed by state and federal laws. Disputes will be resolved through appropriate legal channels."
    },
    {
      title: "Limitation of Liability",
      description: "TownHall is not liable for indirect, incidental, or consequential damages resulting from platform use."
    },
    {
      title: "Changes to Terms",
      description: "We may update these terms periodically. Continued use constitutes acceptance of modified terms."
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
              <Scale className="h-8 w-8 sm:h-10 sm:w-10 text-gray-900 dark:text-gray-100" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white px-2">
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed max-w-3xl mx-auto px-2">
              Please read these terms carefully before using our platform
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
                  <Scale className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">Agreement to Terms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing or using the TownHall platform, you agree to be bound by these Terms of Service and 
                all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                from using or accessing the platform.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                These terms apply to all visitors, users, and others who access or use the service. Your use of 
                the platform constitutes your acceptance of these terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Important Terms */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
              Terms and Conditions
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Comprehensive terms for platform usage
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {terms.map((term, index) => {
              const Icon = term.icon;
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
                            {term.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {term.points.map((point, idx) => (
                          <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${
                            idx % 2 === 0 
                              ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
                              : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500'
                          }`}>
                            {idx % 2 === 0 ? (
                              <CheckCircle className="h-5 w-5 text-gray-900 dark:text-gray-100 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-700 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                            )}
                            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{point}</span>
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

      {/* Important Notes */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
              Important Information
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Key details you should know
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {importantNotes.map((note, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <AlertTriangle className="h-6 w-6 text-white dark:text-gray-900" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl font-bold">{note.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{note.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Acceptance Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 border-gray-300 dark:border-gray-600 shadow-lg">
            <CardHeader className="border-b-2 border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white dark:text-gray-900" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold">Acceptance of Terms</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Your use of this platform</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                By clicking "Sign Up" or using the TownHall platform, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                These terms may be updated from time to time. We will notify users of significant changes through 
                platform notifications or email. Continued use of the service after changes constitutes acceptance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 border-gray-300 dark:border-gray-600 shadow-xl">
            <CardHeader className="border-b-2 border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">Questions About These Terms?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                If you have questions about these Terms of Service, please contact our legal department:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <a href="mailto:legal@townhall.gov" className="text-gray-900 dark:text-white font-bold hover:underline text-sm sm:text-base">
                      legal@townhall.gov
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
    </Layout>
  );
}

