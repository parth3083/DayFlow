import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Briefcase,
    Calendar,
    Phone,
    MapPin,
    Edit,
    IdCard,
} from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="w-[100%]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">View and manage your personal information</p>
            </div>

            {/* Profile Header Card */}
            <Card className="mb-6">
                <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-6">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                                <AvatarFallback className="text-2xl">SJ</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Sarah Johnson</h2>
                                <p className="text-gray-600 mb-3">HR Manager</p>
                                <Badge className="bg-teal-600 hover:bg-teal-700">HR / Admin</Badge>
                            </div>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Edit size={16} />
                            Edit
                        </Button>
                    </div>

                    {/* Quick Info */}
                    <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                                <Briefcase size={20} className="text-teal-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Department</p>
                                <p className="font-medium text-gray-900">Human Resources</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                                <Calendar size={20} className="text-teal-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Member since</p>
                                <p className="font-medium text-gray-900">Jan 2022</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <IdCard size={20} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Employee ID</p>
                                    <p className="font-medium text-gray-900">EMP001</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Briefcase size={20} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Department</p>
                                    <p className="font-medium text-gray-900">Human Resources</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar size={20} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Join Date</p>
                                    <p className="font-medium text-gray-900">January 15, 2022</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail size={20} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="font-medium text-gray-900">admin@dayflow.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Briefcase size={20} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Position</p>
                                    <p className="font-medium text-gray-900">HR Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editable Information */}
                    <div className="mt-8 pt-8 border-t">
                        <h4 className="text-lg font-semibold text-gray-900 mb-6">Editable Information</h4>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone size={20} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                    <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin size={20} className="text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 mb-1">Address</p>
                                    <p className="font-medium text-gray-900">123 Corporate Ave, New York, NY 10001</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
