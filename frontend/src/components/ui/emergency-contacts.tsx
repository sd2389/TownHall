"use client";

import { Phone, Shield, Flame, HeartPulse, Clock, Building2, Dog, AlertTriangle, Wrench, HardHat, Brain, Baby, Navigation } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmergencyContact {
  police?: string;
  fire?: string;
  medical?: string;
  non_urgent?: string;
  dispatch?: string;
  animal_control?: string;
  poison_control?: string;
  utilities?: string;
  public_works?: string;
  mental_health?: string;
  child_protective?: string;
  road_department?: string;
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
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Police - Always show (has default 911) */}
          {contacts.police && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Police</p>
                  <p className="text-xs text-gray-500">Emergency</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.police)}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.police}
              </Button>
            </div>
          )}

          {/* Fire - Always show (has default 911) */}
          {contacts.fire && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Flame className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Fire Department</p>
                  <p className="text-xs text-gray-500">Emergency</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.fire)}
                className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.fire}
              </Button>
            </div>
          )}

          {/* Medical - Always show (has default 911) */}
          {contacts.medical && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <HeartPulse className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Medical/EMS</p>
                  <p className="text-xs text-gray-500">Emergency</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.medical)}
                className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.medical}
              </Button>
            </div>
          )}

          {/* Non-Urgent - Only show if number exists */}
          {contacts.non_urgent && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Non-Urgent</p>
                  <p className="text-xs text-gray-500">Dispatch</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.non_urgent)}
                className="w-full border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.non_urgent}
              </Button>
            </div>
          )}

          {/* Dispatch - Only show if number exists */}
          {contacts.dispatch && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Building2 className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Dispatch</p>
                  <p className="text-xs text-gray-500">Emergency</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.dispatch)}
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.dispatch}
              </Button>
            </div>
          )}

          {/* Animal Control - Only show if number exists */}
          {contacts.animal_control && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Dog className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Animal Control</p>
                  <p className="text-xs text-gray-500">Emergency</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.animal_control)}
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.animal_control}
              </Button>
            </div>
          )}

          {/* Poison Control - Always show (has national default) */}
          <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Poison Control</p>
                <p className="text-xs text-gray-500">24/7 Hotline</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCall(contacts.poison_control || '1-800-222-1222')}
              className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
            >
              <Phone className="h-3 w-3 mr-1" />
              {contacts.poison_control || '1-800-222-1222'}
            </Button>
          </div>

          {/* Utilities Emergency - Only show if number exists */}
          {contacts.utilities && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Wrench className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Utilities Emergency</p>
                  <p className="text-xs text-gray-500">Gas, Water, Electric</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.utilities)}
                className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.utilities}
              </Button>
            </div>
          )}

          {/* Public Works - Only show if number exists */}
          {contacts.public_works && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <HardHat className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Public Works</p>
                  <p className="text-xs text-gray-500">Infrastructure</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.public_works)}
                className="w-full border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.public_works}
              </Button>
            </div>
          )}

          {/* Mental Health Crisis - Always show (has national default 988) */}
          <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-pink-50 rounded-lg">
                <Brain className="h-4 w-4 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Mental Health Crisis</p>
                <p className="text-xs text-gray-500">24/7 Support</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCall(contacts.mental_health || '988')}
              className="w-full border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white"
            >
              <Phone className="h-3 w-3 mr-1" />
              {contacts.mental_health || '988'}
            </Button>
          </div>

          {/* Child Protective Services - Only show if number exists */}
          {contacts.child_protective && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-rose-50 rounded-lg">
                  <Baby className="h-4 w-4 text-rose-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Child Protective Services</p>
                  <p className="text-xs text-gray-500">24/7 Hotline</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.child_protective)}
                className="w-full border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.child_protective}
              </Button>
            </div>
          )}

          {/* Road Department - Only show if number exists */}
          {contacts.road_department && (
            <div className="flex flex-col p-3 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Navigation className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Road Department</p>
                  <p className="text-xs text-gray-500">Highway Emergency</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(contacts.road_department)}
                className="w-full border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
              >
                <Phone className="h-3 w-3 mr-1" />
                {contacts.road_department}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}






