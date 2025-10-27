"use client";

import { Phone, Shield, Flame, HeartPulse, Clock, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmergencyContact {
  police?: string;
  fire?: string;
  medical?: string;
  non_urgent?: string;
  dispatch?: string;
}

interface EmergencyContactsProps {
  townName: string;
  contacts: EmergencyContact;
}

export default function EmergencyContacts({ townName, contacts }: EmergencyContactsProps) {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-red-700">Emergency Contacts</CardTitle>
            <CardDescription className="text-xs mt-1">Quick access for {townName}</CardDescription>
          </div>
          <Shield className="h-6 w-6 text-red-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Police */}
        <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Police</p>
              <p className="text-xs text-gray-500">Emergency</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => contacts.police && handleCall(contacts.police)}
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <Phone className="h-4 w-4 mr-1" />
            {contacts.police}
          </Button>
        </div>

        {/* Fire */}
        <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Flame className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Fire Department</p>
              <p className="text-xs text-gray-500">Emergency</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => contacts.fire && handleCall(contacts.fire)}
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            <Phone className="h-4 w-4 mr-1" />
            {contacts.fire}
          </Button>
        </div>

        {/* Medical */}
        <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <HeartPulse className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Medical/EMS</p>
              <p className="text-xs text-gray-500">Emergency</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => contacts.medical && handleCall(contacts.medical)}
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            <Phone className="h-4 w-4 mr-1" />
            {contacts.medical}
          </Button>
        </div>

        {/* Non-Urgent */}
        {contacts.non_urgent && (
          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Non-Urgent</p>
                <p className="text-xs text-gray-500">Dispatch</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCall(contacts.non_urgent!)}
              className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
            >
              <Phone className="h-4 w-4 mr-1" />
              {contacts.non_urgent}
            </Button>
          </div>
        )}

        {/* Dispatch */}
        {contacts.dispatch && (
          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Dispatch</p>
                <p className="text-xs text-gray-500">Emergency</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCall(contacts.dispatch!)}
              className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            >
              <Phone className="h-4 w-4 mr-1" />
              {contacts.dispatch}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

