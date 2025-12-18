"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { businessEventsApi } from "@/lib/api";
import React, { useState, useEffect } from "react";

export default function BusinessEvents() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'attendees'>('date');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isManageAttendeesOpen, setIsManageAttendeesOpen] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    max_attendees: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const filters: any = {};
        if (filterStatus !== 'all') {
          filters.status = filterStatus === 'upcoming' ? 'approved' : filterStatus;
        }
        const data = await businessEventsApi.list(filters);
        // Map API data to component format
        const mappedEvents = data.map((event: any) => ({
          id: event.id,
          name: event.title,
          description: event.description,
          date: event.event_date,
          time: event.event_time,
          location: event.location,
          status: event.status === 'approved' ? 'upcoming' : event.status,
          attendees: event.current_attendees || 0,
          maxAttendees: event.max_attendees,
          type: "Business Event",
          category: "Business",
          price: "Free", // Not in API yet
          organizer: event.business_owner || '',
          requirements: [], // Not in API yet
          features: [], // Not in API yet
          contact: "", // Not in API yet
          phone: "" // Not in API yet
        }));
        setEvents(mappedEvents);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchEvents();
    }
  }, [user, filterStatus]);

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

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filters: any = {};
      if (filterStatus !== 'all') {
        filters.status = filterStatus === 'upcoming' ? 'approved' : filterStatus;
      }
      const data = await businessEventsApi.list(filters);
      // Map API data to component format
      const mappedEvents = data.map((event: any) => ({
        id: event.id,
        name: event.title,
        description: event.description,
        date: event.event_date,
        time: event.event_time,
        location: event.location,
        status: event.status === 'approved' ? 'upcoming' : event.status,
        attendees: event.current_attendees || 0,
        maxAttendees: event.max_attendees,
        type: "Business Event",
        category: "Business",
        price: "Free",
        organizer: event.business_owner || '',
        business_name: event.business_name || '',
        requirements: [],
        features: [],
        contact: "",
        phone: ""
      }));
      setEvents(mappedEvents);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events from API
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, filterStatus]);

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.description || !formData.event_date || !formData.event_time || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await businessEventsApi.create({
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        event_time: formData.event_time,
        location: formData.location,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
      });
      setIsCreateDialogOpen(false);
      setFormData({ title: '', description: '', event_date: '', event_time: '', location: '', max_attendees: '' });
      await fetchEvents();
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAttendees = async (eventId: number) => {
    try {
      setIsLoadingRegistrations(true);
      const data = await businessEventsApi.getRegistrations(eventId);
      setRegistrations(data);
      setIsManageAttendeesOpen(true);
    } catch (err: any) {
      console.error('Error fetching registrations:', err);
      setError(err.message || 'Failed to load registrations');
    } finally {
      setIsLoadingRegistrations(false);
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
    <ProtectedRoute allowedRoles={['business']}>
      <Layout 
        userType="business" 
        userName={`${user?.firstName || ''} ${user?.lastName || ''}`} 
        userEmail={user?.email || ''} 
        showPortalNav={true}
      >
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
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#003153] hover:bg-[#003153]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>Fill in the details to create a new business event</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title *</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Event title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description *</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Event description"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date *</label>
                        <Input
                          type="date"
                          value={formData.event_date}
                          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time *</label>
                        <Input
                          type="time"
                          value={formData.event_time}
                          onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location *</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Event location"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Attendees (optional)</label>
                      <Input
                        type="number"
                        value={formData.max_attendees}
                        onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                        placeholder="Maximum number of attendees"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateEvent} disabled={isSubmitting} className="bg-[#003153] hover:bg-[#003153]/90">
                        {isSubmitting ? 'Creating...' : 'Create Event'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Clock3 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
            </div>
          )}

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
          {!isLoading && (
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
                  <Dialog open={isViewDialogOpen && selectedEvent?.id === event.id} onOpenChange={(open) => {
                    setIsViewDialogOpen(open);
                    if (open) setSelectedEvent(event);
                    else setSelectedEvent(null);
                  }}>
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
                              <Button variant="outline" onClick={() => handleViewAttendees(event.id)}>
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
          )}

          {/* Empty State */}
          {!isLoading && filteredEvents.length === 0 && (
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
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#003153] hover:bg-[#003153]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>Fill in the details to create a new business event</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title *</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Event title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description *</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Event description"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date *</label>
                        <Input
                          type="date"
                          value={formData.event_date}
                          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time *</label>
                        <Input
                          type="time"
                          value={formData.event_time}
                          onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location *</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Event location"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Attendees (optional)</label>
                      <Input
                        type="number"
                        value={formData.max_attendees}
                        onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                        placeholder="Maximum number of attendees"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateEvent} disabled={isSubmitting} className="bg-[#003153] hover:bg-[#003153]/90">
                        {isSubmitting ? 'Creating...' : 'Create Event'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          {/* Manage Attendees Dialog */}
          <Dialog open={isManageAttendeesOpen} onOpenChange={setIsManageAttendeesOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Event Registrations</DialogTitle>
                <DialogDescription>View and manage event registrations</DialogDescription>
              </DialogHeader>
              {isLoadingRegistrations ? (
                <div className="text-center py-8">
                  <Clock3 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading registrations...</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No registrations yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((registration) => (
                    <Card key={registration.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{registration.citizen_name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{registration.citizen_email}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Registered: {registration.registered_at}
                            </p>
                          </div>
                          <Badge variant={registration.status === 'registered' ? 'default' : 'secondary'}>
                            {registration.status}
                          </Badge>
                        </div>
                        {registration.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{registration.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  );
}
