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
import { updateEmployeeInfo, clearEmployeeError } from "@/redux/slices/employeeSlice";
import { Loader2 } from "lucide-react";
import type { User } from "@/types/auth.types";

interface EditEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: User;
    onSave: (employee: any) => void;
    isAdmin?: boolean;
}

export default function EditEmployeeDialog({
    open,
    onOpenChange,
    employee,
    onSave,
    isAdmin = false,
}: EditEmployeeDialogProps) {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.employee);

    const [formData, setFormData] = useState({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        department: employee.department,
        position: employee.position,
        joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : "",
        employmentType: employee.employmentType || "full-time",
        location: employee.location || "",
    });

    useEffect(() => {
        setFormData({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
            department: employee.department,
            position: employee.position,
            joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : "",
            employmentType: employee.employmentType || "full-time",
            location: employee.location || "",
        });
    }, [employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearEmployeeError());

        const result = await dispatch(updateEmployeeInfo({
            loginId: employee.loginId,
            data: formData
        }));

        if (updateEmployeeInfo.fulfilled.match(result)) {
            onSave(result.payload.data);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {isAdmin && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        value={formData.department || ""}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        value={formData.position || ""}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Company Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="joiningDate">Joining Date</Label>
                                        <Input
                                            id="joiningDate"
                                            type="date"
                                            value={formData.joiningDate}
                                            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="employmentType">Employment Type</Label>
                                        <select
                                            id="employmentType"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.employmentType}
                                            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                                            disabled={loading}
                                        >
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="location">Work Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Remote / New York Office"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {!isAdmin && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        value={formData.department}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        value={formData.position}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                            disabled={loading}
                        />
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
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    );
}
