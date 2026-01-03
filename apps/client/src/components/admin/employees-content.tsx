"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Edit } from "lucide-react";
import AddEmployeeDialog from "./add-employee-dialog";
import EditEmployeeDialog from "@/components/shared/edit-employee-dialog";

const initialEmployees = [
    {
        id: 1,
        name: "Michael Chen",
        email: "employee@dayflow.com",
        department: "Engineering",
        position: "Software Developer",
        phone: "+1 (555) 987-6543",
        address: "456 Tech Street, San Francisco, CA 94102",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "admin@dayflow.com",
        department: "Management",
        position: "HR Manager",
        phone: "+1 (555) 123-4567",
        address: "123 Admin Ave, San Francisco, CA 94103",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        id: 3,
        name: "Emily Davis",
        email: "emily@dayflow.com",
        department: "Marketing",
        position: "Marketing Specialist",
        phone: "+1 (555) 234-5678",
        address: "789 Market St, San Francisco, CA 94104",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
];

export default function EmployeesContent() {
    const [employees, setEmployees] = useState(initialEmployees);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const handleAddEmployee = (employee: any) => {
        const newEmployee = {
            ...employee,
            id: employees.length + 1,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`,
        };
        setEmployees([...employees, newEmployee]);
        console.log("Added employee:", newEmployee);
    };

    const handleEditEmployee = (employee: any) => {
        setSelectedEmployee(employee);
        setEditDialogOpen(true);
    };

    const handleSaveEmployee = (updatedEmployee: any) => {
        setEmployees(
            employees.map((emp) =>
                emp.id === selectedEmployee.id ? { ...emp, ...updatedEmployee } : emp
            )
        );
        console.log("Updated employee:", updatedEmployee);
    };

    return (
        <div className="w-[100%]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
                    <p className="text-gray-600 mt-1">Manage your workforce</p>
                </div>
                <Button
                    onClick={() => setAddDialogOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 gap-2"
                >
                    <Plus size={18} />
                    Add Employee
                </Button>
            </div>

            {/* Employees Table */}
            <Card>
                <CardContent className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={employee.avatar} />
                                                <AvatarFallback>
                                                    {employee.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {employee.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {employee.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{employee.department}</Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-900">
                                        {employee.position}
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {employee.phone}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditEmployee(employee)}
                                            className="gap-2"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddEmployeeDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onAdd={handleAddEmployee}
            />

            {selectedEmployee && (
                <EditEmployeeDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    employee={selectedEmployee}
                    onSave={handleSaveEmployee}
                    isAdmin={true}
                />
            )}
        </div>
    );
}
