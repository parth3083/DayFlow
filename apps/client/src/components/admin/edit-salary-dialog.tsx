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
import { fetchSalaryStructure, updateSalaryStructure } from "@/redux/slices/payrollSlice";
import { Loader2 } from "lucide-react";

interface EditSalaryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loginId: string;
    employeeName: string;
}

export default function EditSalaryDialog({
    open,
    onOpenChange,
    loginId,
    employeeName,
}: EditSalaryDialogProps) {
    const dispatch = useAppDispatch();
    const { currentSalaryStructure, loading } = useAppSelector((state) => state.payroll);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        monthlyWage: "0",
        basicPercent: "50",
        hraPercentOfBasic: "50",
        standardAllowance: "4167",
        performanceBonusPercentOfBasic: "8.33",
        ltaPercentOfBasic: "8.333",
        fixedAllowance: "0",
        pfRate: "12",
        professionalTax: "200",
    });

    useEffect(() => {
        if (open && loginId) {
            dispatch(fetchSalaryStructure(loginId));
        }
    }, [open, loginId, dispatch]);

    useEffect(() => {
        if (currentSalaryStructure) {
            setFormData({
                monthlyWage: currentSalaryStructure.monthlyWage.toString(),
                basicPercent: currentSalaryStructure.basic.percentage?.toString() || "50",
                hraPercentOfBasic: currentSalaryStructure.hra.percentageOfBasic?.toString() || "50",
                standardAllowance: currentSalaryStructure.standardAllowance.toString(),
                performanceBonusPercentOfBasic: currentSalaryStructure.performanceBonus.percentageOfBasic?.toString() || "8.33",
                ltaPercentOfBasic: currentSalaryStructure.lta.percentageOfBasic?.toString() || "8.333",
                fixedAllowance: currentSalaryStructure.fixedAllowance.toString(),
                pfRate: currentSalaryStructure.pf.rate?.toString() || "12",
                professionalTax: currentSalaryStructure.professionalTax.toString(),
            });
        }
    }, [currentSalaryStructure]);

    // Derived Calculations
    const monthlyWage = parseFloat(formData.monthlyWage) || 0;
    const basicAmount = (parseFloat(formData.basicPercent) / 100) * monthlyWage;
    const hraAmount = (parseFloat(formData.hraPercentOfBasic) / 100) * basicAmount;
    const performanceBonusAmount = (parseFloat(formData.performanceBonusPercentOfBasic) / 100) * basicAmount;
    const ltaAmount = (parseFloat(formData.ltaPercentOfBasic) / 100) * basicAmount;
    const stdAllowance = parseFloat(formData.standardAllowance) || 0;
    const fixAllowance = parseFloat(formData.fixedAllowance) || 0;

    const totalEarnings = basicAmount + hraAmount + stdAllowance + performanceBonusAmount + ltaAmount + fixAllowance;
    const pfAmount = (parseFloat(formData.pfRate) / 100) * basicAmount; // Usually on Basic
    const profTax = parseFloat(formData.professionalTax) || 0;

    const netSalary = totalEarnings - pfAmount - profTax;
    const isValid = totalEarnings >= monthlyWage; // Simplistic check

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await dispatch(updateSalaryStructure({
                loginId,
                monthlyWage,
                yearlyWage: monthlyWage * 12,
                basic: { percentage: parseFloat(formData.basicPercent), amount: basicAmount },
                hra: { percentageOfBasic: parseFloat(formData.hraPercentOfBasic), amount: hraAmount },
                standardAllowance: stdAllowance,
                performanceBonus: { percentageOfBasic: parseFloat(formData.performanceBonusPercentOfBasic), amount: performanceBonusAmount },
                lta: { percentageOfBasic: parseFloat(formData.ltaPercentOfBasic), amount: ltaAmount },
                fixedAllowance: fixAllowance,
                pf: { rate: parseFloat(formData.pfRate), employeeContribution: pfAmount, employerContribution: pfAmount },
                professionalTax: profTax,
            })).unwrap();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update salary:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-none shadow-2xl rounded-[2rem] p-0">
                <DialogHeader className="p-8 border-b border-gray-50 bg-gray-50/50 rounded-t-[2rem]">
                    <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                        Configure Salary - <span className="text-teal-600">{employeeName}</span>
                    </DialogTitle>
                </DialogHeader>

                {loading && !currentSalaryStructure ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-teal-600" size={40} />
                        <p className="text-sm font-bold text-gray-500 italic">Accessing financial records...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Main Wage */}
                        <div className="bg-teal-50/50 p-6 rounded-3xl border border-teal-100/50">
                            <Label htmlFor="monthlyWage" className="text-xs font-black uppercase tracking-widest text-teal-700/60 mb-2 block">Monthly Gross Wage (Target)</Label>
                            <Input
                                id="monthlyWage"
                                type="number"
                                required
                                value={formData.monthlyWage}
                                onChange={(e) => setFormData({ ...formData, monthlyWage: e.target.value })}
                                className="text-3xl font-black h-auto py-3 bg-transparent border-none text-teal-900 focus-visible:ring-0 placeholder:text-teal-200"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Components Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Earnings Components</h3>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Basic (% of Gross)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={formData.basicPercent}
                                                onChange={(e) => setFormData({ ...formData, basicPercent: e.target.value })}
                                                className="w-20 font-bold rounded-xl"
                                            />
                                            <span className="text-xs font-bold text-gray-400">=</span>
                                            <span className="font-black text-gray-900">${basicAmount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">HRA (% of Basic)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={formData.hraPercentOfBasic}
                                                onChange={(e) => setFormData({ ...formData, hraPercentOfBasic: e.target.value })}
                                                className="w-20 font-bold rounded-xl"
                                            />
                                            <span className="text-xs font-bold text-gray-400">=</span>
                                            <span className="font-black text-gray-900">${hraAmount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Std Allowance ($)</Label>
                                        <Input
                                            type="number"
                                            value={formData.standardAllowance}
                                            onChange={(e) => setFormData({ ...formData, standardAllowance: e.target.value })}
                                            className="font-bold rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Deductions & Others</h3>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">PF Rate (% of Basic)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={formData.pfRate}
                                                onChange={(e) => setFormData({ ...formData, pfRate: e.target.value })}
                                                className="w-20 font-bold rounded-xl"
                                            />
                                            <span className="text-xs font-bold text-gray-400">=</span>
                                            <span className="font-black text-red-500">-${pfAmount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prof Tax ($)</Label>
                                        <Input
                                            type="number"
                                            value={formData.professionalTax}
                                            onChange={(e) => setFormData({ ...formData, professionalTax: e.target.value })}
                                            className="font-bold rounded-xl text-red-500"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Performance Bonus (% of Basic)</Label>
                                        <Input
                                            type="number"
                                            value={formData.performanceBonusPercentOfBasic}
                                            onChange={(e) => setFormData({ ...formData, performanceBonusPercentOfBasic: e.target.value })}
                                            className="font-bold rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Footer */}
                        <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Calculated Monthly Net</p>
                                <p className="text-4xl font-black text-teal-600">${netSalary.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    className="rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-6"
                                >
                                    Discard
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-teal-600 hover:bg-teal-700 rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-8 shadow-xl shadow-teal-500/20 gap-2 transition-transform active:scale-95"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : "Authorize Structure"}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
