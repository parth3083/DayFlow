"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Plus } from "lucide-react";
import LeaveRequestDialog from "./leave-request-dialog";

const leaveRequests = [
    {
        id: 1,
        type: "Paid Leave",
        typeColor: "bg-green-100 text-green-700",
        dateRange: "Jan 10 - Jan 12, 2026",
        reason: "Family vacation",
        status: "Approved",
        statusColor: "bg-green-100 text-green-700",
        appliedDate: "Applied 12/28/2025",
    },
    {
        id: 2,
        type: "Sick Leave",
        typeColor: "bg-red-100 text-red-700",
        dateRange: "Jan 20 - Jan 21, 2026",
        reason: "Medical appointment",
        status: "Pending",
        statusColor: "bg-orange-100 text-orange-700",
        appliedDate: "Applied 1/2/2026",
    },
];

export default function LeaveRequestsContent() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleLeaveRequest = (request: any) => {
        console.log("New leave request:", request);
        // Here you would typically send the request to your backend
    };

    return (
        <div className="w-[100%]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
                    <p className="text-gray-600 mt-1">Apply for leave and track your requests</p>
                </div>
                <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 gap-2"
                >
                    <Plus size={18} />
                    Apply for Leave
                </Button>
            </div>

            <LeaveRequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleLeaveRequest}
            />

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Paid Leave</p>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                                <p className="text-xs text-gray-500">days remaining</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar size={24} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Sick Leave</p>
                                <p className="text-2xl font-bold text-gray-900">8</p>
                                <p className="text-xs text-gray-500">days remaining</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Casual Leave</p>
                                <p className="text-2xl font-bold text-gray-900">5</p>
                                <p className="text-xs text-gray-500">days remaining</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Unpaid Leave</p>
                                <p className="text-2xl font-bold text-gray-900">Unlimited</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* My Leave Requests */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">My Leave Requests</h2>

                    <div className="space-y-4">
                        {leaveRequests.map((request) => (
                            <Card key={request.id} className="border-2">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText size={24} className="text-teal-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={`${request.typeColor} hover:${request.typeColor}`}>
                                                        {request.type}
                                                    </Badge>
                                                    <Badge className={`${request.statusColor} hover:${request.statusColor}`}>
                                                        {request.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 mb-1">
                                                    {request.dateRange}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-2">{request.reason}</p>
                                                <p className="text-xs text-gray-500">{request.appliedDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
