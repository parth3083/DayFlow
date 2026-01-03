"use client";

import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    reverse?: boolean;
    title: string;
    subtitle: string;
    features: string[];
}

export function AuthLayout({
    children,
    reverse = false,
    title,
    subtitle,
    features,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Left/Right Side - Gradient Background */}
            <div
                className={`flex-1 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 p-12 flex flex-col justify-center text-white ${reverse ? "order-2" : "order-1"
                    } hidden lg:flex`}
            >
                <div className="max-w-xl">
                    <h1 className="text-4xl font-bold mb-4">{title}</h1>
                    <p className="text-lg mb-8 text-teal-50">{subtitle}</p>
                    <ul className="space-y-4">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-sm font-semibold">{index + 1}</span>
                                </div>
                                <span className="text-teal-50">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right/Left Side - Form */}
            <div
                className={`flex-1 flex items-center justify-center p-8 bg-gray-50 ${reverse ? "order-1" : "order-2"
                    }`}
            >
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
