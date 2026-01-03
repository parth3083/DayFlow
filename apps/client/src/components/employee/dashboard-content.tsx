import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, FileText, User, CheckCircle, Edit, CalendarClock, DollarSign } from "lucide-react";

export default function DashboardContent() {
    return (
        <div className="w-[100%]">
            {/* Greeting Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Good Morning, Michael!</h1>
                <p className="text-gray-600 mt-1">Saturday, January 3, 2026</p>
            </div>

            {/* Check-in Widget and Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Check-in Widget */}
                <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-teal-50 mb-1">Current Time</p>
                                <p className="text-3xl font-bold">11:02:12 AM</p>
                            </div>
                            <Clock size={40} className="text-teal-100" />
                        </div>
                        <Button className="w-full bg-white text-teal-600 hover:bg-teal-50">
                            Check In
                        </Button>
                    </CardContent>
                </Card>

                {/* This Month */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">22/23</p>
                                <p className="text-xs text-gray-500">Present Days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Balance */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Leave Balance</p>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                                <p className="text-xs text-gray-500">Days Remaining</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <User size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">My Profile</h3>
                                <p className="text-sm text-gray-600">View and update your personal information</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Clock size={24} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Attendance</h3>
                                <p className="text-sm text-gray-600">Check your attendance history</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <FileText size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Leave Requests</h3>
                                <p className="text-sm text-gray-600">Apply for leave or check status</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity and Upcoming */}
            <div className="grid grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={16} className="text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Checked in</p>
                                    <p className="text-xs text-gray-500">Today, 9:04 AM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FileText size={16} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Leave approved</p>
                                    <p className="text-xs text-gray-500">Yesterday</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Edit size={16} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Profile updated</p>
                                    <p className="text-xs text-gray-500">2 days ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CalendarClock size={16} className="text-teal-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Team Meeting</p>
                                    <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CalendarClock size={16} className="text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Performance Review</p>
                                    <p className="text-xs text-gray-500">Jan 15, 2026</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <DollarSign size={16} className="text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Salary Credit</p>
                                    <p className="text-xs text-gray-500">Jan 28, 2026</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
