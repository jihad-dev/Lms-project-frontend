

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import {
    Users,
    Calendar,
    MessageSquare,
    PlusCircle,
    UserCog,
    ShieldCheck,
    Home,
    Bell,
    Search,
    ChevronRight,
    Menu,
    X,
    LogOut,
    AlertCircle
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/Redux/hook";
import { logout } from "@/src/Redux/features/auth/authSlice";
import { useLogoutMutation } from "@/src/Redux/features/auth/authApi";

// Type definitions
type UserRole = "admin" | "student" | "super-admin" | "instructor";

interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
}

interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
    description?: string;
}

interface Breadcrumb {
    label: string;
    href: string;
}

// Sidebar link component
const SidebarLink = React.memo(({
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
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
            onClick={onClick}
            aria-current={active ? "page" : undefined}
            aria-label={item.description || item.label}
        >
            <span className="h-4 w-4 text-current flex-shrink-0">
                {item.icon ?? (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                )}
            </span>
            <span className="truncate">{item.label}</span>
        </Link>
    );
});

SidebarLink.displayName = "SidebarLink";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
    const user = useAppSelector((state) => state.auth.user) as User | null;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Memoized navigation items based on user role
    const roleItems: NavItem[] = useMemo(() => {
        if (!user?.role) return [];

        const baseItems: Record<UserRole, NavItem[]> = {
            admin: [
                { 
                    label: "Dashboard", 
                    href: "/dashboard/admin", 
                    icon: <Home size={16} />,
                    description: "Admin dashboard overview"
                },
                { 
                    label: "Courses", 
                    href: "/dashboard/admin/courses", 
                    icon: <PlusCircle size={16} />,
                    description: "Manage courses and content"
                },
                { 
                    label: "Enrollment Requests", 
                    href: "/dashboard/admin/enrollment-request", 
                    icon: <Users size={16} />,
                    description: "Review student enrollment requests"
                },
                { 
                    label: "Manage Students", 
                    href: "/dashboard/admin/manage-students", 
                    icon: <Users size={16} />,
                    description: "Manage student accounts and data"
                },
                { 
                    label: "Manage Users", 
                    href: "/dashboard/admin/users", 
                    icon: <UserCog size={16} />,
                    description: "Manage user accounts and permissions"
                },
            ],
            student: [
                { 
                    label: "Dashboard", 
                    href: "/dashboard/student", 
                    icon: <Home size={16} />,
                    description: "Student dashboard overview"
                },
                { 
                    label: "My Courses", 
                    href: "/dashboard/student/my-courses", 
                    icon: <Calendar size={16} />,
                    description: "View enrolled courses"
                },
                { 
                    label: "My Reviews", 
                    href: "/dashboard/student/my-reviews", 
                    icon: <MessageSquare size={16} />,
                    description: "Manage course reviews and feedback"
                },
            ],
            "super-admin": [
                { 
                    label: "Super Admin", 
                    href: "/dashboard/super-admin", 
                    icon: <ShieldCheck size={16} />,
                    description: "Super admin dashboard"
                },
                { 
                    label: "System Settings", 
                    href: "/dashboard/super-admin/settings", 
                    icon: <UserCog size={16} />,
                    description: "Configure system settings"
                },
            ],
            instructor: [
                { 
                    label: "Dashboard", 
                    href: "/dashboard/instructor", 
                    icon: <Home size={16} />,
                    description: "Instructor dashboard overview"
                },
                { 
                    label: "My Courses", 
                    href: "/dashboard/instructor/courses", 
                    icon: <PlusCircle size={16} />,
                    description: "Manage your courses"
                },
            ],
        };

        return baseItems[user.role] || [];
    }, [user?.role]);

    // Final sidebar items
    const sidebarItems = useMemo(() => [...roleItems], [roleItems]);

    // Determine if a sidebar item should be active for nested routes
    const isActive = useCallback((href: string) => {
        if (!pathname) return false;
        return pathname === href || pathname.startsWith(href + "/");
    }, [pathname]);

    // Build breadcrumbs from pathname
    const breadcrumbs = useMemo((): Breadcrumb[] => {
        if (!pathname) return [];
        const parts = pathname.split("/").filter(Boolean);
        const startIndex = parts.indexOf("dashboard");
        const relevant = startIndex >= 0 ? parts.slice(startIndex) : parts;
        const acc: Breadcrumb[] = [];
        const isDynamicId = (seg: string) => /^(?:[a-f0-9]{24})$/i.test(seg) || /^\d+$/.test(seg);
        const pretty = (seg: string) => seg
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

        relevant.forEach((part, index) => {
            if (isDynamicId(part)) return; // skip ids in breadcrumbs
            const href = "/" + relevant.slice(0, index + 1).filter((p) => !isDynamicId(p)).join("/");
            const label = pretty(part);
            acc.push({ label, href });
        });
        return acc;
    }, [pathname]);

    // Logout handler with confirmation
    const handleLogout = useCallback(async () => {
        try {
            await logoutApi({}).unwrap();
            dispatch(logout());
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if API fails, clear local state and redirect
            dispatch(logout());
            router.push("/login");
        }
    }, [logoutApi, dispatch, router]);

    // Close mobile menu handler
    const closeMobileMenu = useCallback(() => {
        setMobileOpen(false);
    }, []);

    // Open mobile menu handler
    const openMobileMenu = useCallback(() => {
        setMobileOpen(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            {/* Mobile Sidebar Drawer */}
            <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "block" : "hidden"}`}>
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />
                {/* Sidebar */}
                <aside 
                    className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-slate-800"
                    role="navigation"
                    aria-label="Main navigation"
                >
                    <div className="flex h-14 items-center justify-between border-b px-4 dark:border-slate-700">
                        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
                            <span className="text-blue-600" aria-hidden="true">🎓</span>
                            <span>LMS Pro</span>
                        </Link>
                        <button
                            aria-label="Close menu"
                            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={closeMobileMenu}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-[calc(100%-56px)]">
                        {sidebarItems.map((item) => (
                            <SidebarLink
                                key={item.href}
                                item={item}
                                active={isActive(item.href)}
                                onClick={closeMobileMenu}
                            />
                        ))}
                    </nav>
                </aside>
            </div>

            {/* Desktop Sidebar */}
            <aside 
                className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-white dark:border-slate-700 dark:bg-slate-800 lg:block"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex h-14 items-center border-b px-4 dark:border-slate-700">
                    <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
                        <span className="text-blue-600" aria-hidden="true">🎓</span>
                        <span>LMS Pro</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-[calc(100%-56px)]">
                    {sidebarItems.map((item) => (
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
                            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={openMobileMenu}
                        >
                            <Menu size={18} />
                        </button>

                        {/* Breadcrumbs */}
                        <nav 
                            className="hidden md:flex items-center text-xs text-slate-500 dark:text-slate-400"
                            aria-label="Breadcrumb navigation"
                        >
                            {breadcrumbs.map((bc, idx) => (
                                <div key={bc.href} className="flex items-center">
                                    {idx > 0 && <ChevronRight className="mx-2" size={14} aria-hidden="true" />}
                                    {idx < breadcrumbs.length - 1 ? (
                                        <Link 
                                            href={bc.href} 
                                            className="hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                        >
                                            {bc.label}
                                        </Link>
                                    ) : (
                                        <span 
                                            className="font-medium text-slate-700 dark:text-slate-200"
                                            aria-current="page"
                                        >
                                            {bc.label}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Search */}
                        <div className="ml-auto hidden md:flex items-center">
                            <div className="relative">
                                <Search 
                                    className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" 
                                    size={16} 
                                    aria-hidden="true"
                                />
                                <input
                                    type="search"
                                    placeholder="Search courses, students..."
                                    className="w-64 rounded-md border border-slate-200 bg-white/70 py-1.5 pl-8 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900/50 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                                    aria-label="Search courses and students"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Notifications"
                                className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Bell size={18} />
                            </button>
                            
                            {/* User avatar and logout dropdown */}
                            <div className="relative group">
                                <button
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label="User menu"
                                    aria-expanded={showLogoutConfirm}
                                    aria-haspopup="true"
                                >
                                    {user?.email ? user.email[0].toUpperCase() : "G"}
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="font-semibold text-gray-800 truncate">{user?.email || "User"}</div>
                                        <div className="text-xs text-gray-500 capitalize">{user?.role ?? "User"}</div>
                                    </div>
                                    <ul className="py-1" role="menu">
                                        <li role="none">
                                            <button
                                                onClick={() => setShowLogoutConfirm(true)}
                                                className="w-full cursor-pointer text-left px-4 py-2 text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50 flex items-center gap-2"
                                                role="menuitem"
                                                disabled={isLoggingOut}
                                            >
                                                <LogOut size={16} />
                                                {isLoggingOut ? "Logging out..." : "Logout"}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Logout Confirmation Modal */}
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Confirm Logout
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Are you sure you want to logout?
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    disabled={isLoggingOut}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="p-4">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;