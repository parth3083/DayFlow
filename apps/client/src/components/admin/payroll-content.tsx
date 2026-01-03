"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatCard from "@/components/admin/stat-card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DollarSign,
    Users,
    TrendingUp,
    FileText,
    Search,
    Download,
    Edit,
    Loader2,
    CheckCircle,
} from "lucide-react";
import EditSalaryDialog from "./edit-salary-dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchEmployees } from "@/redux/slices/employeeSlice";
import { fetchAllPayslips, generatePayslip } from "@/redux/slices/payrollSlice";
import { format } from "date-fns";

export default function PayrollContent() {
    const dispatch = useAppDispatch();
    const { employees, loading: employeesLoading } = useAppSelector((state) => state.employee);
    const { allPayslips, loading: payrollLoading } = useAppSelector((state) => state.payroll);

    const [searchQuery, setSearchQuery] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<{ loginId: string; firstName: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState("");

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        dispatch(fetchEmployees({ limit: 100 }));
        dispatch(fetchAllPayslips());
    }, [dispatch]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp =>
            emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.loginId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [employees, searchQuery]);

    const payrollStats = useMemo(() => {
        const thisMonthPayslips = allPayslips.filter(p => p.month === currentMonth && p.year === currentYear);
        const totalAmount = thisMonthPayslips.reduce((sum, p) => sum + p.netSalary, 0);
        return {
            total: totalAmount,
            paid: thisMonthPayslips.filter(p => p.status === "PAID").length,
            pending: employees.length - thisMonthPayslips.length,
            totalEmployees: employees.length
        };
    }, [allPayslips, employees, currentMonth, currentYear]);

    const handleEditSalary = (loginId: string, firstName: string) => {
        setSelectedEmployee({ loginId, firstName });
        setDialogOpen(true);
    };

    const handleProcessPayroll = async () => {
        setIsProcessing(true);
        setProcessingStatus("Initiating payroll cycle...");

        try {
            // Filter employees who don't have a payslip for this month yet
            const employeesToProcess = employees.filter(emp =>
                !allPayslips.some(p => p.loginId === emp.loginId && p.month === currentMonth && p.year === currentYear)
            );

            for (let i = 0; i < employeesToProcess.length; i++) {
                const emp = employeesToProcess[i];
                setProcessingStatus(`Generating ${i + 1}/${employeesToProcess.length}: ${emp.firstName}`);
                await dispatch(generatePayslip({
                    loginId: emp.loginId,
                    month: currentMonth,
                    year: currentYear
                })).unwrap();
            }

            setProcessingStatus("Payroll cycle completed!");
            dispatch(fetchAllPayslips());
        } catch (error) {
            console.error("Payroll processing failed:", error);
            setProcessingStatus("Processing failed. Please check logs.");
        } finally {
            setTimeout(() => {
                setIsProcessing(false);
                setProcessingStatus("");
            }, 3000);
        }
    };

    return (
        <div className="w-[100%] text-gray-900">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Financial Treasury</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Execute organization-wide payroll and configure salary structures</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-6 gap-2 border-2 border-gray-100 hover:bg-gray-50">
                        <Download size={16} />
                        Export Audit
                    </Button>
                    <Button
                        onClick={handleProcessPayroll}
                        disabled={isProcessing}
                        className="bg-teal-600 hover:bg-teal-700 rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-8 shadow-xl shadow-teal-500/20 gap-2 transition-all active:scale-95"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <TrendingUp size={16} />}
                        {isProcessing ? "Processing..." : "Execute Cycle"}
                    </Button>
                </div>
            </div>

            {isProcessing && (
                <div className="mb-8 p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                    <Loader2 className="animate-spin text-teal-600" size={20} />
                    <span className="text-sm font-black text-teal-700 uppercase tracking-widest">{processingStatus}</span>
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    icon={DollarSign}
                    label="Current Cycle Budget"
                    value={`$${payrollStats.total.toLocaleString()}`}
                    iconColor="text-teal-600"
                    iconBgColor="bg-teal-50"
                />
                <StatCard
                    icon={Users}
                    label="Payroll Population"
                    value={payrollStats.totalEmployees}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-50"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Payslips Generated"
                    value={employees.length - payrollStats.pending}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-50"
                />
                <StatCard
                    icon={FileText}
                    label="Pending Execution"
                    value={payrollStats.pending}
                    iconColor="text-orange-600"
                    iconBgColor="bg-orange-50"
                />
            </div>

            {/* Search Bar */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                    <Input
                        placeholder="Scan employees or IDs..."
                        className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-teal-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl shadow-sm text-sm font-black uppercase tracking-widest text-gray-400">
                    Cycle: <span className="text-teal-600 font-black">{format(new Date(), "MMMM yyyy")}</span>
                </div>
            </div>

            {/* Payroll Table */}
            <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border-none mb-12">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900">Global Salary Directory</h2>
                    <Badge className="bg-blue-50 text-blue-700 border-none font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">Live Sync</Badge>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-8 h-16 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-gray-400">Department</TableHead>
                                <TableHead className="text-right h-16 text-[10px] font-black uppercase tracking-widest text-gray-400">Net Disbursement</TableHead>
                                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-gray-400">Cycle Status</TableHead>
                                <TableHead className="text-right h-16 text-[10px] font-black uppercase tracking-widest text-gray-400">Action Center</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employeesLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-24 text-center">
                                        <Loader2 className="animate-spin text-teal-600 mx-auto mb-4" size={40} />
                                        <p className="text-sm font-bold text-gray-400 italic">Decrypting financial ledger...</p>
                                    </TableCell>
                                </TableRow>
                            ) : filteredEmployees.map((employee) => {
                                const payslip = allPayslips.find(p => p.loginId === employee.loginId && p.month === currentMonth && p.year === currentYear);
                                return (
                                    <TableRow key={employee._id} className="group hover:bg-gray-50/50 transition-colors border-gray-50">
                                        <TableCell className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all font-mono text-sm uppercase">
                                                    {employee.loginId.substring(0, 3)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 transition-colors group-hover:text-teal-600">{employee.firstName + " " + employee.lastName}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{employee.loginId}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-gray-100 bg-white font-bold text-gray-500 rounded-lg px-3 py-1">
                                                {employee.department || "General"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <p className="font-black text-gray-900 text-lg">
                                                {payslip ? `$${payslip.netSalary.toLocaleString()}` : "$---"}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`border-none shadow-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${payslip
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-orange-100 text-orange-700"
                                                    }`}
                                            >
                                                {payslip ? "Generated" : "Cycle Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right px-8">
                                            <div className="flex items-center justify-end gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-10 h-10 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition-all"
                                                    onClick={() => handleEditSalary(employee.loginId, employee.firstName)}
                                                    title="Audit Structure"
                                                >
                                                    <Edit size={18} />
                                                </Button>
                                                {payslip && (
                                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all" title="Review Statement">
                                                        <FileText size={18} />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {selectedEmployee && (
                <EditSalaryDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    loginId={selectedEmployee.loginId}
                    employeeName={selectedEmployee.firstName}
                />
            )}
        </div>
    );
}
