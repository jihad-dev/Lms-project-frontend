

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
    Users,
    Stethoscope,
    Calendar,
    MessageSquare,
    FileText,
    PlusCircle,
    UserCog,
    ShieldCheck,
    Home,
    Bell,
    Search,
    ChevronRight,
    Menu,
    X,
    Plus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/Redux/hook";
import { logout } from "@/src/Redux/features/auth/authSlice";

// Sidebar link type
type NavItem = {
    label: string;
    href: string;
    icon?: React.ReactNode;
};

// Sidebar link component
const SidebarLink = ({
    item,
    active,
    onClick,
}: {
    item: NavItem;
    active: boolean;
    onClick?: () => void;
}) => {
    return (
        <Link
            href={item.href}
            className={
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                (active
                    ? "bg-blue-600 text-white shadow-sm dark:bg-blue-600/60 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700")
            }
            onClick={onClick}
        >
            {/* যদি icon না থাকে তাহলে dot দেখাবে */}
            <span className="h-4 w-4 text-current">
                {item.icon ?? (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                )}
            </span>
            <span>{item.label}</span>
        </Link>
    );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    let roleItems: NavItem[] = [];


    if (user?.role === "admin") {
        roleItems = [
            { label: "Dashboard", href: "/dashboard/admin", icon: <Home size={16} /> },
            { label: "Courses", href: "/dashboard/admin/courses", icon: <PlusCircle size={16} /> },
            { label: "Enrollment Request", href: "/dashboard/admin/enrollment-request", icon: <PlusCircle size={16} /> },
            { label: "Manage Students", href: "/dashboard/admin/manage-students", icon: <Calendar size={16} /> },
            { label: "Manage Users", href: "/dashboard/admin/users", icon: <Users size={16} /> },
       
        ];
    }  else if (user?.role === "student") {
        roleItems = [
            { label: "Student", href: "/dashboard/student", icon: <Users size={16} /> },
            { label: "My Courses", href: "/dashboard/student/my-courses", icon: <Calendar size={16} /> },
            { label: "My Reviews", href: "/dashboard/student/my-reviews", icon: <MessageSquare size={16} /> },
        ];
    } else if (user?.role === "super-admin") {
        roleItems = [
            { label: "Super Admin", href: "/dashboard/super-admin", icon: <ShieldCheck size={16} /> },
            { label: "System Settings", href: "/dashboard/super-admin/settings", icon: <UserCog size={16} /> },
        ];
    }
    // Final sidebar items
    const sidebarItems = [...roleItems];

    // Determine if a sidebar item should be active for nested routes
    const isActive = (href: string) => {
        if (!pathname) return false;
        return pathname === href;
    };

    // Build breadcrumbs from pathname
    const breadcrumbs = React.useMemo(() => {
        if (!pathname) return [] as { label: string; href: string }[];
        const parts = pathname.split("/").filter(Boolean);
        const startIndex = parts.indexOf("dashboard");
        const relevant = startIndex >= 0 ? parts.slice(startIndex) : parts;
        const acc: { label: string; href: string }[] = [];
        relevant.forEach((part, index) => {
            const href = "/" + relevant.slice(0, index + 1).join("/");
            const label = part
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());
            acc.push({ label, href });
        });
        return acc;
    }, [pathname]);

    const canCreateCourse = user?.role === "admin" || user?.role === "instructor";
    const createCourseHref = user?.role === "admin"
        ? "/dashboard/admin/courses/new"
        : user?.role === "instructor"
            ? "/dashboard/instructor/courses/new"
            : "#";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            {/* Mobile Sidebar Drawer */}
            <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "block" : "hidden"}`}>
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
                {/* Sidebar */}
                <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-slate-800">
                    <div className="flex h-14 items-center justify-between border-b px-4 dark:border-slate-700">
                        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
                            <span className="text-blue-600">🎓</span> EduPro LMS
                        </Link>
                        <button
                            aria-label="Close menu"
                            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setMobileOpen(false)}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-[calc(100%-56px)]">
                        {sidebarItems && sidebarItems?.map((item) => (
                            <SidebarLink
                                key={item.href}
                                item={item}
                                active={isActive(item.href)}
                                onClick={() => setMobileOpen(false)}
                            />
                        ))}
                    </nav>
                </aside>
            </div>

            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-white dark:border-slate-700 dark:bg-slate-800 lg:block">
                <div className="flex h-14 items-center border-b px-4 dark:border-slate-700">
                    <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
                        <span className="text-blue-600">🎓</span> EduPro LMS
                    </Link>
                </div>
                <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-[calc(100%-56px)]">
                    {sidebarItems && sidebarItems?.map((item) => (
                        <SidebarLink key={item.href} item={item} active={isActive(item.href)} />
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
                    <div className="flex h-14 items-center gap-3 px-4">
                        {/* Mobile menu button */}
                        <button
                            aria-label="Open menu"
                            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={18} />
                        </button>

                        {/* Breadcrumbs */}
                        <nav className="hidden md:flex items-center text-xs text-slate-500 dark:text-slate-400">
                            {breadcrumbs.map((bc, idx) => (
                                <div key={bc.href} className="flex items-center">
                                    {idx > 0 && <ChevronRight className="mx-2" size={14} />}
                                    {idx < breadcrumbs.length - 1 ? (
                                        <Link href='' className="hover:text-slate-700 dark:hover:text-slate-200">
                                            {bc.label}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{bc.label}</span>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Search */}
                        <div className="ml-auto hidden md:flex items-center">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="search"
                                    placeholder="Search courses, students..."
                                    className="w-64 rounded-md border border-slate-200 bg-white/70 py-1.5 pl-8 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900/50 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {canCreateCourse && (
                                <Link
                                    href={createCourseHref}
                                    className="hidden sm:inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                >
                                    <Plus size={14} /> New Course
                                </Link>
                            )}
                            <button
                                aria-label="Notifications"
                                className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Bell size={18} />
                            </button>
                            {/* User avatar and logout dropdown */}
                            <div className="relative group">
                                <button
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white focus:outline-none"
                                >
                                    {user?.email ? user.email[0].toUpperCase() : "G"}
                                </button>
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="font-semibold text-gray-800">{user?.email}</div>
                                        <div className="text-xs text-gray-500 capitalize">{user?.role ?? "User"}</div>
                                    </div>
                                    <ul className="py-1">
                                        <li>
                                            <button
                                                onClick={() => {
                                                    // Logout logic
                                                    if (typeof window !== "undefined") {

                                                        dispatch(logout());
                                                        window.location.href = "/login";
                                                    }
                                                }}
                                                className="w-full cursor-pointer text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="p-4">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;