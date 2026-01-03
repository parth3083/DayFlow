import { AuthLayout } from "@/components/shared/auth-layout";
import { SignupForm } from "@/components/shared/signup-form";

export default function SignupPage() {
    return (
        <AuthLayout
            title="Join Dayflow Today"
            subtitle="Create your account and start managing your HR operations efficiently. Experience the modern way to handle employee management."
            features={[
                "Easy employee onboarding",
                "Real-time attendance tracking",
                "Seamless leave management",
                "Transparent payroll visibility",
            ]}
        >
            <SignupForm />
        </AuthLayout>
    );
}
