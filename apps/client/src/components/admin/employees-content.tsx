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
import { Plus, Edit, Loader2 } from "lucide-react";
import AddEmployeeDialog from "./add-employee-dialog";
import EditEmployeeDialog from "@/components/shared/edit-employee-dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { fetchEmployees, setSelectedEmployee, toggleEmployeeStatus } from "@/redux/slices/employeeSlice";

export default function EmployeesContent() {
    const dispatch = useAppDispatch();
    const { employees, loading, error, pagination } = useAppSelector((state) => state.employee);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { selectedEmployee } = useAppSelector((state) => state.employee);

    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, limit: 10 }));
    }, [dispatch]);

    const handleAddEmployee = (employee: any) => {
        // This will be handled by the dialog's success state
        setAddDialogOpen(false);
        dispatch(fetchEmployees({ page: 1, limit: 10 }));
    };

    const handleEditEmployee = (employee: any) => {
        dispatch(setSelectedEmployee(employee));
        setEditDialogOpen(true);
    };

    const handleSaveEmployee = (updatedEmployee: any) => {
        setEditDialogOpen(false);
        dispatch(fetchEmployees({ page: 1, limit: 10 }));
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal-600 mb-2" />
                                        <p className="text-sm text-gray-500">Loading employees...</p>
                                    </TableCell>
                                </TableRow>
                            ) : employees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10">
                                        <p className="text-sm text-gray-500">No employees found.</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((employee) => (
                                    <TableRow key={employee._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={employee.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}`} />
                                                    <AvatarFallback>
                                                        {employee.firstName.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {employee.firstName} {employee.lastName}
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
                                            {employee.phoneNumber}
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
                                ))
                            )}
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
