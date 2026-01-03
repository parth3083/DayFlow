"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    DollarSign,
    UserCircle,
    LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logoutUser } from "@/redux/slices/authSlice";
import { fetchMyAttendance } from "@/redux/slices/attendanceSlice";
import { fetchMyLeaves } from "@/redux/slices/leaveSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LeaveStatus } from "@/services/leave.service";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "Attendance", href: "/admin/attendance", icon: Calendar },
    { name: "Leave Approvals", href: "/admin/leave-approvals", icon: FileText },
    { name: "Payroll", href: "/admin/payroll", icon: DollarSign },
    { name: "My Profile", href: "/admin/profile", icon: UserCircle },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);
    const { todayRecord } = useAppSelector((state) => state.attendance);
    const { myLeaves } = useAppSelector((state) => state.leave);

    useEffect(() => {
        if (user) {
            dispatch(fetchMyAttendance({ page: 1, limit: 1 }));
            dispatch(fetchMyLeaves());
        }
    }, [dispatch, user]);

    const getStatus = () => {
        const today = new Date().toISOString().split('T')[0];

        // Check for leave
        const isOnLeave = myLeaves.some(l =>
            l.status === LeaveStatus.APPROVED &&
            today >= l.startDate.split('T')[0] &&
            today <= l.endDate.split('T')[0]
        );
        if (isOnLeave) return "red";

        // Check for attendance
        if (todayRecord && !todayRecord.checkOut) return "green";

        return "yellow";
    };

    const statusColor = {
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        red: "bg-red-500"
    }[getStatus()];

    const handleLogout = async () => {
        await dispatch(logoutUser());
        router.push("/auth/signin");
    };

    const initials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "SJ";
    const fullName = user ? `${user.firstName} ${user.lastName}` : "Sarah Johnson";
    const role = user ? (user.role === "admin" ? "Administrator" : "HR Manager") : "HR Manager";

    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="text-xl font-semibold">Dayflow</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-teal-600 text-white"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                        <Avatar>
                            <AvatarImage src={user?.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${statusColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{fullName}</p>
                        <p className="text-xs text-gray-400 truncate">{role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full px-2 py-1.5 rounded transition-colors"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
