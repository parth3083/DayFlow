import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    iconColor?: string;
    iconBgColor?: string;
}

export default function StatCard({
    icon: Icon,
    label,
    value,
    iconColor = "text-teal-600",
    iconBgColor = "bg-teal-50",
}: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon size={24} className={iconColor} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">{label}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
