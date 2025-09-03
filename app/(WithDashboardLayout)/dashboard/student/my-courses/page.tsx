"use client";

import Link from "next/link";
import { useGetMyEnrollmentRequestsQuery } from "@/src/Redux/features/course/enrollmentApi";

const MyCoursesPage = () => {
  const { data, isLoading, isError } = useGetMyEnrollmentRequestsQuery(undefined);

  const raw: any = data as any;
  const requests: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : [];
  const approved = requests.filter((r) => r?.status === "approved");
  const pending = requests.filter((r) => r?.status === "pending");

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-gray-700/40 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 rounded-lg bg-gray-700/40 animate-pulse" />
          <div className="h-32 rounded-lg bg-gray-700/40 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-400">Failed to load your enrollments. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-semibold">Learning Dashboard</h2>
        <p className="text-sm text-gray-400 mt-1">Welcome back! Continue your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400">Enrolled Courses</p>
            <p className="text-4xl font-bold mt-2">{approved.length}</p>
            <p className="text-xs text-gray-500 mt-1">Courses you have access to</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
            <span className="text-2xl">📘</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400">Pending Requests</p>
            <p className="text-4xl font-bold mt-2">{pending.length}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting admin approval</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-400">
            <span className="text-2xl">🕒</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Courses</h3>
        {approved.length === 0 ? (
          <div className="rounded-lg border border-gray-700/50 p-6 text-gray-400">You are not enrolled in any course yet.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map((req) => {
              const courseObj = typeof req?.courseId === "object" ? req.courseId : null;
              const courseId = courseObj?._id ?? req?.courseId;
              const courseTitle = courseObj?.title ?? `Course ${String(courseId ?? "")}`;
              const thumbnail = courseObj?.thumbnail as string | undefined;
              return (
                <li key={req?._id} className="rounded-lg border border-gray-700/50 bg-gray-900/40 p-5">
                  <div className="flex flex-col gap-3">
                    {thumbnail && (
                      <img src={thumbnail} alt={courseTitle} className="h-32 w-full object-cover rounded" />
                    )}
                    <p className="text-sm text-gray-400">Course</p>
                    <p className="font-medium break-words">{courseTitle}</p>
                    <Link
                      href={`/courses/${courseId}/learn`
                      }
                      className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                    >
                      Go to course
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Pending Approvals</h3>
          <ul className="space-y-2">
            {pending.map((req) => (
              <li key={req?._id} className="rounded-md border border-gray-700/50 p-4 text-gray-300">
                Request for course <span className="font-mono">{typeof req?.courseId === "object" ? (req?.courseId?.title ?? req?.courseId?._id) : String(req?.courseId ?? "")}</span> is pending.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;