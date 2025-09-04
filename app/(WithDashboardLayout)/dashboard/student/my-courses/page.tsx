"use client";

import Link from "next/link";
import { useGetMyEnrollmentRequestsQuery } from "@/src/Redux/features/course/enrollmentApi";
import { useState } from "react";

// Loading Skeleton Components
const StatsCardSkeleton = () => (
  <div className="rounded-xl border bg-card p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-3 flex-1">
        <div className="h-4 w-24 bg-muted rounded-lg"></div>
        <div className="h-10 w-16 bg-muted rounded-lg"></div>
        <div className="h-3 w-32 bg-muted rounded-lg"></div>
      </div>
      <div className="h-12 w-12 rounded-xl bg-muted"></div>
    </div>
  </div>
);

const CourseCardSkeleton = () => (
  <div className="rounded-xl border bg-card p-5 animate-pulse">
    <div className="flex flex-col gap-3">
      <div className="h-32 w-full bg-muted rounded-lg"></div>
      <div className="h-4 w-16 bg-muted rounded-lg"></div>
      <div className="h-5 w-3/4 bg-muted rounded-lg"></div>
      <div className="h-10 w-full bg-muted rounded-lg"></div>
    </div>
  </div>
);

const PendingRequestSkeleton = () => (
  <div className="rounded-xl border bg-card p-4 animate-pulse">
    <div className="h-4 w-3/4 bg-muted rounded-lg"></div>
  </div>
);

// Error Component with Retry
const ErrorState = ({ onRetry, isRetrying }: { onRetry: () => void; isRetrying: boolean }) => (
  <div className="p-6">
    <div className="text-center py-12">
      <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">Failed to Load Courses</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
        We couldn't load your enrollment data. This might be due to a network issue or server problem.
      </p>
      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="inline-flex items-center px-6 py-3 bg-destructive hover:bg-destructive/90 disabled:bg-destructive/50 text-destructive-foreground rounded-lg font-semibold transition-colors"
      >
        {isRetrying ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Retrying...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </>
        )}
      </button>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-12">
    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-foreground mb-3">No Courses Yet</h3>
    <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
      You haven't enrolled in any courses yet. Browse our course catalog to get started with your learning journey.
    </p>
    <Link
      href="/courses"
      className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
    >
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      Browse Courses
    </Link>
  </div>
);

const MyCoursesPage = () => {
  const { data, isLoading, isError, refetch } = useGetMyEnrollmentRequestsQuery(undefined);
  const [isRetrying, setIsRetrying] = useState(false);

  const raw: any = data as any;
  const requests: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : [];
  const approved = requests.filter((r) => r?.status === "approved");
  const pending = requests.filter((r) => r?.status === "pending");

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refetch();
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="h-4 w-80 bg-muted rounded-lg animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>

        {/* Courses Section Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        </div>

        {/* Pending Requests Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-40 bg-muted rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <PendingRequestSkeleton />
            <PendingRequestSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={handleRetry} isRetrying={isRetrying} />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Learning Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">Welcome back! Continue your learning journey.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="group rounded-xl border bg-card p-4 sm:p-6 flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">Enrolled Courses</p>
            <p className="text-3xl sm:text-4xl font-bold text-foreground">{approved.length}</p>
            <p className="text-xs text-muted-foreground">Courses you have access to</p>
          </div>
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>

        <div className="group rounded-xl border bg-card p-4 sm:p-6 flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">Pending Requests</p>
            <p className="text-3xl sm:text-4xl font-bold text-foreground">{pending.length}</p>
            <p className="text-xs text-muted-foreground">Awaiting admin approval</p>
          </div>
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-chart-4/10 flex items-center justify-center text-chart-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Your Courses</h3>
          {approved.length > 0 && (
            <span className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full border">
              {approved.length} {approved.length === 1 ? 'course' : 'courses'}
            </span>
          )}
        </div>
        
        {approved.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 sm:p-8">
            <EmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {approved.map((req) => {
              const courseObj = typeof req?.courseId === "object" ? req.courseId : null;
              const courseId = courseObj?._id ?? req?.courseId;
              const courseTitle = courseObj?.title ?? `Course ${String(courseId ?? "")}`;
              const thumbnail = courseObj?.thumbnail as string | undefined;
              return (
                <div key={req?._id} className="group rounded-xl border bg-card p-4 sm:p-5 hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col gap-4 h-full">
                    {thumbnail ? (
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={thumbnail} 
                          alt={courseTitle} 
                          className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      <div className="h-32 w-full bg-muted rounded-lg flex items-center justify-center">
                        <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Course</p>
                      <p className="font-semibold text-foreground break-words line-clamp-2">{courseTitle}</p>
                    </div>
                    <Link
                      href={`/courses/${courseId}/learn`}
                      className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 px-4 py-3 text-sm font-semibold text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Go to course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Requests Section */}
      {pending.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Pending Approvals</h3>
            <span className="text-sm text-chart-4 bg-chart-4/10 px-4 py-2 rounded-full border border-chart-4/20">
              {pending.length} {pending.length === 1 ? 'request' : 'requests'}
            </span>
          </div>
          <div className="space-y-3">
            {pending.map((req) => {
              const courseTitle = typeof req?.courseId === "object" 
                ? (req?.courseId?.title ?? req?.courseId?._id) 
                : String(req?.courseId ?? "");
              return (
                <div key={req?._id} className="rounded-xl border bg-card p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-xl bg-chart-4/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">
                        Request for course <span className="font-semibold">{courseTitle}</span> is pending approval.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">We'll notify you once it's approved.</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;