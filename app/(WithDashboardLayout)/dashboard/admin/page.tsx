"use client";

import React from "react";
import { Search, BookOpen, CheckCircle2, FileText, Video, Filter, Plus, Edit, FileText as ModuleIcon, Clock, User, DollarSign, BarChart3 } from "lucide-react";
import { useGetAllUserQuery } from "@/src/Redux/features/auth/authApi";
import { useGetAllCoursesQuery } from "@/src/Redux/features/course/courseApi";
import { useGetAllModulesQuery } from "@/src/Redux/features/course/moduleApi";
import { IModule } from "@/src/types/module";
import Link from "next/link";
import Image from "next/image";

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
    instructor?: string;
    duration?: string;
    level?: string;
    category?: string;
    description?: string;
    thumbnail?: string;
};

const AdminPage = () => {
    const { data: usersData, isLoading: loadingUsers, isFetching: fetchingUsers } = useGetAllUserQuery();
    const { data: coursesData, isLoading: loadingCourses, isFetching: fetchingCourses } = useGetAllCoursesQuery();
    const { data: modulesData, isLoading: loadingModules, isFetching: fetchingModules } = useGetAllModulesQuery();

    const users: User[] = Array.isArray(usersData) ? usersData : [];
    const courses: Course[] = Array.isArray(coursesData) ? coursesData : [];
    const modules: IModule[] = Array.isArray(modulesData) ? modulesData : [];

    const [query, setQuery] = React.useState("");
    const [category, setCategory] = React.useState<string>("all");
    const [level, setLevel] = React.useState<string>("all");
    const [status, setStatus] = React.useState<string>("all");

    const isLoading = loadingUsers || loadingCourses || fetchingUsers || fetchingCourses;

    const stats = React.useMemo(() => {
        const totalCourses = courses.length;
        const publishedCourses = courses.filter(c => c.status === "published").length;
        const totalModules = modules.length; // Mock data as shown in image
        const totalLectures = 0; // Mock data as shown in image
        return { totalCourses, publishedCourses, totalModules, totalLectures };
    }, [courses, modules]);

    const filteredCourses = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        return courses.filter((c) => {
            const matchesQuery = !q || c.title.toLowerCase().includes(q);
            const matchesCategory = category === "all" || c.category === category;
            const matchesLevel = level === "all" || c.level === level;
            const matchesStatus = status === "all" || c.status === status;
            return matchesQuery && matchesCategory && matchesLevel && matchesStatus;
        });
    }, [courses, query, category, level, status]);

    const clearFilters = () => {
        setQuery("");
        setCategory("all");
        setLevel("all");
        setStatus("all");
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Manage all courses, modules, and lectures</h1>
                </div>
                <Link href="/dashboard/admin/courses">    <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition-colors">
                    <Plus size={18} />
                    Create Course
                </button></Link>
            </div>

            {/* Search & Filters Section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full rounded-lg border border-slate-600 bg-slate-800 py-3 pl-10 pr-4 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    >
                        <option value="all">All Categories</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="fullstack">Fullstack</option>
                    </select>

                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>

                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white hover:bg-slate-700 transition-colors"
                    >
                        <Filter size={16} />
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Courses</p>
                            <p className="text-3xl font-bold">{stats.totalCourses}</p>
                        </div>
                        <BookOpen size={24} className="text-blue-500" />
                    </div>
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Published</p>
                            <p className="text-3xl font-bold">{stats.publishedCourses}</p>
                        </div>
                        <CheckCircle2 size={24} className="text-emerald-500" />
                    </div>
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Modules</p>
                            <p className="text-3xl font-bold">{stats.totalModules}</p>
                        </div>
                        <FileText size={24} className="text-purple-500" />
                    </div>
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Lectures</p>
                            <p className="text-3xl font-bold">{stats.totalLectures}</p>
                        </div>
                        <Video size={24} className="text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Course Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="rounded-lg border border-slate-700 bg-slate-800 p-6 animate-pulse">
                            <div className="h-32 bg-slate-700 rounded mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-slate-700 rounded"></div>
                                <div className="h-3 bg-slate-700 rounded"></div>
                                <div className="h-3 bg-slate-700 rounded"></div>
                                <div className="h-3 bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : filteredCourses.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-slate-400 text-lg">No courses found</p>
                    </div>
                ) : (
                    filteredCourses.map((course) => (
                        <div key={course._id} className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden">
                            {/* Course Image/Thumbnail */}
                            <div className="relative h-32 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <div className="absolute top-2 right-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                                        <CheckCircle2 size={12} />
                                        Published
                                    </span>
                                </div>
                                <div className="w-full h-full">
                                    <Image
                                        src={course?.thumbnail || ""}
                                        alt={course.title}
                                        fill
                                        className="object-cover w-full h-full"
                                        sizes="(max-width: 768px) 100vw, 100vw"
                                    />
                                </div>
                            </div>

                            {/* Course Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                    <p className="text-slate-400 text-sm mb-3">
                                        {course.description || "Course description"}
                                    </p>
                                </div>

                                {/* Course Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <User size={14} />
                                        <span>{course.instructor || "Instructor Name"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Clock size={14} />
                                        <span>{course.duration || "0h 0m"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <DollarSign size={14} />
                                        <span>{course.price || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <BarChart3 size={14} />
                                        <span>{modules.length} modules</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                        {course.level || "beginner"}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-slate-600 text-slate-300 text-xs font-medium">
                                        {course.category || "Fullstack"}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Link href={`/dashboard/admin/courses/${course._id}`}>   <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors cursor-pointer">
                                        <ModuleIcon size={14} />
                                        Create Modules
                                    </button></Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPage;