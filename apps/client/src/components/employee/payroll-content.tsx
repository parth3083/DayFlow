"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, FileText, Receipt, Loader2, Download } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchSalaryStructure, fetchMyPayslips } from "@/redux/slices/payrollSlice";
import { format } from "date-fns";

export default function PayrollContent() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { currentSalaryStructure, myPayslips, loading } = useAppSelector((state) => state.payroll);

    useEffect(() => {
        if (user?.loginId) {
            dispatch(fetchSalaryStructure(user.loginId));
            dispatch(fetchMyPayslips());
        }
    }, [dispatch, user?.loginId]);

    const stats = [
        {
            label: "Annual CTC",
            value: currentSalaryStructure ? `$${currentSalaryStructure.yearlyWage.toLocaleString()}` : "$0",
            icon: DollarSign,
            color: "teal"
        },
        {
            label: "Monthly Gross",
            value: currentSalaryStructure ? `$${currentSalaryStructure.monthlyWage.toLocaleString()}` : "$0",
            icon: TrendingUp,
            color: "green"
        },
        {
            label: "Total Allowances",
            value: currentSalaryStructure ? `$${(
                currentSalaryStructure.hra.amount +
                currentSalaryStructure.standardAllowance +
                currentSalaryStructure.performanceBonus.amount +
                currentSalaryStructure.lta.amount +
                currentSalaryStructure.fixedAllowance
            ).toLocaleString()}` : "$0",
            icon: Receipt,
            color: "blue"
        },
        {
            label: "Total Deductions",
            value: currentSalaryStructure ? `$${(currentSalaryStructure.pf.employeeContribution + currentSalaryStructure.professionalTax).toLocaleString()}` : "$0",
            icon: FileText,
            color: "red"
        },
    ];

    return (
        <div className="w-[100%] text-gray-900">
            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight">Financial Overview</h1>
                <p className="text-gray-500 mt-1 font-medium">Your authorized salary structure and payment history</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={28} className={`text-${stat.color}-600`} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Salary Structure */}
                <Card className="lg:col-span-1 border-none shadow-sm rounded-[2rem] overflow-hidden order-2 lg:order-1">
                    <CardContent className="p-8">
                        <h2 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">Salary Breakdown</h2>

                        {loading && !currentSalaryStructure ? (
                            <div className="py-20 flex justify-center">
                                <Loader2 className="animate-spin text-teal-600" size={32} />
                            </div>
                        ) : currentSalaryStructure ? (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    {[
                                        { label: "Basic Salary", value: currentSalaryStructure.basic.amount, type: "base" },
                                        { label: "HRA", value: currentSalaryStructure.hra.amount, type: "allowance" },
                                        { label: "Standard Allowance", value: currentSalaryStructure.standardAllowance, type: "allowance" },
                                        { label: "Performance Bonus", value: currentSalaryStructure.performanceBonus.amount, type: "allowance" },
                                        { label: "LTA", value: currentSalaryStructure.lta.amount, type: "allowance" },
                                        { label: "Fixed Allowance", value: currentSalaryStructure.fixedAllowance, type: "allowance" },
                                        { label: "PF Contribution", value: currentSalaryStructure.pf.employeeContribution, type: "deduction" },
                                        { label: "Professional Tax", value: currentSalaryStructure.professionalTax, type: "deduction" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1">
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">{item.label}</span>
                                            <span className={`font-black ${item.type === 'deduction' ? 'text-red-500' : 'text-gray-900'}`}>
                                                {item.type === 'deduction' ? '-' : ''}${item.value.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-lg font-black text-gray-900">Monthly Net</span>
                                    <span className="text-3xl font-black text-teal-600">
                                        ${(currentSalaryStructure.monthlyWage - currentSalaryStructure.pf.employeeContribution - currentSalaryStructure.professionalTax).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="py-10 text-center text-sm font-medium text-gray-400">Structure not configured</p>
                        )}
                    </CardContent>
                </Card>

                {/* Payment History */}
                <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden order-1 lg:order-2">
                    <CardContent className="p-8">
                        <h2 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">Payslip Repository</h2>

                        <div className="space-y-4">
                            {loading && myPayslips.length === 0 ? (
                                <div className="py-20 flex justify-center">
                                    <Loader2 className="animate-spin text-teal-600" size={32} />
                                </div>
                            ) : myPayslips.length > 0 ? (
                                myPayslips.map((payslip) => (
                                    <div key={payslip._id} className="group border border-gray-50 rounded-3xl p-6 hover:bg-gray-50 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-teal-600 transition-colors shadow-sm">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">
                                                    {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
                                                </p>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                    Generated {format(new Date(payslip.generatedDate), "MMM d, yyyy")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-xl font-black text-gray-900">${payslip.netSalary.toLocaleString()}</p>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-green-600 px-2 py-0.5 bg-green-50 rounded-full">
                                                    {payslip.status}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-colors">
                                                <Download size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <Receipt size={48} className="mx-auto text-gray-100 mb-4" />
                                    <p className="text-sm font-bold text-gray-400">No payslips have been generated yet</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
