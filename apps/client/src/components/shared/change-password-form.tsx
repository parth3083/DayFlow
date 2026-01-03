"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { changeUserPassword, clearError } from "@/redux/slices/authSlice";
import { validatePassword, passwordsMatch } from "@/lib/validation.utils";

export function ChangePasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state) => state.auth);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());
        setValidationErrors([]);

        // Validate password
        const validation = validatePassword(newPassword);
        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            return;
        }

        // Check if passwords match
        if (!passwordsMatch(newPassword, confirmPassword)) {
            setValidationErrors(["Passwords do not match"]);
            return;
        }

        // Dispatch password change
        const result = await dispatch(changeUserPassword({
            currentPassword,
            newPassword,
            confirmPassword,
        }));

        if (changeUserPassword.fulfilled.match(result)) {
            // Password changed successfully, redirect to dashboard
            if (user?.role === "admin" || user?.role === "hr") {
                router.push("/admin/dashboard");
            } else {
                router.push("/employee/dashboard");
            }
        }
    };

    const passwordRequirements = [
        { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
        { label: "One uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
        { label: "One lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
        { label: "One number", test: (pwd: string) => /[0-9]/.test(pwd) },
        { label: "One special character (@$!%*?&)", test: (pwd: string) => /[@$!%*?&]/.test(pwd) },
    ];

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="text-xl font-semibold">Dayflow</span>
            </div>

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Change Password</h2>
                <p className="text-gray-600 text-sm">
                    You must change your password before continuing
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <ul className="text-sm text-red-600 space-y-1">
                        {validationErrors.map((err, idx) => (
                            <li key={idx}>• {err}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                        <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Password Requirements */}
                {newPassword && (
                    <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                        <ul className="space-y-1">
                            {passwordRequirements.map((req, idx) => {
                                const isMet = req.test(newPassword);
                                return (
                                    <li key={idx} className="flex items-center gap-2 text-xs">
                                        {isMet ? (
                                            <CheckCircle2 size={14} className="text-green-600" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={isMet ? "text-green-600" : "text-gray-600"}>
                                            {req.label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Changing Password...
                        </>
                    ) : (
                        'Change Password →'
                    )}
                </Button>
            </form>
        </div>
    );
}
