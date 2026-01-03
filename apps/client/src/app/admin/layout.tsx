import AdminSidebar from "@/components/admin/sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 ml-64">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
