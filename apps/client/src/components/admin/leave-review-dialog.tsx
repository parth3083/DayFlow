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
import { Calendar, FileText, X, CheckCircle, XCircle } from "lucide-react";

interface LeaveReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    leaveRequest: {
        employeeName: string;
        employeeAvatar?: string;
        leaveType: string;
        startDate: string;
        endDate: string;
        days: number;
        reason: string;
    };
    onApprove: (comment: string) => void;
    onReject: (comment: string) => void;
}

export default function LeaveReviewDialog({
    open,
    onOpenChange,
    leaveRequest,
    onApprove,
    onReject,
}: LeaveReviewDialogProps) {
    const [comment, setComment] = useState("");

    const handleApprove = () => {
        onApprove(comment);
        setComment("");
        onOpenChange(false);
    };

    const handleReject = () => {
        onReject(comment);
        setComment("");
        onOpenChange(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Review Leave Request</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Employee Info */}
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 bg-teal-600">
                            {leaveRequest.employeeAvatar ? (
                                <AvatarImage src={leaveRequest.employeeAvatar} />
                            ) : null}
                            <AvatarFallback className="bg-teal-600 text-white text-lg">
                                {getInitials(leaveRequest.employeeName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-gray-900">{leaveRequest.employeeName}</p>
                            <p className="text-sm text-gray-600">{leaveRequest.leaveType}</p>
                        </div>
                    </div>

                    {/* Leave Details */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Calendar size={18} className="text-gray-600 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-900">
                                    {leaveRequest.startDate} - {leaveRequest.endDate}
                                </p>
                                <p className="text-xs text-gray-500">({leaveRequest.days} days)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FileText size={18} className="text-gray-600 mt-0.5" />
                            <p className="text-sm text-gray-900">{leaveRequest.reason}</p>
                        </div>
                    </div>

                    {/* Comment Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <FileText size={14} />
                            Comment (optional)
                        </label>
                        <Textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e: any) => setComment(e.target.value)}
                            className="min-h-[100px] resize-none border-teal-200 focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={handleReject}
                        className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                        <XCircle size={18} />
                        Reject
                    </Button>
                    <Button
                        onClick={handleApprove}
                        className="gap-2 bg-teal-600 hover:bg-teal-700"
                    >
                        <CheckCircle size={18} />
                        Approve
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
