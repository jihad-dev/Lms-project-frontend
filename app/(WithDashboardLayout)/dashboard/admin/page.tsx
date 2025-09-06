"use client";

import React from "react";
import { Search, BookOpen, CheckCircle2, FileText, Video, Filter, Plus, FileText as ModuleIcon, Clock, User, DollarSign, BarChart3, Users } from "lucide-react";
import { useGetAllUserQuery } from "@/src/Redux/features/auth/authApi";
import { useGetAllCoursesQuery, useGetPublishedCoursesQuery } from "@/src/Redux/features/course/courseApi";
import { useGetAllModulesQuery } from "@/src/Redux/features/course/moduleApi";
import { useGetAllLecturesQuery } from "@/src/Redux/features/course/lectureApi";
import { useGetAllEnrollmentRequestsQuery } from "@/src/Redux/features/course/enrollmentApi";
import { IModule } from "@/src/types/module";
import Link from "next/link";
import Image from "next/image";
import { ExpandableDescription } from "@/lib/ExpandableDescription";

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
    published?: boolean;
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
    const { data: publishedCoursesData } = useGetPublishedCoursesQuery();
    const { data: modulesData } = useGetAllModulesQuery();
    const { data: enrollmentRequestsData, isLoading: loadingEnrollmentRequests, isFetching: fetchingEnrollmentRequests } = useGetAllEnrollmentRequestsQuery();
    const enrollmentRequests = Array.isArray(enrollmentRequestsData) ? enrollmentRequestsData : []
    const { data: allLectures = [], isLoading: loadingLectures } = useGetAllLecturesQuery();

    const users: User[] = Array.isArray(usersData) ? usersData : [];
    const courses: Course[] = Array.isArray(coursesData) ? coursesData : [];
    const modules: IModule[] = Array.isArray(modulesData) ? modulesData : [];

    const [query, setQuery] = React.useState("");
    const [category, setCategory] = React.useState<string>("all");
    const [level, setLevel] = React.useState<string>("all");
    const [status, setStatus] = React.useState<string>("all");

    const isLoading = loadingUsers || loadingCourses || loadingLectures || loadingEnrollmentRequests || fetchingUsers || fetchingCourses || fetchingEnrollmentRequests;

    const stats = React.useMemo(() => {
        const totalCourses = courses.length;

        // Check status and published fields for backward compatibility
        const publishedCourses = courses.filter(c => {
            return Boolean(c.published) || c.status === "published";
        }).length;

        const totalModules = modules.length;
        const totalLectures = allLectures.length;
        const publishedLectures = allLectures.filter(l => l.isPublished).length;

        // Enrollment request stats
        const pendingRequests = enrollmentRequests.filter(req => req.status === "pending" || !req.status).length;
        const approvedRequests = enrollmentRequests.filter(req => req.status === "approved").length;

        return { totalCourses, publishedCourses, totalModules, totalLectures, publishedLectures, pendingRequests, approvedRequests };
    }, [courses, modules, allLectures, enrollmentRequests]);

    const filteredCourses = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        return courses.filter((c) => {
            const matchesQuery = !q || c.title.toLowerCase().includes(q);
            const matchesCategory = category === "all" || c.category === category;
            const matchesLevel = level === "all" || c.level === level;
            // Check status and published fields for backward compatibility
            const matchesStatus = status === "all" ||
                c.status === status ||
                (status === "published" && (Boolean(c.published) || c.status === "published")) ||
                (status === "draft" && (c.published === false || c.status === "draft"));
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
        <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Manage all courses, modules, and lectures</h1>
                </div>
                <Link href="/dashboard/admin/courses">    <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-colors">
                    <Plus size={18} />
                    Create Course
                </button></Link>
            </div>

            {/* Search & Filters Section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                    >
                        <option value="all">All Categories</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="fullstack">Fullstack</option>
                    </select>

                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                    >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>

                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-3 text-foreground hover:bg-accent transition-colors"
                    >
                        <Filter size={16} />
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Courses</p>
                            <p className="text-3xl font-bold">{stats.totalCourses}</p>
                        </div>
                        <BookOpen size={24} className="text-blue-500" />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Published</p>
                            <p className="text-3xl font-bold">

                                {(Array.isArray(publishedCoursesData) ? publishedCoursesData.length : undefined) ??
                                    (courses?.filter(c => Boolean(c.published) || c.status === "published").length ?? 0)}
                            </p>
                        </div>
                        <CheckCircle2 size={24} className="text-emerald-500" />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Modules</p>
                            <p className="text-3xl font-bold">{stats.totalModules}</p>
                        </div>
                        <FileText size={24} className="text-purple-500" />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Lectures</p>
                            {loadingLectures ? (
                                <div className="animate-pulse">
                                    <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                                    <div className="h-3 bg-muted rounded w-20"></div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-3xl font-bold">{stats.totalLectures}</p>
                                    <p className="text-xs text-muted-foreground">{stats.publishedLectures} published</p>
                                </>
                            )}
                        </div>
                        <Video size={24} className="text-orange-500" />
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Pending Requests</p>
                            {loadingEnrollmentRequests ? (
                                <div className="animate-pulse">
                                    <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                                    <div className="h-3 bg-muted rounded w-20"></div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-3xl font-bold">{stats.pendingRequests}</p>
                                    <p className="text-xs text-muted-foreground">{stats.approvedRequests} approved</p>
                                </>
                            )}
                        </div>
                        <Users size={24} className="text-amber-500" />
                    </div>
                </div>
            </div>

            {/* Pending Requests Section */}
            {/* {pendingRequests.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Pending Enrollment Requests</h2>
                        <Link href="/dashboard/admin/enrollment-request">
                            <button className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                                View All Requests
                            </button>
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pendingRequests.slice(0, 6).map((request) => {
                            const course = request.course || courses.find(c => c._id === request.courseId);
                            const user = request.user || users.find(u => u._id === request.userId);
                            const createdAt = request.createdAt ? new Date(request.createdAt) : null;
                            
                            return (
                                <div key={request._id} className="rounded-lg border bg-card p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                                            {course?.thumbnail ? (
                                                <Image
                                                    src={course.thumbnail}
                                                    alt={course.title || "Course"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <BookOpen size={20} className="text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate">{course?.title || "Unknown Course"}</h3>
                                            <p className="text-sm text-muted-foreground truncate">
                                                Requested by {user?.name || user?.email || "Unknown User"}
                                            </p>
                                            {createdAt && (
                                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {createdAt.toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleApproveRequest(request._id)}
                                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm text-white hover:bg-emerald-600 transition-colors"
                                        >
                                            <CheckCircle2 size={14} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectRequest(request._id)}
                                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600 transition-colors"
                                        >
                                            <XCircle size={14} />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )} */}

            {/* Course Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="rounded-lg border bg-card p-6 animate-pulse">
                            <div className="h-32 bg-muted rounded mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-muted rounded"></div>
                                <div className="h-3 bg-muted rounded"></div>
                                <div className="h-3 bg-muted rounded"></div>
                                <div className="h-3 bg-muted rounded"></div>
                            </div>
                        </div>
                    ))
                ) : filteredCourses.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground text-lg">No courses found</p>
                    </div>
                ) : (
                    filteredCourses.map((course) => (
                        <div key={course._id} className="rounded-lg border bg-card overflow-hidden">
                            {/* Course Image/Thumbnail */}
                            <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <div className="absolute top-2 right-2">
                                    {(course.status === "published" || Boolean(course.published)) ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-600 text-xs font-medium">
                                            <CheckCircle2 size={12} />
                                            Published
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600 text-xs font-medium">
                                            <FileText size={12} />
                                            Draft
                                        </span>
                                    )}
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
                                    {course.description && course.description.length > 120 ? (
                                        <ExpandableDescription description={course.description} />
                                    ) : (
                                        <p className="text-muted-foreground text-sm mb-3">
                                            {course.description || "Course description"}
                                        </p>
                                    )}
                                </div>

                                {/* Course Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User size={14} />
                                        <span>{course.instructor || "Instructor Name"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock size={14} />
                                        <span>
                                            {(() => {
                                                // Parse duration as minutes or "Xh Ym"
                                                const d = course.duration;
                                                if (!d) return "0h 0m";
                                                if (typeof d === "number") {
                                                    const hours = Math.floor(d / 60);
                                                    const mins = d % 60;
                                                    return `${hours}h ${mins}m`;
                                                }
                                                // If string, try to parse "Xh Ym" or "Z" (minutes)
                                                const match = /^(\d+)\s*h\s*(\d+)?\s*m?$/i.exec(d);
                                                if (match) {
                                                    const h = match[1] || "0";
                                                    const m = match[2] || "0";
                                                    return `${h}h ${m}m`;
                                                }
                                                // If only minutes as string
                                                const mins = parseInt(d, 10);
                                                if (!isNaN(mins)) {
                                                    const hours = Math.floor(mins / 60);
                                                    const rem = mins % 60;
                                                    return `${hours}h ${rem}m`;
                                                }
                                                return d;
                                            })()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <DollarSign size={14} />
                                        <span>{course.price || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <BarChart3 size={14} />
                                        <span>{modules.filter(m => m.courseId === course._id).length} modules</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 text-xs font-medium">
                                        {course.level || "beginner"}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                        {course.category || "Fullstack"}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Link href={`/dashboard/admin/courses/${course._id}`}>   <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer">
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