"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send,
  Clock,
  CheckCircle,
  Users,
  Shield,
  Headphones,
  ChevronDown,
  AlertCircle,
  HelpCircle,
  Briefcase
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "general",
    priority: "medium",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", category: "general", priority: "medium", message: "" });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      primaryValue: "support@townhall.gov",
      secondaryValue: "info@townhall.gov",
      href: "mailto:support@townhall.gov"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Monday to Friday, 9 AM to 5 PM",
      primaryValue: "+1 (555) 123-4567",
      secondaryValue: "Mon-Fri: 9:00 AM - 5:00 PM",
      href: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come to our office",
      primaryValue: "123 Main Street",
      secondaryValue: "City Center, State 12345",
      href: "#"
    },
  ];

  const departments = [
    { name: "Citizen Services", email: "citizens@townhall.gov", phone: "(555) 123-4567", icon: Users },
    { name: "Business & Permits", email: "business@townhall.gov", phone: "(555) 123-4568", icon: Briefcase },
    { name: "Government Affairs", email: "govaffairs@townhall.gov", phone: "(555) 123-4569", icon: Shield },
    { name: "IT Support", email: "itsupport@townhall.gov", phone: "(555) 123-4570", icon: HelpCircle },
  ];

  const faqs = [
    {
      question: "How do I report an issue or file a complaint?",
      answer: "You can file a complaint through the Citizen Portal by clicking 'File New Complaint' on your dashboard. Fill out the form with details about the issue, location, and attach any supporting photos."
    },
    {
      question: "How long does it take to process permits?",
      answer: "Permit processing time varies by type. Simple permits take 2-3 business days, while more complex permits may take 7-10 business days. You'll receive status updates via email."
    },
    {
      question: "How can I track my complaint status?",
      answer: "Log into your Citizen Portal dashboard and navigate to 'My Complaints'. You'll see real-time status updates and can add comments or upload additional information."
    },
    {
      question: "What documents do I need for business registration?",
      answer: "You'll need: Business license application, proof of identity, proof of address, business plan, and any required professional licenses specific to your industry."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your profile page (accessible from the top right menu), click 'Edit Profile', make your changes, and save. Your updated information will be reflected immediately."
    },
    {
      question: "Who can access my personal information?",
      answer: "Only authorized government officials directly involved in processing your requests have access to your information. We follow strict data protection and privacy policies."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"></div>
        
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white px-2">
              Get in Touch
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
              Have a question or need help? We're here to assist you. Connect with our dedicated team through multiple channels and get the support you need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white px-2">Contact Methods</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Choose the best way to reach us</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <CardHeader>
                      <div className="w-14 h-14 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                        <Icon className="h-7 w-7 text-white dark:text-gray-900" />
                      </div>
                      <CardTitle className="text-xl font-bold mb-2">{info.title}</CardTitle>
                      <CardDescription className="text-sm">{info.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <a 
                          href={info.href} 
                          className="block text-gray-900 dark:text-white font-semibold hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                        >
                          {info.primaryValue}
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {info.secondaryValue}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Department Contacts */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white px-2">Department Contacts</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">Get in touch with the right department for your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">{dept.name}</h3>
                          <div className="space-y-2">
                            <a href={`mailto:${dept.email}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                              <Mail className="h-4 w-4" />
                              {dept.email}
                            </a>
                            <a href={`tel:${dept.phone}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                              <Phone className="h-4 w-4" />
                              {dept.phone}
                            </a>
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

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Side - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 order-2 lg:order-1"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Fill out the form and our team will get back to you as soon as possible. We're here to help!
              </p>

              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Fast Response</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      We respond to most inquiries within 24-48 hours during business days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Stay Informed</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      You'll receive updates about the status of your inquiry via email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Expert Support</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      Our team of specialists is ready to assist you with any questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Emergency?</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      For urgent matters, call our emergency line at{" "}
                      <a href="tel:+15551234567" className="font-semibold text-gray-900 dark:text-white hover:underline">
                        (555) 123-4567
                      </a>
                      {" "}available 24/7
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 order-1 lg:order-2"
            >
              <Card className="shadow-xl border border-gray-200 dark:border-gray-700">
                <CardHeader className="border-b pb-4 sm:pb-6">
                  <CardTitle className="text-xl sm:text-2xl font-bold">Contact Form</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Fill out all fields below and we'll get back to you</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-gray-900 dark:text-gray-100" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 px-4">
                        We've received your message and will get back to you within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="mt-4"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <Label htmlFor="name" className="text-xs sm:text-sm font-semibold mb-2 block">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="border-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-xs sm:text-sm font-semibold mb-2 block">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="border-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold mb-2 block">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                          className="border-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="category" className="text-xs sm:text-sm font-semibold mb-2 block">
                            Category *
                          </Label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 rounded-md border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="citizen">Citizen Services</option>
                            <option value="business">Business & Permits</option>
                            <option value="complaint">Complaint</option>
                            <option value="technical">Technical Support</option>
                            <option value="government">Government Affairs</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="priority" className="text-xs sm:text-sm font-semibold mb-2 block">
                            Priority
                          </Label>
                          <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full h-10 px-3 rounded-md border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject" className="text-xs sm:text-sm font-semibold mb-2 block">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Brief description of your inquiry"
                          required
                          className="border-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-xs sm:text-sm font-semibold mb-2 block">
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Please provide detailed information about your inquiry..."
                          rows={6}
                          required
                          className="border-2 resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Minimum 20 characters required
                        </p>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold py-4 sm:py-6 text-base sm:text-lg border-0"
                      >
                        {isSubmitting ? (
                          <span className="text-sm sm:text-base">Sending...</span>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="text-sm sm:text-base">Send Message</span>
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
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
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900 dark:text-gray-100" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white px-2">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">Quick answers to common questions</p>
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
    </Layout>
  );
}
