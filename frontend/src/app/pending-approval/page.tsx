"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center space-y-4 pb-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Clock className="h-16 w-16 text-blue-600 animate-pulse" />
                  </div>
                </motion.div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Account Pending Approval
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Your account registration is being reviewed by government officials
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">What happens next?</p>
                      <p className="text-blue-800">
                        Government officials will review your registration details and billing address to verify your residency. You'll receive an email notification once your account has been approved.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <h3 className="font-semibold text-sm text-gray-700">Estimated Time</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">1-3 Days</p>
                      <p className="text-xs text-gray-500 mt-1">Typically processed within business hours</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <h3 className="font-semibold text-sm text-gray-700">Approved By</h3>
                      </div>
                      <p className="text-lg font-bold text-gray-900">Town Officials</p>
                      <p className="text-xs text-gray-500 mt-1">Government verified review</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      What to expect
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>Email notification when approved</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>Access to your portal dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>Ability to submit issues and reports</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>Connect with your town's government</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <p className="text-sm text-gray-600 text-center">
                      Need help or have questions?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href="/contact">
                          Contact Support
                        </Link>
                      </Button>
                      <Button variant="default" className="flex-1" asChild>
                        <Link href="/login">
                          Try Login Again
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}







