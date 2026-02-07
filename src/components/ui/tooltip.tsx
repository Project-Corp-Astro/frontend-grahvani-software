"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
    return <div className="tooltip-provider">{children}</div>;
};

const Tooltip = ({ children }: { children: React.ReactNode; delayDuration?: number }) => {
    // We keep delayDuration as an optional prop for compatibility but don't implement timing 
    // in this simplified hover version to stay lightweight.
    return <div className="group relative inline-block">{children}</div>;
};

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean;
}

const TooltipTrigger = ({ children, asChild, ...props }: TooltipTriggerProps) => {
    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<{ className?: string }>;
        return React.cloneElement(child, {
            className: cn("cursor-help", child.props.className, props.className),
            ...props
        });
    }

    return (
        <button className={cn("cursor-help inline-block", props.className)} {...(props as Record<string, unknown>)}>
            {children}
        </button>
    );
};

const TooltipContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "absolute z-[100] scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom mb-2 bottom-full left-1/2 -translate-x-1/2",
            "p-3 bg-copper-900 text-white rounded-xl border-none shadow-[0_10px_30px_rgba(0,0,0,0.3)]",
            "text-xs whitespace-normal min-w-[200px] pointer-events-none",
            className
        )}
        {...props}
    />
));
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
