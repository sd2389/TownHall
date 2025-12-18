"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Search,
  Eye,
  Building2,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Home,
  UserPlus,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { businessEventsApi } from "@/lib/api";
import React, { useState, useEffect } from "react";

export default function CitizenEvents() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved'>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState<number | null>(null);
  const [registrationNotes, setRegistrationNotes] = useState("");
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Always fetch approved events for citizens
        const filters: any = { status: 'approved' };
        const data = await businessEventsApi.list(filters);
        // Map API data to component format
        const mappedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.event_date,
          time: event.event_time,
          location: event.location,
          status: event.status,
          attendees: event.current_attendees || 0,
          maxAttendees: event.max_attendees,
          business_name: event.business_name || '',
          business_owner: event.business_owner || '',
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

  const handleViewDetails = async (event: any) => {
    setSelectedEvent(event);
    setIsDetailDialogOpen(true);
  };

  const handleRegister = async (eventId: number) => {
    try {
      setIsRegistering(eventId);
      setError(null);
      await businessEventsApi.register(eventId, registrationNotes);
      setRegistrationNotes("");
      setIsRegistrationDialogOpen(false);
      // Refresh events to get updated attendee counts
      // Always fetch approved events for citizens
      const filters: any = { status: 'approved' };
      const data = await businessEventsApi.list(filters);
      const mappedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.event_date,
        time: event.event_time,
        location: event.location,
        status: event.status,
        attendees: event.current_attendees || 0,
        maxAttendees: event.max_attendees,
        business_name: event.business_name || '',
        business_owner: event.business_owner || '',
      }));
      setEvents(mappedEvents);
    } catch (err: any) {
      console.error('Error registering for event:', err);
      setError(err.message || 'Failed to register for event');
    } finally {
      setIsRegistering(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    // Since we always fetch approved events, we only need to filter by search
    // But keep status filter for consistency (though it should always be 'approved')
    const matchesStatus = filterStatus === 'all' || event.status === 'approved';
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute allowedRoles={['citizen']}>
      <Layout 
        userType="citizen" 
        userName={`${user?.firstName || ''} ${user?.lastName || ''}`} 
        userEmail={user?.email || ''} 
        showPortalNav={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-[#003153] to-[#003153]/90 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Business Events</h1>
                      <p className="text-blue-100 text-xs sm:text-sm md:text-base mt-1">Discover and register for local business events</p>
                    </div>
                  </div>
                  <Link href="/citizen">
                    <Button 
                      variant="outline" 
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <Home className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 dark:border-slate-600"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                    >
                      <option value="all">All Events</option>
                      <option value="approved">Approved Only</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                      <AlertCircle className="h-5 w-5" />
                      <p>{error}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Events List */}
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No events found</h3>
                  <p className="text-slate-600 dark:text-slate-400">There are no business events available at this time</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <CardTitle className="text-xl">{event.title}</CardTitle>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <CardDescription className="mt-2">
                              {event.description.substring(0, 200)}...
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {event.business_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.attendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''} Attendees
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(event)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {event.status === 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setIsRegistrationDialogOpen(true);
                                }}
                                disabled={isRegistering === event.id || (event.maxAttendees && event.attendees >= event.maxAttendees)}
                                className="bg-[#003153] hover:bg-[#003153]/90"
                              >
                                {isRegistering === event.id ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Registering...
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Register
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Event Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedEvent?.title}</DialogTitle>
                  <DialogDescription>
                    {selectedEvent?.description}
                  </DialogDescription>
                </DialogHeader>
                {selectedEvent && (
                  <div className="space-y-6">
                    {/* Event Details */}
                    <div>
                      <h3 className="font-semibold mb-2">Event Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Business:</span>
                          <p className="text-slate-600 dark:text-slate-400">{selectedEvent.business_name}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Date:</span>
                          <p className="text-slate-600 dark:text-slate-400">{selectedEvent.date}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Time:</span>
                          <p className="text-slate-600 dark:text-slate-400">{selectedEvent.time}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Location:</span>
                          <p className="text-slate-600 dark:text-slate-400">{selectedEvent.location}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Attendees:</span>
                          <p className="text-slate-600 dark:text-slate-400">
                            {selectedEvent.attendees}{selectedEvent.maxAttendees ? `/${selectedEvent.maxAttendees}` : ''}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Status:</span>
                          <Badge className={`${getStatusColor(selectedEvent.status)} ml-2`}>
                            {selectedEvent.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {selectedEvent.description}
                      </p>
                    </div>

                    {/* Register Button */}
                    {selectedEvent.status === 'approved' && (
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                        <Button
                          onClick={() => {
                            setIsDetailDialogOpen(false);
                            setIsRegistrationDialogOpen(true);
                          }}
                          disabled={isRegistering === selectedEvent.id || (selectedEvent.maxAttendees && selectedEvent.attendees >= selectedEvent.maxAttendees)}
                          className="bg-[#003153] hover:bg-[#003153]/90 w-full"
                        >
                          {isRegistering === selectedEvent.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Registering...
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Register for Event
                            </>
                          )}
                        </Button>
                        {selectedEvent.maxAttendees && selectedEvent.attendees >= selectedEvent.maxAttendees && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">
                            This event is full
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Registration Dialog */}
            <Dialog open={isRegistrationDialogOpen} onOpenChange={setIsRegistrationDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Register for Event</DialogTitle>
                  <DialogDescription>
                    {selectedEvent?.title}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Notes (optional)</label>
                    <Textarea
                      placeholder="Any additional notes or requirements..."
                      value={registrationNotes}
                      onChange={(e) => setRegistrationNotes(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsRegistrationDialogOpen(false);
                      setRegistrationNotes("");
                    }}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => selectedEvent && handleRegister(selectedEvent.id)}
                      disabled={isRegistering === selectedEvent?.id}
                      className="bg-[#003153] hover:bg-[#003153]/90"
                    >
                      {isRegistering === selectedEvent?.id ? 'Registering...' : 'Register'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

