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

interface EditSalaryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: {
        name: string;
        baseSalary: number;
        hra: number;
        da: number;
        bonus: number;
        deductions: number;
    };
    onSave: (salaryData: any) => void;
}

export default function EditSalaryDialog({
    open,
    onOpenChange,
    employee,
    onSave,
}: EditSalaryDialogProps) {
    const [formData, setFormData] = useState({
        wage: "50000",
        basicPercent: "50",
        hraPercent: "50",
        standardAllowance: "5000",
        ltaPercent: "10",
        pfRate: "12",
        professionalTax: "200",
    });

    useEffect(() => {
        // Initialize with employee data
        const totalComponents = employee.baseSalary + employee.hra + employee.da + employee.bonus;
        setFormData({
            wage: totalComponents.toString(),
            basicPercent: "50",
            hraPercent: "50",
            standardAllowance: employee.da.toString(),
            ltaPercent: "10",
            pfRate: "12",
            professionalTax: employee.deductions.toString(),
        });
    }, [employee]);

    const wage = parseFloat(formData.wage) || 0;
    const basic = (parseFloat(formData.basicPercent) / 100) * wage;
    const hra = (parseFloat(formData.hraPercent) / 100) * basic;
    const standardAllowance = parseFloat(formData.standardAllowance) || 0;
    const lta = (parseFloat(formData.ltaPercent) / 100) * basic;

    const totalComponents = basic + hra + standardAllowance + lta;
    const pfAmount = (parseFloat(formData.pfRate) / 100) * totalComponents;
    const professionalTaxAmount = parseFloat(formData.professionalTax) || 0;
    const totalDeductions = pfAmount + professionalTaxAmount;
    const netSalary = totalComponents - totalDeductions;

    const isValid = totalComponents <= wage;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) {
            alert("Total components exceed wage!");
            return;
        }

        onSave({
            baseSalary: basic,
            hra: hra,
            da: standardAllowance,
            bonus: lta,
            deductions: totalDeductions,
            total: netSalary,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit Salary - {employee.name}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="wage">Wage (Monthly) *</Label>
                        <Input
                            id="wage"
                            type="number"
                            required
                            value={formData.wage}
                            onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                            placeholder="50000"
                        />
                    </div>

                    {/* Salary Components Section */}
                    <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Salary Components</h3>

                        {/* Basic - % of Wage */}
                        <div className="space-y-2 bg-white p-3 rounded border">
                            <Label className="font-medium">Basic (% of Wage)</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    value={formData.basicPercent}
                                    onChange={(e) => setFormData({ ...formData, basicPercent: e.target.value })}
                                    placeholder="50"
                                    className="flex-1"
                                    min="0"
                                    max="100"
                                />
                                <span className="text-sm text-gray-600 min-w-[80px]">% of Wage</span>
                                <span className="text-sm font-medium text-teal-600 min-w-[120px] text-right">
                                    = ₹{basic.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* HRA - % of Basic */}
                        <div className="space-y-2 bg-white p-3 rounded border">
                            <Label className="font-medium">HRA (% of Basic)</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    value={formData.hraPercent}
                                    onChange={(e) => setFormData({ ...formData, hraPercent: e.target.value })}
                                    placeholder="50"
                                    className="flex-1"
                                    min="0"
                                    max="100"
                                />
                                <span className="text-sm text-gray-600 min-w-[80px]">% of Basic</span>
                                <span className="text-sm font-medium text-teal-600 min-w-[120px] text-right">
                                    = ₹{hra.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Standard Allowance - Fixed Amount */}
                        <div className="space-y-2 bg-white p-3 rounded border">
                            <Label className="font-medium">Standard Allowance (Fixed Amount)</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    value={formData.standardAllowance}
                                    onChange={(e) => setFormData({ ...formData, standardAllowance: e.target.value })}
                                    placeholder="5000"
                                    className="flex-1"
                                    min="0"
                                />
                                <span className="text-sm text-gray-600 min-w-[80px]">₹ (Fixed)</span>
                                <span className="text-sm font-medium text-teal-600 min-w-[120px] text-right">
                                    = ₹{standardAllowance.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* LTA - % of Basic */}
                        <div className="space-y-2 bg-white p-3 rounded border">
                            <Label className="font-medium">LTA - Leave Travel Allowance (% of Basic)</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    value={formData.ltaPercent}
                                    onChange={(e) => setFormData({ ...formData, ltaPercent: e.target.value })}
                                    placeholder="10"
                                    className="flex-1"
                                    min="0"
                                    max="100"
                                />
                                <span className="text-sm text-gray-600 min-w-[80px]">% of Basic</span>
                                <span className="text-sm font-medium text-teal-600 min-w-[120px] text-right">
                                    = ₹{lta.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Deductions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pfRate">PF Rate (%)</Label>
                                <Input
                                    id="pfRate"
                                    type="number"
                                    value={formData.pfRate}
                                    onChange={(e) => setFormData({ ...formData, pfRate: e.target.value })}
                                    placeholder="12"
                                    min="0"
                                    max="100"
                                />
                                <p className="text-xs text-gray-500">= ₹{pfAmount.toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="professionalTax">Professional Tax (₹)</Label>
                                <Input
                                    id="professionalTax"
                                    type="number"
                                    value={formData.professionalTax}
                                    onChange={(e) => setFormData({ ...formData, professionalTax: e.target.value })}
                                    placeholder="200"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className={`border-2 rounded-lg p-4 ${isValid ? 'bg-teal-50 border-teal-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Wage:</span>
                                <span className="font-medium">₹{wage.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Total Components:</span>
                                <span className={`font-medium ${!isValid ? 'text-red-600' : ''}`}>
                                    ₹{totalComponents.toLocaleString()}
                                </span>
                            </div>
                            {!isValid && (
                                <p className="text-xs text-red-600">⚠️ Total components exceed wage!</p>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Total Deductions:</span>
                                <span className="font-medium">₹{totalDeductions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-teal-300">
                                <span className="font-semibold text-gray-900">Net Salary:</span>
                                <span className="text-xl font-bold text-teal-600">
                                    ₹{netSalary.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={!isValid}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
