"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  ExternalLink,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  Heart,
  Share2,
  Bell,
  MessageSquare
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import React, { useState } from "react";

export default function BusinessEvents() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'attendees'>('date');

  const events = [
    {
      id: 1,
      name: "Coffee Tasting Event",
      description: "Monthly coffee tasting event featuring local roasters and specialty blends",
      date: "2024-02-15",
      time: "6:00 PM - 8:00 PM",
      location: "Priya's Café - Main Hall",
      status: "upcoming",
      attendees: 45,
      maxAttendees: 50,
      type: "Business Event",
      category: "Food & Beverage",
      price: "$15",
      organizer: "Priya Singh",
      requirements: ["Pre-registration required", "Age 18+", "Valid ID"],
      features: ["Live Music", "Food Samples", "Expert Tasting Notes", "Take-home Samples"],
      contact: "priya@cafe.com",
      phone: "(555) 123-4567"
    },
    {
      id: 2,
      name: "Small Business Workshop",
      description: "Free workshop on digital marketing strategies for local businesses",
      date: "2024-02-20",
      time: "10:00 AM - 12:00 PM",
      location: "Community Center - Room A",
      status: "upcoming",
      attendees: 0,
      maxAttendees: 30,
      type: "Educational Event",
      category: "Business Development",
      price: "Free",
      organizer: "Priya Singh",
      requirements: ["Registration required", "Bring laptop/tablet", "Business owner preferred"],
      features: ["Expert Speaker", "Hands-on Activities", "Networking", "Resource Materials"],
      contact: "workshop@cafe.com",
      phone: "(555) 123-4567"
    },
    {
      id: 3,
      name: "Local Vendor Fair",
      description: "Monthly fair showcasing local products and services from area businesses",
      date: "2024-02-25",
      time: "9:00 AM - 4:00 PM",
      location: "Downtown Plaza",
      status: "upcoming",
      attendees: 120,
      maxAttendees: 200,
      type: "Community Event",
      category: "Market",
      price: "Free",
      organizer: "Priya Singh",
      requirements: ["Vendor application required", "Insurance coverage", "Setup by 8:30 AM"],
      features: ["50+ Vendors", "Live Entertainment", "Food Trucks", "Kids Activities"],
      contact: "vendor@cafe.com",
      phone: "(555) 123-4567"
    },
    {
      id: 4,
      name: "Holiday Special Event",
      description: "Annual holiday celebration with special menu and entertainment",
      date: "2023-12-15",
      time: "5:00 PM - 10:00 PM",
      location: "Priya's Café - Entire Venue",
      status: "past",
      attendees: 85,
      maxAttendees: 100,
      type: "Special Event",
      category: "Holiday",
      price: "$25",
      organizer: "Priya Singh",
      requirements: ["Advance booking required", "Dress code: Semi-formal", "Age 21+"],
      features: ["Special Menu", "Live Band", "Photo Booth", "Gift Exchange"],
      contact: "holiday@cafe.com",
      phone: "(555) 123-4567"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "past":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return Clock3;
      case "past":
        return CheckCircle2;
      case "cancelled":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout userType="business" userName="Priya Singh" userEmail="priya.singh@email.com" showPortalNav={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Business Events</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Create and manage your business events and promotions</p>
              </div>
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'upcoming' | 'past' | 'cancelled') => setFilterStatus(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'attendees') => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="attendees">Attendees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event, index) => {
              const StatusIcon = getStatusIcon(event.status);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#003153]/30 cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {event.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 dark:text-gray-300 text-sm">
                                {event.type} • {event.category}
                              </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(event.status)} text-xs ml-3 px-2 py-1 flex items-center justify-center`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <Calendar className="h-4 w-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Attendees:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{event.attendees}/{event.maxAttendees}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Price:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{event.price}</span>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          {event.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                          Event Details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Event Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Event Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Type:</span>
                              <p className="text-gray-600 dark:text-gray-300">{event.type}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Category:</span>
                              <p className="text-gray-600 dark:text-gray-300">{event.category}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Date:</span>
                              <p className="text-gray-600 dark:text-gray-300">{event.date}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Time:</span>
                              <p className="text-gray-600 dark:text-gray-300">{event.time}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Location:</span>
                              <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Price:</span>
                              <p className="text-gray-600 dark:text-gray-300">{event.price}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Attendees:</span>
                              <p className="text-gray-600 dark:text-gray-300">{event.attendees}/{event.maxAttendees}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                              <Badge className={`${getStatusColor(event.status)} text-xs ml-2`}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {event.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Event Features</h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {event.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Contact Information */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <span className="font-medium mr-2">Organizer:</span>
                              {event.organizer}
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <span className="font-medium mr-2">Email:</span>
                              {event.contact}
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <span className="font-medium mr-2">Phone:</span>
                              {event.phone}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {event.status === 'upcoming' && (
                            <>
                              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Event
                              </Button>
                              <Button variant="outline">
                                <Users className="h-4 w-4 mr-2" />
                                Manage Attendees
                              </Button>
                            </>
                          )}
                          <Button variant="outline">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Event
                          </Button>
                          <Button variant="outline">
                            <Bell className="h-4 w-4 mr-2" />
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Events Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No events match your current filters.' 
                  : 'You don\'t have any events yet.'}
              </p>
              <Button className="bg-[#003153] hover:bg-[#003153]/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
