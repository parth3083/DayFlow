"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LeaveType } from "@/services/leave.service";
import { Loader2 } from "lucide-react";

interface LeaveRequestDialogProps {
    open: boolean;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (request: {
        leaveType: string;
        startDate: string;
        endDate: string;
        remarks: string;
    }) => void;
}

export default function LeaveRequestDialog({
    open,
    loading,
    onOpenChange,
    onSubmit,
}: LeaveRequestDialogProps) {
    const [formData, setFormData] = useState({
        leaveType: LeaveType.PAID,
        startDate: "",
        endDate: "",
        remarks: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Apply for Leave</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="leaveType" className="text-xs font-black uppercase tracking-widest text-gray-400">Leave Type *</Label>
                        <Select
                            value={formData.leaveType}
                            onValueChange={(value) => setFormData({ ...formData, leaveType: value as LeaveType })}
                            required
                        >
                            <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:ring-teal-500/20 font-bold">
                                <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                <SelectItem value={LeaveType.PAID}>Paid Leave</SelectItem>
                                <SelectItem value={LeaveType.SICK}>Sick Leave</SelectItem>
                                <SelectItem value={LeaveType.UNPAID}>Unpaid Leave</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-xs font-black uppercase tracking-widest text-gray-400">Start Date *</Label>
                            <Input
                                id="startDate"
                                type="date"
                                required
                                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:ring-teal-500/20 font-bold"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-xs font-black uppercase tracking-widest text-gray-400">End Date *</Label>
                            <Input
                                id="endDate"
                                type="date"
                                required
                                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:ring-teal-500/20 font-bold"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="remarks" className="text-xs font-black uppercase tracking-widest text-gray-400">Remarks *</Label>
                        <Textarea
                            id="remarks"
                            required
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            placeholder="Please provide a brief reason or remarks for your request..."
                            className="min-h-[120px] rounded-2xl border-gray-100 bg-gray-50/50 focus:ring-teal-500/20 font-medium p-4"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                        <Button
                            type="button"
                            variant="ghost"
                            className="rounded-xl font-bold text-gray-500 hover:text-gray-900"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 rounded-xl font-bold px-8 shadow-lg shadow-teal-500/20 transition-transform active:scale-95"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                            Submit Request
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
