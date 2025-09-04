"use client";

import { useGetMyEnrollmentRequestsQuery } from "@/src/Redux/features/course/enrollmentApi";
import { useGetPublishedCoursesQuery } from "@/src/Redux/features/course/courseApi";
import Link from "next/link";
import { useMemo } from "react";

const StudentPage = () => {
    const { data: enrollments, isLoading: enrollmentsLoading, isError: enrollmentsError } = useGetMyEnrollmentRequestsQuery(undefined);
    const { data: allCourses, isLoading: coursesLoading } = useGetPublishedCoursesQuery();
    
    // Process enrollment data
    const enrollmentData = useMemo(() => {
        if (!enrollments) return { approved: [], pending: [], rejected: [] };
        
        const enrollmentResponse = enrollments as any;
        const raw = Array.isArray(enrollmentResponse) ? enrollmentResponse : Array.isArray(enrollmentResponse?.data) ? enrollmentResponse.data : [];
        return {
            approved: raw.filter((r: any) => r?.status === "approved"),
            pending: raw.filter((r: any) => r?.status === "pending"),
            rejected: raw.filter((r: any) => r?.status === "rejected")
        };
    }, [enrollments]);

    // Calculate statistics
    const stats = useMemo(() => {
        const enrolled = enrollmentData.approved.length;
        const inProgress = Math.floor(enrolled * 0.6); // Simulate in-progress courses
        const completed = Math.floor(enrolled * 0.3); // Simulate completed courses
        const certificates = Math.floor(completed * 0.7); // Simulate certificates
        
        return { enrolled, inProgress, completed, certificates };
    }, [enrollmentData]);

    // Get recommended courses (exclude enrolled ones)
    const recommendedCourses = useMemo(() => {
        if (!allCourses) return [];
        const enrolledCourseIds = enrollmentData.approved.map((e: any) => e.courseId);
        return allCourses.filter((course: any) => !enrolledCourseIds.includes(course._id)).slice(0, 3);
    }, [allCourses, enrollmentData]);

    const isLoading = enrollmentsLoading || coursesLoading;
    const isError = enrollmentsError;

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Welcome back 👋</h1>
                        <p className="text-sm text-muted-foreground">Here's a quick look at your learning progress.</p>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl border p-4">
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-3" />
                            <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Welcome back 👋</h1>
                        <p className="text-sm text-muted-foreground">Here's a quick look at your learning progress.</p>
                    </div>
                </div>
                <div className="rounded-xl border p-8 text-center">
                    <p className="text-red-500">Failed to load your data. Please try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back 👋</h1>
                    <p className="text-sm text-muted-foreground">Here's a quick look at your learning progress.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/all-course" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">
                        Browse Courses 
                    </Link>
                    <Link href="/dashboard/student/my-courses" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                        My Courses
                    </Link>
                </div>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Enrolled</p>
                    <p className="mt-2 text-2xl font-semibold">{stats.enrolled}</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, (stats.enrolled / 10) * 100)}%` }} />
                    </div>
                </div>
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="mt-2 text-2xl font-semibold">{stats.inProgress}</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, (stats.inProgress / 10) * 100)}%` }} />
                    </div>
                </div>
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="mt-2 text-2xl font-semibold">{stats.completed}</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, (stats.completed / 10) * 100)}%` }} />
                    </div>
                </div>
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Certificates</p>
                    <p className="mt-2 text-2xl font-semibold">{stats.certificates}</p>
                    <div className="mt-3 flex gap-2">
                        <a href="/dashboard/student/my-courses" className="text-xs underline underline-offset-2">View</a>
                        <a href="/dashboard/student/my-reviews" className="text-xs underline underline-offset-2">Reviews</a>
                    </div>
                </div>
            </section>


            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recommended For You</h2>
                    <a href="/all-course" className="text-sm text-primary hover:underline">Explore</a>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendedCourses.length > 0 ? (
                        recommendedCourses.map((course: any) => (
                            <a key={course._id} href={`/courses/${course._id}`} className="rounded-xl border p-4 hover:bg-accent/40">
                                <div className="h-32 w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                                            {course.title?.charAt(0) || 'C'}
                                        </div>
                                    )}
                                </div>
                                <p className="mt-3 line-clamp-2 font-medium">{course.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {course.price ? `$${course.price}` : 'Free'} • {course.status || 'Published'}
                                </p>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-full p-8 text-center text-muted-foreground">
                            <p>No recommended courses available at the moment.</p>
                            <Link href="/all-course" className="text-primary hover:underline mt-2 inline-block">
                                Browse All Courses
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default StudentPage;