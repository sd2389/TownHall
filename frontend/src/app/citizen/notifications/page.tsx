"use client";

import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { notificationsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CitizenNotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await notificationsApi.list();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      } catch (err: any) {
        console.error('Error fetching notifications:', err);
        setError(err.message || 'Failed to load notifications');
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationsApi.read.update(notificationId);
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      alert(err.message || 'Failed to mark notification as read');
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read if unread
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    // Navigate to complaint if it's a complaint update
    if (notification.complaint_id) {
      router.push(`/citizen/complaints`);
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'complaint_update':
        return 'Complaint Update';
      case 'announcement':
        return 'Announcement';
      default:
        return 'General';
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'complaint_update':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'announcement':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Layout userType="citizen" userName="Maria Lopez" userEmail="maria.lopez@email.com" showPortalNav={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <Bell className="h-5 w-5 text-[#003153]" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white ml-2">{unreadCount}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Latest updates related to your activity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No notifications yet.</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${
                      notification.is_read
                        ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                        : 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                    } hover:shadow-md`}
                  >
                    <div className="mt-0.5">
                      {notification.is_read ? (
                        <Circle className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Bell className="h-5 w-5 text-[#003153]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${notification.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getNotificationTypeColor(notification.type)}>
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Mark read
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                      {notification.complaint_title && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Related to: {notification.complaint_title}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{notification.created_at}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
