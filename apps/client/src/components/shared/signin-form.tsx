"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { loginUser, clearError } from "@/redux/slices/authSlice";

type LoginMethod = 'email' | 'loginId';

export function SigninForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
    const [email, setEmail] = useState("");
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated, passwordChangeRequired, user } = useAppSelector(
        (state) => state.auth
    );

    // Clear error when component unmounts or when user starts typing
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            // Clear error after 5 seconds
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    // Handle successful login
    useEffect(() => {
        if (isAuthenticated && user) {
            // We'll let handleSignIn take care of initial redirection
            // This is just a backup for cases like "remember me" or direct access
            // but since we refresh the page or redirect from handleSignIn,
            // we should be careful about double-navigating.
        }
    }, [isAuthenticated, user, router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        const credentials = loginMethod === 'email'
            ? { email, password }
            : { loginId, password };

        const res = await dispatch(loginUser(credentials));

        if (loginUser.fulfilled.match(res)) {
            const { employee, passwordChangeRequired: isRequired } = res.payload;

            if (isRequired) {
                router.push("/auth/change-password");
            } else {
                // Route based on role
                if (employee.role === "admin" || employee.role === "hr") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/employee/dashboard");
                }
            }
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

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
                {/* Login Method Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${loginMethod === 'email'
                            ? 'bg-white text-teal-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Email
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginMethod('loginId')}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${loginMethod === 'loginId'
                            ? 'bg-white text-teal-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Login ID
                    </button>
                </div>

                {/* Email or Login ID */}
                {loginMethod === 'email' ? (
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="loginId">Login ID</Label>
                        <Input
                            id="loginId"
                            type="text"
                            placeholder="TSIJODO202601"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value.toUpperCase())}
                            required
                            disabled={loading}
                        />
                    </div>
                )}

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
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign in →'
                    )}
                </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                        Contact HR
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
                        <p className="text-gray-500">AdminPassword@123</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">Login ID</p>
                        <p className="text-gray-600">DSUAD202601</p>
                        <p className="text-gray-500">AdminPassword@123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
