"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/admin/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import LeaveReviewDialog from "./leave-review-dialog";

const leaveRequests = [
    {
        id: 1,
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        leaveType: "Sick Leave",
        leaveTypeColor: "bg-red-100 text-red-700",
        startDate: "Jan 5",
        endDate: "Jan 6",
        duration: "2 days",
        reason: "Feeling unwell, need to visit the doctor",
        status: "pending",
    },
    {
        id: 2,
        name: "Emily Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        leaveType: "Paid Leave",
        leaveTypeColor: "bg-green-100 text-green-700",
        startDate: "Jan 8",
        endDate: "Jan 12",
        duration: "5 days",
        reason: "Family vacation planned",
        status: "pending",
    },
    {
        id: 3,
        name: "James Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        leaveType: "Casual Leave",
        leaveTypeColor: "bg-blue-100 text-blue-700",
        startDate: "Jan 10",
        endDate: "Jan 14",
        duration: "4 days",
        reason: "Personal work",
        status: "pending",
    },
    {
        id: 4,
        name: "Lisa Anderson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        leaveType: "Sick Leave",
        leaveTypeColor: "bg-red-100 text-red-700",
        startDate: "Jan 3",
        endDate: "Jan 4",
        duration: "2 days",
        reason: "Medical appointment",
        status: "approved",
    },
    {
        id: 5,
        name: "David Brown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        leaveType: "Paid Leave",
        leaveTypeColor: "bg-green-100 text-green-700",
        startDate: "Jan 2",
        endDate: "Jan 3",
        duration: "2 days",
        reason: "Personal reasons",
        status: "rejected",
    },
];

const LeaveRequestCard = ({
    request,
    onReview
}: {
    request: (typeof leaveRequests)[0];
    onReview?: (request: any) => void;
}) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={request.avatar} />
                            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{request.name}</h3>
                            <Badge className={`${request.leaveTypeColor} hover:${request.leaveTypeColor} mb-2`}>
                                {request.leaveType}
                            </Badge>
                            <p className="text-sm text-gray-600">
                                {request.startDate} - {request.endDate} • {request.duration}
                            </p>
                        </div>
                    </div>
                    {request.status === "pending" && onReview && (
                        <Button
                            className="bg-teal-600 hover:bg-teal-700"
                            onClick={() => onReview(request)}
                        >
                            Review
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function LeaveApprovalsContent() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    const pendingRequests = leaveRequests.filter((r) => r.status === "pending");
    const approvedRequests = leaveRequests.filter((r) => r.status === "approved");
    const rejectedRequests = leaveRequests.filter((r) => r.status === "rejected");

    const handleReview = (request: any) => {
        setSelectedRequest(request);
        setDialogOpen(true);
    };

    const handleApprove = (comment: string) => {
        console.log("Approved leave request:", selectedRequest, "Comment:", comment);
        // Here you would typically update the backend
    };

    const handleReject = (comment: string) => {
        console.log("Rejected leave request:", selectedRequest, "Comment:", comment);
        // Here you would typically update the backend
    };

    return (
        <div className="w-[100%]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Leave Approvals</h1>
                <p className="text-gray-600 mt-1">Review and manage leave requests</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={Clock}
                    label="Pending Requests"
                    value={pendingRequests.length}
                    iconColor="text-orange-600"
                    iconBgColor="bg-orange-50"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Approved"
                    value={approvedRequests.length}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-50"
                />
                <StatCard
                    icon={XCircle}
                    label="Rejected"
                    value={rejectedRequests.length}
                    iconColor="text-red-600"
                    iconBgColor="bg-red-50"
                />
            </div>

            {/* Leave Requests */}
            <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Leave Requests</h2>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4">
                        {pendingRequests.map((request) => (
                            <LeaveRequestCard
                                key={request.id}
                                request={request}
                                onReview={handleReview}
                            />
                        ))}
                    </TabsContent>

                    <TabsContent value="approved" className="space-y-4">
                        {approvedRequests.map((request) => (
                            <LeaveRequestCard key={request.id} request={request} />
                        ))}
                    </TabsContent>

                    <TabsContent value="rejected" className="space-y-4">
                        {rejectedRequests.map((request) => (
                            <LeaveRequestCard key={request.id} request={request} />
                        ))}
                    </TabsContent>
                </Tabs>
            </div>

            {selectedRequest && (
                <LeaveReviewDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    leaveRequest={{
                        employeeName: selectedRequest.name,
                        employeeAvatar: selectedRequest.avatar,
                        leaveType: selectedRequest.leaveType,
                        startDate: selectedRequest.startDate,
                        endDate: selectedRequest.endDate,
                        days: parseInt(selectedRequest.duration),
                        reason: selectedRequest.reason || "No reason provided",
                    }}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}
