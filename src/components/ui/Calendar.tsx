"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3 bg-[#FAF5E6] font-serif border border-[#DCC9A6] rounded-md shadow-inner relative overflow-hidden", className)}
            captionLayout="dropdown"
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative z-10",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center mb-4", // Added mb-4 for spacing
                caption_label: "hidden", // Hide reference text as we use dropdowns
                caption_dropdowns: "flex justify-center gap-3 items-center", // Container for dropdowns
                dropdown: "bg-[#FAF5E6] border border-[#DCC9A6] text-[#2A1810] font-serif text-sm p-1 rounded-sm cursor-pointer outline-none focus:border-[#D08C60] hover:bg-[#F5EBD6]",
                dropdown_month: "lowercase", // Optional specific styling
                dropdown_year: "",
                dropdown_icon: "hidden", // Hide default check icon/chevron inside select if any (usually native select don't have this, but RDPC might add custom UI)
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all text-[#763A1F] hover:bg-[#D08C60]/10 rounded-full border border-transparent hover:border-[#D08C60]/30 flex items-center justify-center"
                ),
                button_previous: "absolute left-2 top-0", // Adjusted for v9
                button_next: "absolute right-2 top-0", // Adjusted for v9
                table: "w-full border-collapse space-y-1",
                head_row: "flex mb-2",
                head_cell:
                    "text-[#763A1F]/70 rounded-md w-9 font-serif font-medium text-[0.8rem] uppercase tracking-wider",
                row: "flex w-full mt-2 justify-between", // Better justification
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#D08C60]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    "h-9 w-9 p-0 font-sans font-medium aria-selected:opacity-100 hover:bg-[#D08C60]/20 rounded-full transition-all text-[#2A1810]"
                ),
                day_selected:
                    "!bg-[#D08C60] !text-white hover:!bg-[#98522F] font-bold shadow-md", // Force override
                day_today: "bg-[#FFF5E6] text-[#D08C60] border border-[#D08C60] font-bold",
                day_outside: "text-[#D08C60]/30 opacity-50",
                day_disabled: "text-[#D08C60]/30 opacity-50",
                day_range_middle:
                    "aria-selected:bg-[#D08C60]/10 aria-selected:text-[#2A1810]",
                day_hidden: "invisible",
                // v9 mappings
                selected: "!bg-[#D08C60] !text-white hover:!bg-[#98522F] font-bold shadow-md",
                chevron: "fill-current w-4 h-4",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, ...props }) => {
                    switch (orientation) {
                        case "left":
                            return <ChevronLeft className="h-4 w-4" {...props} />;
                        case "right":
                            return <ChevronRight className="h-4 w-4" {...props} />;
                        case "up":
                            // Assuming reuse or different icon if needed, but usually just navigation is left/right for months
                            return <ChevronLeft className="h-4 w-4 rotate-90" {...props} />;
                        case "down":
                            return <ChevronRight className="h-4 w-4 rotate-90" {...props} />;
                        default:
                            return <ChevronRight className="h-4 w-4" {...props} />;
                    }
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
