"use client";

import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Phone, Mail, FileText } from "lucide-react";

const SERVICES = [
  { icon: FileText, title: "File a Complaint", desc: "Submit a new complaint to the municipality.", action: "Start" },
  { icon: Wrench, title: "Service Request", desc: "Request maintenance or civic services.", action: "Request" },
  { icon: Phone, title: "Emergency Contacts", desc: "Essential numbers for quick help.", action: "View" },
  { icon: Mail, title: "Contact Departments", desc: "Reach out to specific departments.", action: "Contact" },
];

export default function CitizenServicesPage() {
  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Services</CardTitle>
              <CardDescription>Quick access to commonly used services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.map((s, idx) => (
                  <div key={idx} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <s.icon className="h-5 w-5 text-[#003153]" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                      </div>
                      <Button size="sm" className="bg-[#003153] hover:bg-[#003153]/90">{s.action}</Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
