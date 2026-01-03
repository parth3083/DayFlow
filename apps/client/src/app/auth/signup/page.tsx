import { AuthLayout } from "@/components/shared/auth-layout";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function SignupPage() {
    return (
        <AuthLayout
            title="Employee Account Creation"
            subtitle="Secure employee management system with role-based access control."
            features={[
                "Centralized employee management",
                "Secure authentication system",
                "Role-based access control",
                "Automated credential generation",
            ]}
        >
            <div className="bg-white p-8 rounded-lg shadow-sm">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <span className="text-xl font-semibold">Dayflow</span>
                </div>

                {/* Info Message */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-1">
                            Employee Accounts Are Created by HR/Admin
                        </h3>
                        <p className="text-sm text-blue-700">
                            For security reasons, employee accounts can only be created by HR managers or administrators.
                            Please contact your HR department to get your account credentials.
                        </p>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
                    <ol className="space-y-2 text-sm text-gray-600">
                        <li className="flex gap-2">
                            <span className="font-semibold text-teal-600">1.</span>
                            <span>HR/Admin creates your employee account</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-teal-600">2.</span>
                            <span>You receive your Login ID and temporary password</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-teal-600">3.</span>
                            <span>Sign in and change your password on first login</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold text-teal-600">4.</span>
                            <span>Access your personalized dashboard</span>
                        </li>
                    </ol>
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                        Already have an account?
                    </p>
                    <Link
                        href="/auth/signin"
                        className="inline-block w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
                    >
                        Sign In →
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
