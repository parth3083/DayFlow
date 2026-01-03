"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function SigninForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple role-based routing based on email
        if (email.includes("admin") || email.includes("hr")) {
            router.push("/admin/dashboard");
        } else {
            router.push("/employee/dashboard");
        }
    };

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
                <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
                <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Sign in →
                </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                        Sign up
                    </Link>
                </p>
            </div>

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
