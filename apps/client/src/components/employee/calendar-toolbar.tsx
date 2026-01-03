import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ToolbarProps, NavigateAction } from "react-big-calendar";

export default function CalendarToolbar(props: ToolbarProps) {
    const { date, view, onNavigate, onView } = props;

    const goToBack = () => {
        onNavigate("PREV" as NavigateAction);
    };

    const goToNext = () => {
        onNavigate("NEXT" as NavigateAction);
    };

    const goToToday = () => {
        onNavigate("TODAY" as NavigateAction);
    };

    const currentMonth = moment(date).format("MMMM YYYY");

    return (
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
            {/* Left: Month/Year */}
            <div className="flex-1 flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{currentMonth}</span>

                {/* Center: Navigation buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToBack}
                        className="p-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-teal-600 rounded-md hover:bg-teal-700"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNext}
                        className="p-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        aria-label="Next"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            {/* Right: View toggle */}
            <div className="flex-1 flex justify-end gap-2">
                <button
                    onClick={() => onView("month")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${view === "month"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Month
                </button>
                <button
                    onClick={() => onView("week")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${view === "week"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Week
                </button>
            </div>
        </div>
    );
}
