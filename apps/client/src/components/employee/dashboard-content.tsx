"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, FileText, User as UserIcon, CheckCircle, Edit, CalendarClock, DollarSign } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchEmployeeStats } from "@/redux/slices/dashboardSlice";
import { fetchMyAttendance, checkIn, checkOut } from "@/redux/slices/attendanceSlice";
import { fetchMyLeaves } from "@/redux/slices/leaveSlice";
import { format } from "date-fns";
import Link from "next/link";

export default function DashboardContent() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { employeeStats, loading } = useAppSelector((state) => state.dashboard);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        dispatch(fetchEmployeeStats());
        dispatch(fetchMyAttendance({ page: 1, limit: 1 }));
        dispatch(fetchMyLeaves());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [dispatch]);

    const { todayRecord, loading: attendanceLoading } = useAppSelector((state) => state.attendance);

    const handleAttendanceAction = () => {
        if (!todayRecord) {
            dispatch(checkIn());
        } else if (!todayRecord.checkOut) {
            dispatch(checkOut());
        }
    };

    const getAttendanceButtonText = () => {
        if (attendanceLoading) return "Processing...";
        if (!todayRecord) return "Check In";
        if (!todayRecord.checkOut) return "Check Out";
        return "Checked Out";
    };

    const isAttendanceDisabled = attendanceLoading || (todayRecord && todayRecord.checkOut);

    if (!user) return null;

    const stats = employeeStats || {
        attendanceSummary: { present: 0, absent: 0, halfDay: 0, late: 0 },
        leaveBalance: { total: 0, used: 0, pending: 0, remaining: 0 },
        upcomingHolidays: [],
    };

    return (
        <div className="w-[100%]">
            {/* Greeting Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Good {currentTime.getHours() < 12 ? "Morning" : currentTime.getHours() < 18 ? "Afternoon" : "Evening"}, {user.firstName}!
                </h1>
                <p className="text-gray-600 mt-1">{format(currentTime, "EEEE, MMMM d, yyyy")}</p>
            </div>

            {/* Check-in Widget and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Check-in Widget */}
                <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-teal-50 mb-1 opacity-80">Current Time</p>
                                <p className="text-4xl font-black tracking-tight">{format(currentTime, "hh:mm:ss a")}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <Clock size={32} className="text-white" />
                            </div>
                        </div>
                        <Button
                            className="w-full bg-white text-teal-600 hover:bg-teal-50 font-bold py-6 text-lg shadow-sm disabled:opacity-70 disabled:bg-white"
                            onClick={handleAttendanceAction}
                            disabled={!!isAttendanceDisabled}
                        >
                            {getAttendanceButtonText()}
                        </Button>
                    </CardContent>
                </Card>

                {/* This Month */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Calendar size={28} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Attendance This Month</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.attendanceSummary.present} Days</p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Overall Present Status
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Balance */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <FileText size={28} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Leave Balance</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.leaveBalance.remaining}</p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    Days Remaining in Account
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link href="/employee/profile">
                    <Card className="hover:shadow-md transition-all cursor-pointer border-none shadow-sm group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <UserIcon size={24} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">My Profile</h3>
                                    <p className="text-xs text-gray-500">Manage your credentials</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/employee/attendance">
                    <Card className="hover:shadow-md transition-all cursor-pointer border-none shadow-sm group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                    <Clock size={24} className="text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">Attendance</h3>
                                    <p className="text-xs text-gray-500">View history & timing</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/employee/leave-requests">
                    <Card className="hover:shadow-md transition-all cursor-pointer border-none shadow-sm group">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <FileText size={24} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">Leave Requests</h3>
                                    <p className="text-xs text-gray-500">Request or check status</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Activity and Upcoming */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={20} className="text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">Last Check In</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Jan 2, 2026 at 9:04 AM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FileText size={20} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">Sick Leave Approved</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Approved by HR Manager</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Edit size={20} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">Profile Verified</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Your KYC data was verified</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Holidays */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Holidays</h2>
                        <div className="space-y-6">
                            {stats.upcomingHolidays.length > 0 ? (
                                stats.upcomingHolidays.map((holiday, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CalendarClock size={20} className="text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900">{holiday.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{format(new Date(holiday.date), "MMM d, yyyy")}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">No upcoming holidays found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
