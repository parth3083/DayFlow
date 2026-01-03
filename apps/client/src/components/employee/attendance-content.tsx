"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Calendar as CalendarIcon, List, CalendarDays, Loader2 } from "lucide-react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchMyAttendance, checkIn, checkOut } from "@/redux/slices/attendanceSlice";
import CalendarToolbar from "./calendar-toolbar";
import { format, startOfDay } from "date-fns";

const localizer = momentLocalizer(moment);

export default function AttendanceContent() {
    const dispatch = useAppDispatch();
    const { myAttendance, loading, error } = useAppSelector((state) => state.attendance);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<"month" | "week">("month");

    useEffect(() => {
        dispatch(fetchMyAttendance());
    }, [dispatch]);

    // Check if user is checked in today
    const todayRecord = myAttendance.find(
        (record) => format(new Date(record.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
    );
    const isCheckedIn = !!todayRecord;
    const isCheckedOut = !!todayRecord?.checkOut;

    const handleCheckIn = () => {
        dispatch(checkIn());
    };

    const handleCheckOut = () => {
        dispatch(checkOut());
    };

    // Stat Calculations
    const stats = {
        present: myAttendance.filter(r => r.status === "PRESENT").length,
        absent: myAttendance.filter(r => r.status === "ABSENT").length,
        late: 0, // Logic for late can be added here
        onLeave: myAttendance.filter(r => r.status === "LEAVE").length,
    };

    // Convert attendance records to calendar events
    const calendarEvents = myAttendance.map((record) => {
        const date = new Date(record.date);
        return {
            title: record.status,
            start: date,
            end: date,
            resource: record,
        };
    });

    const eventStyleGetter = (event: any) => {
        let backgroundColor = "#10b981"; // green for Present
        if (event.title === "ABSENT") backgroundColor = "#ef4444"; // red
        if (event.title === "LEAVE") backgroundColor = "#3b82f6"; // blue
        if (event.title === "HALF_DAY") backgroundColor = "#f59e0b"; // orange

        return {
            style: {
                backgroundColor,
                borderRadius: "6px",
                opacity: 0.9,
                color: "white",
                border: "none",
                display: "block",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "600",
            },
        };
    };

    return (
        <div className="w-[100%]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
                <p className="text-gray-600 mt-1">Track and view your attendance records</p>
            </div>

            {/* Check-in Status Banner */}
            <Card className={`mb-6 border-none text-white overflow-hidden ${isCheckedIn ? (isCheckedOut ? "bg-gradient-to-r from-gray-500 to-gray-600" : "bg-gradient-to-r from-orange-500 to-orange-600") : "bg-gradient-to-r from-teal-500 to-teal-600"}`}>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-white/80 font-medium">Today's Status</p>
                                <p className="text-3xl font-black">
                                    {isCheckedIn ? (isCheckedOut ? "Work Completed" : "Working...") : "Not Checked In"}
                                </p>
                                {isCheckedIn && (
                                    <p className="text-xs text-white/70 mt-1">
                                        Checked in at {format(new Date(todayRecord.checkIn), "hh:mm a")}
                                        {isCheckedOut && ` • Checked out at ${format(new Date(todayRecord.checkOut!), "hh:mm a")}`}
                                    </p>
                                )}
                            </div>
                        </div>

                        {!isCheckedOut && (
                            <Button
                                onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                                disabled={loading}
                                className="bg-white text-teal-600 hover:bg-teal-50 gap-2 px-8 py-6 text-lg font-bold shadow-xl border-none transition-transform active:scale-95"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                {isCheckedIn ? "Check Out" : "Check In Now"}
                            </Button>
                        )}

                        {isCheckedOut && (
                            <div className="bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                                Have a great evening! 👋
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CheckCircle size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Present</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <XCircle size={24} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Absent</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Clock size={24} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Late</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CalendarIcon size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">On Leave</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.onLeave}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance History */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            History Log
                        </h2>
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === "list"
                                    ? "bg-white text-teal-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <List size={16} className="inline mr-2" />
                                List
                            </button>
                            <button
                                onClick={() => setViewMode("calendar")}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === "calendar"
                                    ? "bg-white text-teal-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <CalendarDays size={16} className="inline mr-2" />
                                Calendar
                            </button>
                        </div>
                    </div>

                    {viewMode === "list" ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className="font-bold text-gray-500">Date</TableHead>
                                        <TableHead className="font-bold text-gray-500">Check In</TableHead>
                                        <TableHead className="font-bold text-gray-500">Check Out</TableHead>
                                        <TableHead className="font-bold text-gray-500">Work Hours</TableHead>
                                        <TableHead className="font-bold text-gray-500">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myAttendance.length > 0 ? (
                                        myAttendance.map((record, index) => (
                                            <TableRow key={index} className="border-gray-50 hover:bg-gray-50 transition-colors">
                                                <TableCell className="font-bold text-gray-900">
                                                    {format(new Date(record.date), "EEE, MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {format(new Date(record.checkIn), "hh:mm a")}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "-"}
                                                </TableCell>
                                                <TableCell className="text-gray-600 font-medium">{record.workHours?.toFixed(2) || "0"} hrs</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`border-none ${record.status === "PRESENT"
                                                                ? "bg-green-100 text-green-700"
                                                                : record.status === "ABSENT"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : record.status === "LEAVE"
                                                                        ? "bg-blue-100 text-blue-700"
                                                                        : "bg-orange-100 text-orange-700"
                                                            } shadow-none px-3 font-bold`}
                                                    >
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-gray-500 italic">
                                                No attendance records found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="h-[600px] border border-gray-100 rounded-xl p-4">
                            <Calendar
                                localizer={localizer}
                                events={calendarEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: "100%" }}
                                eventPropGetter={eventStyleGetter}
                                views={["month", "week"]}
                                view={calendarView}
                                date={calendarDate}
                                onNavigate={(date) => setCalendarDate(date)}
                                onView={(view) => setCalendarView(view as "month" | "week")}
                                components={{
                                    toolbar: CalendarToolbar,
                                }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
