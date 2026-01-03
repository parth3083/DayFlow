import { AuthLayout } from "@/components/shared/auth-layout";
import { SigninForm } from "@/components/shared/signin-form";

export default function SigninPage() {
    return (
        <AuthLayout
            reverse
            title="Streamline Your HR Operations"
            subtitle="Manage employees, track attendance, handle leave requests, and process payroll — all in one modern platform."
            features={[
                "Employee Management",
                "Attendance Tracking",
                "Leave Management",
                "Payroll Visibility",
            ]}
        >
            <SigninForm />
        </AuthLayout>
    );
}
