"use client";

import React from "react";
import { Search, Users, BookOpen, CheckCircle2, Ban, Filter, Loader2 } from "lucide-react";
import { useGetAllUserQuery } from "@/src/Redux/features/auth/authApi";
import { useGetAllCoursesQuery } from "@/src/Redux/features/course/courseApi";

type User = {
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    status?: string;
    isDeleted?: boolean;
};

type Course = {
    _id: string;
    title: string;
    status?: string;
    price?: number;
};

const AdminPage = () => {
    const { data: usersData, isLoading: loadingUsers, isFetching: fetchingUsers } = useGetAllUserQuery();
    const { data: coursesData, isLoading: loadingCourses, isFetching: fetchingCourses } = useGetAllCoursesQuery();

    const users: User[] = Array.isArray(usersData) ? usersData : [];
    const courses: Course[] = Array.isArray(coursesData) ? coursesData : [];

    const [query, setQuery] = React.useState("");
    const [role, setRole] = React.useState<string>("all");
    const [status, setStatus] = React.useState<string>("all");

    const isLoading = loadingUsers || loadingCourses || fetchingUsers || fetchingCourses;

    const kpis = React.useMemo(() => {
        const totalUsers = users.length;
        const totalCourses = courses.length;
        const activeUsers = users.filter((u) => (u.status ?? "") !== "blocked" && !u.isDeleted).length;
        const blockedUsers = users.filter((u) => (u.status ?? "") === "blocked").length;
        return { totalUsers, totalCourses, activeUsers, blockedUsers };
    }, [users, courses]);

    const filteredUsers = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        return users.filter((u) => {
            const matchesQuery = !q || [u.name, u.email, u.role].some((v) => (v ?? "").toLowerCase().includes(q));
            const matchesRole = role === "all" || (u.role ?? "").toLowerCase() === role;
            const matchesStatus = status === "all" || (u.status ?? "").toLowerCase() === status;
            return matchesQuery && matchesRole && matchesStatus;
        });
    }, [users, query, role, status]);

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Monitor your LMS and manage users and courses.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Total Users</span>
                        <Users size={16} className="text-blue-600" />
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{kpis.totalUsers}</div>
                </div>
                <div className="rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Total Courses</span>
                        <BookOpen size={16} className="text-emerald-600" />
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{kpis.totalCourses}</div>
                </div>
                <div className="rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Active Users</span>
                        <CheckCircle2 size={16} className="text-emerald-600" />
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{kpis.activeUsers}</div>
                </div>
                <div className="rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Blocked Users</span>
                        <Ban size={16} className="text-rose-600" />
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{kpis.blockedUsers}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 rounded-lg border bg-white p-3 dark:border-slate-700 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-sm">
                    <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search users by name, email, role..."
                        className="w-full rounded-md border border-slate-200 bg-white/70 py-2 pl-8 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900/50 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-500" />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="rounded-md border px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
                        >
                            <option value="all">All roles</option>
                            <option value="admin">admin</option>
                            <option value="instructor">instructor</option>
                            <option value="student">student</option>
                        </select>
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
                    >
                        <option value="all">All status</option>
                        <option value="in-progress">in-progress</option>
                        <option value="blocked">blocked</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr className="text-left">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td className="px-4 py-6" colSpan={4}>
                                    <span className="inline-flex items-center gap-2 text-slate-500">
                                        <Loader2 className="animate-spin" size={16} /> Loading...
                                    </span>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6" colSpan={4}>No users found</td>
                            </tr>
                        ) : (
                            filteredUsers.map((u) => {
                                const id = (u.id || u._id) as string;
                                return (
                                    <tr key={id} className="border-t border-slate-100 dark:border-slate-800">
                                        <td className="px-4 py-2">{u.name}</td>
                                        <td className="px-4 py-2">{u.email}</td>
                                        <td className="px-4 py-2 capitalize">{u.role}</td>
                                        <td className="px-4 py-2">{u.status}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Courses snapshot */}
            <div className="rounded-lg border bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold">Recent Courses</h3>
                    <span className="text-xs text-slate-500">{courses.length} total</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {(isLoading ? Array.from({ length: 3 }) : courses.slice(0, 6)).map((c: any, idx: number) => (
                        <div key={c?._id ?? idx} className="rounded-md border p-3 dark:border-slate-700">
                            {isLoading ? (
                                <div className="h-16 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                            ) : (
                                <>
                                    <div className="text-sm font-medium line-clamp-1">{c?.title}</div>
                                    <div className="mt-1 text-xs text-slate-500">Status: {c?.status ?? "n/a"}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;