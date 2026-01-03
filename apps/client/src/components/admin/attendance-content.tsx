export default function AttendanceContent() {
    return (
        <div className="w-[100%]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
                <p className="text-gray-600 mt-1">Track employee attendance</p>
            </div>

            <div className="bg-white rounded-lg border p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-teal-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Attendance Tracking Coming Soon</h2>
                    <p className="text-gray-600">
                        This page will display attendance records, check-in/check-out times, and attendance analytics.
                    </p>
                </div>
            </div>
        </div>
    );
}
