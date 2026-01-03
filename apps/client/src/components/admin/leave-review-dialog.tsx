"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText, X, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { LeaveStatus } from "@/services/leave.service";

interface LeaveReviewDialogProps {
    open: boolean;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    leaveRequest: {
        _id: string;
        loginId: string;
        leaveType: string;
        startDate: string;
        endDate: string;
        days: number;
        remarks: string;
    };
    onApprove: (comment: string) => void;
    onReject: (comment: string) => void;
}

export default function LeaveReviewDialog({
    open,
    loading,
    onOpenChange,
    leaveRequest,
    onApprove,
    onReject,
}: LeaveReviewDialogProps) {
    const [comment, setComment] = useState("");

    const handleApprove = () => {
        onApprove(comment);
    };

    const handleReject = () => {
        onReject(comment);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 text-white">
                    <DialogTitle className="text-2xl font-black tracking-tight mb-2">Review Request</DialogTitle>
                    <p className="text-teal-100 text-sm font-medium opacity-80">Please carefully review the employee's leave details before deciding.</p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Employee Info Short */}
                    <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-black">
                            {leaveRequest.loginId.substring(0, 2)}
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Employee ID</p>
                            <p className="text-lg font-black text-gray-900">{leaveRequest.loginId}</p>
                        </div>
                    </div>

                    {/* Leave Details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50/30 p-4 rounded-2xl border border-gray-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Leave Type</p>
                                <p className="font-bold text-gray-900">{leaveRequest.leaveType}</p>
                            </div>
                            <div className="bg-gray-50/30 p-4 rounded-2xl border border-gray-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Duration</p>
                                <p className="font-bold text-gray-900">{leaveRequest.days} Days</p>
                            </div>
                        </div>

                        <div className="bg-gray-50/30 p-4 rounded-2xl border border-gray-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date Range</p>
                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                <Calendar size={16} className="text-teal-600" />
                                {leaveRequest.startDate} - {leaveRequest.endDate}
                            </div>
                        </div>

                        <div className="bg-gray-50/30 p-4 rounded-2xl border border-gray-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Remarks</p>
                            <p className="text-sm font-medium text-gray-600 italic">"{leaveRequest.remarks}"</p>
                        </div>
                    </div>

                    {/* Comment Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                            Admin Decision Comment
                        </label>
                        <Textarea
                            placeholder="Add a reason for approval/rejection..."
                            value={comment}
                            onChange={(e: any) => setComment(e.target.value)}
                            className="min-h-[100px] rounded-2xl border-gray-100 bg-gray-50/50 focus:ring-teal-500/20 font-medium p-4 resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-50">
                        <Button
                            variant="ghost"
                            onClick={handleReject}
                            disabled={loading}
                            className="flex-1 rounded-xl h-12 font-black text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 border-none transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                            Reject
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={loading}
                            className="flex-1 rounded-xl h-12 font-black bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/20 gap-2 transition-transform active:scale-95 border-none"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                            Approve
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
