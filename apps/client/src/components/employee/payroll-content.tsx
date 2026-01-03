import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, FileText, Receipt } from "lucide-react";

const salaryBreakdown = [
    { label: "Basic Salary", amount: 6250, type: "base" },
    { label: "Housing Allowance", amount: 300, type: "allowance" },
    { label: "Transport Allowance", amount: 200, type: "allowance" },
    { label: "Tax Deduction", amount: -350, type: "deduction" },
    { label: "Insurance", amount: -100, type: "deduction" },
];

export default function PayrollContent() {
    const netSalary = salaryBreakdown.reduce((sum, item) => sum + item.amount, 0);
    const totalAllowances = salaryBreakdown
        .filter((item) => item.type === "allowance")
        .reduce((sum, item) => sum + item.amount, 0);
    const totalDeductions = Math.abs(
        salaryBreakdown
            .filter((item) => item.type === "deduction")
            .reduce((sum, item) => sum + item.amount, 0)
    );

    return (
        <div className="w-[100%]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
                <p className="text-gray-600 mt-1">View your salary details and payment history</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <DollarSign size={24} className="text-teal-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Annual Salary</p>
                                <p className="text-2xl font-bold text-gray-900">$75,000</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingUp size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Monthly Gross</p>
                                <p className="text-2xl font-bold text-gray-900">$6,250</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Receipt size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Allowances</p>
                                <p className="text-2xl font-bold text-green-600">+${totalAllowances}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText size={24} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Deductions</p>
                                <p className="text-2xl font-bold text-red-600">-${totalDeductions}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Current Month Breakdown */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Month Breakdown</h2>

                    <div className="space-y-4">
                        {salaryBreakdown.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                <span className="text-gray-700">{item.label}</span>
                                <span
                                    className={`font-semibold ${item.type === "allowance"
                                        ? "text-green-600"
                                        : item.type === "deduction"
                                            ? "text-red-600"
                                            : "text-gray-900"
                                        }`}
                                >
                                    {item.type === "allowance" && "+"}
                                    {item.type === "deduction" && "-"}
                                    ${Math.abs(item.amount).toLocaleString()}
                                </span>
                            </div>
                        ))}

                        {/* Net Salary */}
                        <div className="flex items-center justify-between py-4 border-t-2 border-teal-600 mt-4">
                            <span className="text-lg font-semibold text-gray-900">Net Salary</span>
                            <span className="text-2xl font-bold text-teal-600">${netSalary.toLocaleString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
                    <div className="text-center py-8 text-gray-500">
                        <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>Payment history will be displayed here</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
