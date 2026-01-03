import EmployeeSidebar from "@/components/employee/sidebar";
import { ReactNode } from "react";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <EmployeeSidebar />
            <main className="flex-1 ml-64">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
