"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Plus, Loader2, Info } from "lucide-react";
import LeaveRequestDialog from "./leave-request-dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchMyLeaves, applyLeave } from "@/redux/slices/leaveSlice";
import { LeaveStatus } from "@/services/leave.service";
import { format } from "date-fns";

export default function LeaveRequestsContent() {
    const dispatch = useAppDispatch();
    const { myLeaves, loading, error } = useAppSelector((state) => state.leave);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchMyLeaves());
    }, [dispatch]);

    const handleLeaveRequest = async (request: any) => {
        const result = await dispatch(applyLeave(request));
        if (applyLeave.fulfilled.match(result)) {
            setDialogOpen(false);
        }
    };

    // Calculate balances (Mock logic for now, could be fetched from backend)
    const balances = {
        annual: 12,
        sick: 8,
        casual: 5,
        other: 0
    };

    return (
        <div className="w-[100%] text-gray-900">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Leave Management</h1>
                    <p className="text-gray-500 mt-1 font-medium">Apply for time off and track your approval status</p>
                </div>
                <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 h-12 rounded-xl px-6 font-bold shadow-lg shadow-teal-500/20 gap-2 transition-transform active:scale-95 border-none"
                >
                    <Plus size={20} />
                    Apply for Leave
                </Button>
            </div>

            <LeaveRequestDialog
                open={dialogOpen}
                loading={loading}
                onOpenChange={setDialogOpen}
                onSubmit={handleLeaveRequest}
            />

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Annual Leave", count: balances.annual, color: "teal", icon: Calendar },
                    { label: "Sick Leave", count: balances.sick, color: "red", icon: Info },
                    { label: "Casual Leave", count: balances.casual, color: "blue", icon: FileText },
                    { label: "Other Leave", count: "Unlimited", color: "purple", icon: Plus },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} className={`text-${stat.color}-600`} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900">{stat.count}</p>
                                    {typeof stat.count === "number" && (
                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">DAYS REMAINING</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* My Leave Requests */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                    <h2 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">Request History</h2>

                    <div className="space-y-4">
                        {loading && myLeaves.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-teal-600" size={40} />
                                <p className="text-sm font-bold text-gray-500">Retrieving your requests...</p>
                            </div>
                        ) : myLeaves.length > 0 ? (
                            myLeaves.map((request, index) => (
                                <div key={request?.leaveId || index} className="relative group border border-gray-100 rounded-3xl p-6 hover:border-teal-100 hover:bg-teal-50/10 transition-all">
                                    {!request ? null : (
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                            <div className="flex items-start gap-5">
                                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                                                    <FileText size={28} className="text-gray-400 group-hover:text-teal-600 transition-colors" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <Badge className="bg-gray-900 text-white border-none shadow-none px-3 font-black text-[10px] uppercase tracking-wider">
                                                            {request.leaveType}
                                                        </Badge>
                                                        <Badge className={`border-none shadow-none px-3 font-black text-[10px] uppercase tracking-wider ${request.status === LeaveStatus.APPROVED ? "bg-green-100 text-green-700" :
                                                            request.status === LeaveStatus.REJECTED ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                                            }`}>
                                                            {request.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-lg font-black text-gray-900 mb-1">
                                                        {format(new Date(request.startDate), "MMM d, yyyy")} - {format(new Date(request.endDate), "MMM d, yyyy")}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-500 line-clamp-2 max-w-xl">{request.remarks}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-2">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                    Applied {request.createdAt ? format(new Date(request.createdAt), "MMM d, yyyy") : "Just now"}
                                                </p>
                                                {request.adminComment && (
                                                    <div className="bg-gray-50 p-3 rounded-2xl mt-2 max-w-xs transition-colors group-hover:bg-white">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight mb-1">Admin Comment</p>
                                                        <p className="text-xs font-medium text-gray-600 italic">"{request.adminComment}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <FileText size={40} className="text-gray-200" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">No requests yet</h3>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1 font-medium">When you apply for leave, your requests will appear here for tracking.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(true)}
                                    className="mt-4 rounded-xl font-bold border-gray-200 hover:bg-gray-50"
                                >
                                    Make your first request
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
