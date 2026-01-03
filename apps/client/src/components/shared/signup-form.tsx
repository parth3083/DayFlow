"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

export function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="text-xl font-semibold">Dayflow</span>
            </div>

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Create an account</h2>
                <p className="text-gray-600 text-sm">Fill in your details to get started</p>
            </div>

            {/* Form */}
            <form className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                    </div>
                </div>

                {/* Employee ID */}
                <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" placeholder="EMP001" />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@company.com" />
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="hr-manager">HR Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Create Account →
                </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 mb-3">Demo Credentials</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <p className="font-semibold text-gray-700">Admin</p>
                        <p className="text-gray-600">admin@dayflow.com</p>
                        <p className="text-gray-500">Password: any (4+ chars)</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Employee</p>
                        <p className="text-gray-600">employee@dayflow.com</p>
                        <p className="text-gray-500">Password: any (4+ chars)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
