"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Calendar, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchAdminStats } from "@/redux/slices/dashboardSlice";

export default function DashboardContent() {
    const dispatch = useAppDispatch();
    const { adminStats, loading } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchAdminStats());
    }, [dispatch]);

    if (loading && !adminStats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    const stats = adminStats || {
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        onLeaveToday: 0,
        pendingLeaves: 0,
    };

    const statCards = [
        {
            title: "Total Employees",
            value: stats.totalEmployees,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Present Today",
            value: stats.presentToday,
            icon: UserCheck,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            title: "Absent Today",
            value: stats.absentToday,
            icon: UserX,
            color: "text-red-600",
            bg: "bg-red-50",
        },
        {
            title: "On Leave Today",
            value: stats.onLeaveToday,
            icon: Calendar,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            title: "Pending Leaves",
            value: stats.pendingLeaves,
            icon: Clock,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    return (
        <div className="w-[100%]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your HR operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {statCards.map((card, index) => (
                    <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-x-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="w-8 h-8 text-teal-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Operational Insights</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Detailed charts, distribution by department, and attendance trends will appear here as more data is collected.
                    </p>
                </div>
            </div>
        </div>
    );
}
