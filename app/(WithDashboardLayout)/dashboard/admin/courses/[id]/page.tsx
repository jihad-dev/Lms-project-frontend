"use client";

import { useParams } from "next/navigation";

const CourseModuleLectureManagement = () => {
    const params = useParams();
    const courseId = (params?.id as string) || "";

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Manage Modules & Lectures</h2>
            <div className="text-sm text-gray-600">Course ID: {courseId}</div>
            {/* TODO: Replace with actual module & lecture management UI */}
            <div className="rounded border p-4 bg-white">Coming soon…</div>
        </div>
    );
};

export default CourseModuleLectureManagement;


