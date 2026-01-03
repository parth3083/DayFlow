"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/admin/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, Search, FileText, Loader2 } from "lucide-react";
import LeaveReviewDialog from "./leave-review-dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchAllLeaves, updateLeaveStatus } from "@/redux/slices/leaveSlice";
import { LeaveStatus } from "@/services/leave.service";
import { format, differenceInDays } from "date-fns";

const LeaveRequestCard = ({
    request,
    onReview
}: {
    request: any;
    onReview?: (request: any) => void;
}) => {
    const days = differenceInDays(new Date(request.endDate), new Date(request.startDate)) + 1;

    return (
        <Card className="border-none shadow-sm group hover:shadow-md transition-all rounded-3xl overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                            <span className="font-black text-teal-700 text-sm">{request.loginId.substring(0, 2)}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-black text-gray-900 group-hover:text-teal-600 transition-colors">{request.loginId}</h3>
                                <Badge className={`border-none shadow-none px-3 font-black text-[10px] uppercase tracking-wider ${request.leaveType === "sick" ? "bg-red-100 text-red-700" :
                                    request.leaveType === "paid" ? "bg-green-100 text-green-700" :
                                        "bg-blue-100 text-blue-700"
                                    }`}>
                                    {request.leaveType}
                                </Badge>
                            </div>
                            <p className="text-sm font-bold text-gray-400 mb-1">
                                {format(new Date(request.startDate), "MMM d")} - {format(new Date(request.endDate), "MMM d, yyyy")}
                            </p>
                            <p className="text-sm text-gray-600 font-medium italic">"{request.remarks}"</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                            {days} {days === 1 ? "Day" : "Days"}
                        </span>
                        {request.status === LeaveStatus.PENDING && onReview && (
                            <Button
                                className="bg-teal-600 hover:bg-teal-700 rounded-xl px-6 h-10 font-bold shadow-lg shadow-teal-500/20 gap-2 border-none transition-transform active:scale-95"
                                onClick={() => onReview(request)}
                            >
                                <Search size={16} />
                                Review
                            </Button>
                        )}
                        {request.status !== LeaveStatus.PENDING && (
                            <Badge className={`border-none shadow-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${request.status === LeaveStatus.APPROVED ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                {request.status}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function LeaveApprovalsContent() {
    const dispatch = useAppDispatch();
    const { allLeaves, loading } = useAppSelector((state) => state.leave);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    useEffect(() => {
        dispatch(fetchAllLeaves());
    }, [dispatch]);

    const pendingRequests = allLeaves.filter((r) => r.status === LeaveStatus.PENDING);
    const approvedRequests = allLeaves.filter((r) => r.status === LeaveStatus.APPROVED);
    const rejectedRequests = allLeaves.filter((r) => r.status === LeaveStatus.REJECTED);

    const handleReview = (request: any) => {
        setSelectedRequest(request);
        setDialogOpen(true);
    };

    const handleApprove = async (comment: string) => {
        if (!selectedRequest) return;
        const result = await dispatch(updateLeaveStatus({
            id: selectedRequest.leaveId || selectedRequest._id,
            status: LeaveStatus.APPROVED,
            adminComment: comment
        }));
        if (updateLeaveStatus.fulfilled.match(result)) {
            setDialogOpen(false);
        }
    };

    const handleReject = async (comment: string) => {
        if (!selectedRequest) return;
        const result = await dispatch(updateLeaveStatus({
            id: selectedRequest.leaveId || selectedRequest._id,
            status: LeaveStatus.REJECTED,
            adminComment: comment
        }));
        if (updateLeaveStatus.fulfilled.match(result)) {
            setDialogOpen(false);
        }
    };

    return (
        <div className="w-[100%]">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Leave Approvals</h1>
                <p className="text-gray-500 mt-1 font-medium italic">Review and manage the team's absence requests</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <div className="bg-white rounded-[2rem] border-none shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-gray-900">Request Queue</h2>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-8 bg-gray-50 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1">
                        <TabsTrigger value="pending" className="rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
                            Pending ({pendingRequests.length})
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
                            Approved
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm">
                            Rejected
                        </TabsTrigger>
                    </TabsList>

                    {loading && allLeaves.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="animate-spin text-teal-600" size={40} />
                            <p className="text-sm font-bold text-gray-500">Syncing with HQ...</p>
                        </div>
                    ) : (
                        <>
                            <TabsContent value="pending" className="space-y-4 focus-visible:outline-none">
                                {pendingRequests.length > 0 ? (
                                    pendingRequests?.map((request, index) => (
                                        <LeaveRequestCard
                                            key={request.leaveId || index}
                                            request={request}
                                            onReview={handleReview}
                                        />
                                    ))
                                ) : (
                                    <div className="py-20 text-center flex flex-col items-center gap-4">
                                        <CheckCircle size={48} className="text-gray-100" />
                                        <p className="text-sm font-bold text-gray-400">All caught up! No pending requests.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="approved" className="space-y-4 focus-visible:outline-none">
                                {approvedRequests.map((request, index) => (
                                    <LeaveRequestCard key={request.leaveId || index} request={request} />
                                ))}
                            </TabsContent>

                            <TabsContent value="rejected" className="space-y-4 focus-visible:outline-none">
                                {rejectedRequests.map((request, index) => (
                                    <LeaveRequestCard key={request.leaveId || index} request={request} />
                                ))}
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </div>

            {selectedRequest && (
                <LeaveReviewDialog
                    open={dialogOpen}
                    loading={loading}
                    onOpenChange={setDialogOpen}
                    leaveRequest={{
                        _id: selectedRequest.leaveId || selectedRequest._id,
                        loginId: selectedRequest.loginId,
                        leaveType: selectedRequest.leaveType,
                        startDate: format(new Date(selectedRequest.startDate), "MMM d, yyyy"),
                        endDate: format(new Date(selectedRequest.endDate), "MMM d, yyyy"),
                        days: selectedRequest.days || differenceInDays(new Date(selectedRequest.endDate), new Date(selectedRequest.startDate)) + 1,
                        remarks: selectedRequest.remarks || "No remarks provided",
                    }}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
}
