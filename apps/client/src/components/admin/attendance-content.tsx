"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Calendar as CalendarIcon, Clock, User, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchAllAttendance } from "@/redux/slices/attendanceSlice";
import { format } from "date-fns";

export default function AttendanceContent() {
    const dispatch = useAppDispatch();
    const { allAttendance, loading } = useAppSelector((state) => state.attendance);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

    useEffect(() => {
        dispatch(fetchAllAttendance({ date: selectedDate }));
    }, [dispatch, selectedDate]);

    const filteredAttendance = allAttendance.filter(record =>
        record.loginId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-[100%]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Tracking</h1>
                    <p className="text-gray-600 mt-1">Monitor daily presence and work hours across the organization</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                    <Input
                        placeholder="Search by Login ID..."
                        className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-teal-500/20 text-md font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        type="date"
                        className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-teal-500/20 text-md font-medium"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-4 h-14 bg-white rounded-2xl shadow-sm border-none group cursor-pointer hover:bg-gray-50 transition-colors">
                    <Filter className="text-gray-400 group-hover:text-teal-600 transition-colors" size={20} />
                    <span className="text-sm font-bold text-gray-600">Advanced Filters</span>
                </div>
            </div>

            {/* Attendance Table */}
            <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
                                <TableHead className="py-6 px-6 font-black text-gray-500 uppercase tracking-wider text-xs">Employee ID</TableHead>
                                <TableHead className="py-6 font-black text-gray-500 uppercase tracking-wider text-xs">Check In</TableHead>
                                <TableHead className="py-6 font-black text-gray-500 uppercase tracking-wider text-xs">Check Out</TableHead>
                                <TableHead className="py-6 font-black text-gray-500 uppercase tracking-wider text-xs">Work Hours</TableHead>
                                <TableHead className="py-6 px-6 font-black text-gray-500 uppercase tracking-wider text-xs">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <Loader2 className="animate-spin text-teal-600" size={40} />
                                            <p className="text-sm font-bold text-gray-500">Fetching attendance logs...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredAttendance.length > 0 ? (
                                filteredAttendance.map((record) => (
                                    <TableRow key={record._id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                        <TableCell className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700 font-black text-xs">
                                                    {record.loginId.substring(0, 2)}
                                                </div>
                                                <span className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{record.loginId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-2 text-gray-600 font-medium italic">
                                                <Clock size={16} className="text-gray-400" />
                                                {format(new Date(record.checkIn), "hh:mm a")}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-2 text-gray-600 font-medium italic">
                                                <Clock size={16} className="text-gray-400" />
                                                {record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "--:--"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-black tracking-tight">
                                                {record.workHours?.toFixed(2) || "0.00"} hrs
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-5 px-6 text-right">
                                            <Badge
                                                className={`border-none shadow-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${record.status === "PRESENT"
                                                        ? "bg-green-100 text-green-700"
                                                        : record.status === "ABSENT"
                                                            ? "bg-red-100 text-red-700"
                                                            : record.status === "LEAVE"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-orange-100 text-orange-700"
                                                    }`}
                                            >
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Search size={32} className="text-gray-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">No logs found</h3>
                                            <p className="text-sm text-gray-500">We couldn't find any attendance logs for the selected criteria.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
