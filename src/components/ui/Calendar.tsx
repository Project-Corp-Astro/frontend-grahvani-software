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
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative z-10",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-bold text-[#3E2A1F] tracking-widest uppercase",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity text-[#9C7A2F] hover:bg-[#FEFAEA] rounded-full border border-transparent hover:border-[#DCC9A6] flex items-center justify-center"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-[#9C7A2F] rounded-md w-9 font-normal text-[0.8rem] uppercase tracking-wider",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#F2DCBC] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#F2DCBC] rounded-md transition-colors text-[#3E2A1F]"
                ),
                day_selected:
                    "bg-[#9C7A2F] text-[#FEFAEA] hover:bg-[#763A1F] hover:text-[#FEFAEA] focus:bg-[#9C7A2F] focus:text-[#FEFAEA] font-bold shadow-md",
                day_today: "bg-[#FEFAEA] text-[#3E2A1F] border border-[#DCC9A6] font-bold",
                day_outside: "text-[#DCC9A6] opacity-50",
                day_disabled: "text-[#DCC9A6] opacity-50",
                day_range_middle:
                    "aria-selected:bg-[#F2DCBC] aria-selected:text-[#3E2A1F]",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) => {
                    const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
                    return <Icon className="h-4 w-4" />;
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
