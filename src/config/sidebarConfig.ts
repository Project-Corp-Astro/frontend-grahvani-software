import {
    LayoutDashboard,
    Bell,
    Activity,
    Zap,
    Clock,
    Calendar,
    Home,
    Car,
    Plane,
    Heart,
    Users,
    Search,
    FileText,
    Star,
    Moon,
    CreditCard,
    PlusCircle
} from 'lucide-react';
import { SidebarItem } from '@/components/layout/SectionSidebar';

export const DASHBOARD_Sidebar: SidebarItem[] = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Recent Activity", path: "/dashboard/activity", icon: Activity },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
    { name: "Quick Actions", path: "/dashboard/actions", icon: Zap },
];

export const CLIENTS_General_Sidebar: SidebarItem[] = [
    { name: "Clients List", path: "/clients", icon: Users },
    { name: "Bookings", path: "/clients/bookings", icon: Calendar },
    { name: "Payments", path: "/clients/payments", icon: CreditCard },
    { name: "Add New Client", path: "/clients/new", icon: PlusCircle },
];

export const MUHURTA_Sidebar: SidebarItem[] = [
    { name: "Today's Muhurta", path: "/muhurta", icon: Clock },
    { name: "Wedding Dates", path: "/muhurta/wedding", icon: Heart },
    { name: "Property Purchase", path: "/muhurta/property", icon: Home },
    { name: "Vehicle Purchase", path: "/muhurta/vehicle", icon: Car },
    { name: "Travel Timing", path: "/muhurta/travel", icon: Plane },
];

export const MATCHMAKING_Sidebar: SidebarItem[] = [
    { name: "New Match", path: "/matchmaking", icon: Heart },
    { name: "Saved Matches", path: "/matchmaking/saved", icon: Users },
    { name: "Gun Milan", path: "/matchmaking/gun-milan", icon: Star },
    { name: "Dosha Analysis", path: "/matchmaking/dosha", icon: Search },
];

export const CALENDAR_Sidebar: SidebarItem[] = [
    { name: "Monthly View", path: "/calendar", icon: Calendar },
    { name: "Planetary Transits", path: "/calendar/transits", icon: Moon },
    { name: "Festivals", path: "/calendar/festivals", icon: Star },
    { name: "Personal Events", path: "/calendar/personal", icon: FileText },
];
