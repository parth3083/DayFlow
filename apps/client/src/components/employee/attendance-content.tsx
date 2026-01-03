"use client";

import { useState } from "react";
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
import { Clock, CheckCircle, XCircle, Calendar as CalendarIcon, List, CalendarDays } from "lucide-react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarToolbar from "./calendar-toolbar";

const localizer = momentLocalizer(moment);

const attendanceHistory = [
    { date: "Fri, Jan 2", checkIn: "09:00", checkOut: "18:00", hours: "8h", status: "Present" },
    { date: "Thu, Jan 1", checkIn: "09:00", checkOut: "18:00", hours: "8h", status: "Present" },
    { date: "Wed, Dec 31", checkIn: "-", checkOut: "-", hours: "-", status: "Absent" },
    { date: "Tue, Dec 30", checkIn: "09:00", checkOut: "18:00", hours: "8h", status: "Present" },
    { date: "Mon, Dec 29", checkIn: "-", checkOut: "-", hours: "-", status: "On Leave" },
];

// Convert attendance history to calendar events
const calendarEvents = attendanceHistory.map((record) => {
    const date = moment(record.date, "ddd, MMM D").year(2026).toDate();
    return {
        title: record.status,
        start: date,
        end: date,
        resource: record,
    };
});

export default function AttendanceContent() {
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<"month" | "week">("month");

    const eventStyleGetter = (event: any) => {
        let backgroundColor = "#10b981"; // green for Present
        if (event.title === "Absent") backgroundColor = "#ef4444"; // red
        if (event.title === "On Leave") backgroundColor = "#3b82f6"; // blue

        return {
            style: {
                backgroundColor,
                borderRadius: "4px",
                opacity: 0.8,
                color: "white",
                border: "0px",
                display: "block",
            },
        };
    };

    // Custom toolbar component
    const CustomToolbar = (toolbar: any) => {
        const goToBack = () => {
            toolbar.onNavigate("PREV");
        };

        const goToNext = () => {
            toolbar.onNavigate("NEXT");
        };

        const goToToday = () => {
            toolbar.onNavigate("TODAY");
        };

        const label = () => {
            const date = moment(toolbar.date);
            return (
                <span className="text-lg font-semibold text-gray-900">
                    {date.format("MMMM YYYY")}
                </span>
            );
        };

        return (
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
                {/* Left: Month/Year */}
                <div className="flex-1">{label()}</div>

                {/* Center: Navigation buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToBack}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-teal-600 border border-teal-600 rounded-md hover:bg-teal-700"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNext}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>

                {/* Right: View toggle */}
                <div className="flex-1 flex justify-end gap-2">
                    <button
                        onClick={() => toolbar.onView("month")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${toolbar.view === "month"
                            ? "bg-teal-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => toolbar.onView("week")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${toolbar.view === "week"
                            ? "bg-teal-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        Week
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-[100%]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
                <p className="text-gray-600 mt-1">Track and view your attendance records</p>
            </div>

            {/* Check-in Status Banner */}
            <Card className="mb-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-teal-50">Today's Status</p>
                                <p className="text-2xl font-bold">Not Checked In</p>
                            </div>
                        </div>
                        <Button className="bg-white text-teal-600 hover:bg-teal-50 gap-2">
                            <CheckCircle size={18} />
                            Check In
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Present</p>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <XCircle size={24} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Absent</p>
                                <p className="text-2xl font-bold text-gray-900">2</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock size={24} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Late</p>
                                <p className="text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CalendarIcon size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">On Leave</p>
                                <p className="text-2xl font-bold text-gray-900">4</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance History */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Attendance History (Current: {viewMode})
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    console.log("List clicked");
                                    setViewMode("list");
                                }}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === "list"
                                    ? "bg-teal-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                <List size={16} className="inline mr-2" />
                                List
                            </button>
                            <button
                                onClick={() => {
                                    console.log("Calendar clicked");
                                    setViewMode("calendar");
                                }}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${viewMode === "calendar"
                                    ? "bg-teal-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                <CalendarDays size={16} className="inline mr-2" />
                                Calendar
                            </button>
                        </div>
                    </div>

                    {viewMode === "list" ? (
                        <Tabs defaultValue="week" className="w-full">
                            <TabsList className="mb-6">
                                <TabsTrigger value="week">This Week</TabsTrigger>
                                <TabsTrigger value="month">This Month</TabsTrigger>
                            </TabsList>

                            <TabsContent value="week">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Check In</TableHead>
                                            <TableHead>Check Out</TableHead>
                                            <TableHead>Hours</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceHistory.map((record, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{record.date}</TableCell>
                                                <TableCell>{record.checkIn}</TableCell>
                                                <TableCell>{record.checkOut}</TableCell>
                                                <TableCell>{record.hours}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            record.status === "Present"
                                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                                : record.status === "Absent"
                                                                    ? "bg-red-100 text-red-700 hover:bg-red-100"
                                                                    : record.status === "On Leave"
                                                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                                        }
                                                    >
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>

                            <TabsContent value="month">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Check In</TableHead>
                                            <TableHead>Check Out</TableHead>
                                            <TableHead>Hours</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceHistory.map((record, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{record.date}</TableCell>
                                                <TableCell>{record.checkIn}</TableCell>
                                                <TableCell>{record.checkOut}</TableCell>
                                                <TableCell>{record.hours}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            record.status === "Present"
                                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                                : record.status === "Absent"
                                                                    ? "bg-red-100 text-red-700 hover:bg-red-100"
                                                                    : record.status === "On Leave"
                                                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                                        }
                                                    >
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className="h-[600px]">
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
