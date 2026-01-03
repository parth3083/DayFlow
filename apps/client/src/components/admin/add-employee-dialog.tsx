"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createNewEmployee, clearEmployeeError } from "@/redux/slices/employeeSlice";
import { Loader2, CheckCircle2, Copy } from "lucide-react";

interface AddEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (employee: any) => void;
}

export default function AddEmployeeDialog({
    open,
    onOpenChange,
    onAdd,
}: AddEmployeeDialogProps) {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.employee);
    const { user } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        department: "",
        position: "",
        role: "employee" as const,
        companyName: "",
    });

    const [successData, setSuccessData] = useState<{
        loginId: string;
        temporaryPassword: string;
    } | null>(null);

    // Set company name from current user
    useEffect(() => {
        if (user?.companyName) {
            setFormData(prev => ({ ...prev, companyName: user.companyName }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearEmployeeError());

        const result = await dispatch(createNewEmployee({
            ...formData,
        }));

        if (createNewEmployee.fulfilled.match(result)) {
            const data = result.payload.data;
            if (data) {
                setSuccessData({
                    loginId: data.loginId,
                    temporaryPassword: data.temporaryPassword
                });
            }
            // Clear form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                department: "",
                position: "",
                role: "employee",
                companyName: user?.companyName || "",
            });
            onAdd(result.payload.data?.employee);
        }
    };

    const handleClose = () => {
        setSuccessData(null);
        onOpenChange(false);
    };

    if (successData) {
        return (
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Employee Created Successfully!</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-600 text-center">
                            Please share these temporary credentials with the employee. They will be required to change their password upon first login.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-3 border">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase tracking-wider">Login ID</Label>
                                <div className="flex items-center justify-between bg-white p-2 rounded border">
                                    <code className="text-sm font-semibold">{successData.loginId}</code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigator.clipboard.writeText(successData.loginId)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Copy size={14} />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase tracking-wider">Temporary Password</Label>
                                <div className="flex items-center justify-between bg-white p-2 rounded border">
                                    <code className="text-sm font-semibold">{successData.temporaryPassword}</code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigator.clipboard.writeText(successData.temporaryPassword)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Copy size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleClose} className="w-full bg-teal-600 hover:bg-teal-700">
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add New Employee</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                                id="firstName"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="John"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                                id="lastName"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Doe"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                            <Input
                                id="phoneNumber"
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department *</Label>
                            <Input
                                id="department"
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="Engineering"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="position">Position *</Label>
                            <Input
                                id="position"
                                required
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                placeholder="Software Developer"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 min-w-[140px]" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Add Employee"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
