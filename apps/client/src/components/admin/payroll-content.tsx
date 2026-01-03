"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DollarSign,
    Users,
    TrendingUp,
    FileText,
    Search,
    Download,
    Edit,
} from "lucide-react";
import EditSalaryDialog from "./edit-salary-dialog";

const initialPayrollData = [
    {
        id: 1,
        name: "Sarah Johnson",
        employeeId: "EMP001",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        department: "Human Resources",
        baseSalary: 7083,
        hra: 2000,
        da: 1500,
        bonus: 1000,
        deductions: 850,
        netSalary: 10733,
        status: "Paid",
    },
    {
        id: 2,
        name: "Michael Chen",
        employeeId: "EMP002",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        department: "Engineering",
        baseSalary: 6250,
        hra: 1800,
        da: 1400,
        bonus: 800,
        deductions: 450,
        netSalary: 9800,
        status: "Paid",
    },
    {
        id: 3,
        name: "Emily Davis",
        employeeId: "EMP003",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        department: "Marketing",
        baseSalary: 5417,
        hra: 1600,
        da: 1200,
        bonus: 600,
        deductions: 380,
        netSalary: 8437,
        status: "Pending",
    },
    {
        id: 4,
        name: "James Wilson",
        employeeId: "EMP004",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        department: "Sales",
        baseSalary: 5000,
        hra: 1500,
        da: 1100,
        bonus: 750,
        deductions: 350,
        netSalary: 8000,
        status: "Pending",
    },
    {
        id: 5,
        name: "Lisa Anderson",
        employeeId: "EMP005",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        department: "Finance",
        baseSalary: 5833,
        hra: 1700,
        da: 1300,
        bonus: 650,
        deductions: 420,
        netSalary: 9063,
        status: "Paid",
    },
];

export default function PayrollContent() {
    const [payrollData, setPayrollData] = useState(initialPayrollData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const handleEditSalary = (employee: any) => {
        setSelectedEmployee(employee);
        setDialogOpen(true);
    };

    const handleSaveSalary = (salaryData: any) => {
        setPayrollData(
            payrollData.map((emp) =>
                emp.id === selectedEmployee.id
                    ? {
                        ...emp,
                        baseSalary: salaryData.baseSalary,
                        hra: salaryData.hra,
                        da: salaryData.da,
                        bonus: salaryData.bonus,
                        deductions: salaryData.deductions,
                        netSalary: salaryData.total,
                    }
                    : emp
            )
        );
        console.log("Updated salary:", salaryData);
    };
    const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
    const activeEmployees = payrollData.length;
    const paidCount = payrollData.filter((emp) => emp.status === "Paid").length;
    const pendingCount = payrollData.filter((emp) => emp.status === "Pending").length;

    return (
        <div className="w-[100%]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
                    <p className="text-gray-600 mt-1">Manage employee salaries and payments</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download size={16} />
                        Export
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
                        Process Payroll
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={DollarSign}
                    label="Total Monthly Payroll"
                    value={`$${totalPayroll.toLocaleString()}`}
                    iconColor="text-teal-600"
                    iconBgColor="bg-teal-50"
                />
                <StatCard
                    icon={Users}
                    label="Active Employees"
                    value={activeEmployees}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-50"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Paid This Month"
                    value={paidCount}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-50"
                />
                <StatCard
                    icon={FileText}
                    label="Pending Payments"
                    value={pendingCount}
                    iconColor="text-orange-600"
                    iconBgColor="bg-orange-50"
                />
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input placeholder="Search employees..." className="pl-10" />
                </div>
            </div>

            {/* Payroll Table */}
            <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">January 2026 Payroll</h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Base Salary</TableHead>
                            <TableHead className="text-right">Allowances</TableHead>
                            <TableHead className="text-right">Deductions</TableHead>
                            <TableHead className="text-right">Net Salary</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payrollData.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={employee.avatar} />
                                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900">{employee.name}</p>
                                            <p className="text-sm text-gray-500">{employee.employeeId}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-600">{employee.department}</TableCell>
                                <TableCell className="text-right font-medium">
                                    ₹{employee.baseSalary.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-green-600">
                                    +₹{(employee.hra + employee.da + employee.bonus).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-red-600">
                                    -₹{employee.deductions.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-gray-900">
                                    ₹{employee.netSalary.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            employee.status === "Paid"
                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                        }
                                    >
                                        {employee.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleEditSalary(employee)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Download size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedEmployee && (
                <EditSalaryDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    employee={selectedEmployee}
                    onSave={handleSaveSalary}
                />
            )}
        </div>
    );
}
