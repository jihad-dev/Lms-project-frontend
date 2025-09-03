'use client';

import Image from "next/image";
import {
	useGetAllEnrollmentRequestsQuery,
	useUpdateEnrollmentRequestMutation,
	useDeleteEnrollmentRequestMutation,
} from "@/src/Redux/features/course/enrollmentApi";
import {
	CheckCircle2,
	XCircle,
	RefreshCw,
	Calendar,
	Trash2,
} from "lucide-react";
import React from "react";

// Local helper to normalize API response shape
const useNormalizedEnrollmentRequests = () => {
	const {
		data: raw,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = useGetAllEnrollmentRequestsQuery(undefined);

	const data = React.useMemo(() => {
		if (!raw) return [] as any[];
		// @ts-ignore
		const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);
		return Array.isArray(arr) ? arr : [];
	}, [raw]);

	return { data, isLoading, isError, refetch, isFetching } as const;
};

const Badge = ({
	children,
	variant = "default",
}: {
	children: React.ReactNode;
	variant?: "default" | "success" | "warning" | "danger";
}) => {
	const variants: Record<string, string> = {
		default:
			"bg-slate-700 text-slate-200",
		success:
			"bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30",
		warning:
			"bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30",
		danger:
			"bg-red-500/20 text-red-300 ring-1 ring-red-500/30",
	};
	return (
		<span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
			{children}
		</span>
	);
};

const EnrollmentRequest: React.FC = () => {
	const { data: requests, isLoading, isError, refetch, isFetching } =
		useNormalizedEnrollmentRequests();

	const [updateEnrollmentRequest, { isLoading: isUpdating }] = useUpdateEnrollmentRequestMutation();
	const [deleteEnrollmentRequest, { isLoading: isDeleting }] = useDeleteEnrollmentRequestMutation();

	const handleApprove = async (id: string) => {
		try {
			await updateEnrollmentRequest({ _id: id, status: "approved" }).unwrap();
			refetch();
		} catch {}
	};

	const handleReject = async (id: string) => {
		try {
			await updateEnrollmentRequest({ _id: id, status: "rejected" }).unwrap();
			refetch();
		} catch {}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteEnrollmentRequest({ _id: id }).unwrap();
			refetch();
		} catch {}
	};

	return (
		<div className="min-h-screen bg-slate-900 text-white p-6 space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-3xl font-semibold">Enrollment Requests</h1>
					<p className="text-slate-400 mt-1">Manage course enrollment requests from users</p>
				</div>
				<button
					onClick={() => refetch()}
					className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
					disabled={isFetching}
				>
					<RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
					Refresh
				</button>
			</div>

			{/* States */}
			{isLoading && (
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 animate-pulse"
						>
							<div className="h-6 w-40 bg-slate-700 rounded mb-4" />
							<div className="h-4 w-64 bg-slate-700 rounded" />
						</div>
					))}
				</div>
			)}

			{isError && (
				<div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
					Failed to load enrollment requests. Try refreshing.
				</div>
			)}

			{!isLoading && !isError && requests.length === 0 && (
				<div className="rounded-lg border border-slate-800 bg-slate-800/50 p-10 text-center text-slate-400">
					No enrollment requests found.
				</div>
			)}

			{/* List */}
			<div className="space-y-4">
				{requests.map((req: any) => {
					const course = req.course || req.courseId || {};
					const user = req.user || req.userId || {};
					const courseTitle = course.title || course.name || "Untitled";
					const thumbnail = course.thumbnail || course.image || "";
					const requesterName = user.name || user.username || "Unknown";
					const requesterEmail = user.email || "";
					const createdAt = req.createdAt ? new Date(req.createdAt) : null;
					const status = (req.status || "pending").toLowerCase();

					return (
						<div
							key={req._id || `${courseTitle}-${requesterEmail}`}
							className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 md:p-6"
						>
							<div className="flex items-start gap-4 md:gap-6">
								<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-700">
									{thumbnail ? (
										<Image
											src={thumbnail}
											alt={courseTitle}
											fill
											className="object-cover"
											sizes="64px"
										/>
									) : null}
								</div>

								<div className="flex-1 min-w-0">
									<h3 className="text-lg font-semibold truncate">{courseTitle}</h3>
									<p className="text-slate-400 text-sm mt-1 truncate">
										Requested by {requesterName}
										{requesterEmail ? ` (${requesterEmail})` : ""}
									</p>
									{createdAt && (
										<p className="text-slate-500 text-xs mt-2 inline-flex items-center gap-2">
											<Calendar size={14} />
											<span>
												Requested: {createdAt.toLocaleDateString()}
											</span>
										</p>
									)}
								</div>

								<div className="flex flex-col items-end gap-3">
									<div>
										{status === "approved" ? (
											<Badge variant="success">Approved</Badge>
										) : status === "rejected" ? (
											<Badge variant="danger">Rejected</Badge>
										) : (
											<Badge variant="warning">Pending</Badge>
										)}
									</div>

									<div className="flex flex-wrap gap-2 justify-end">
										
										<button onClick={() => handleApprove(req._id)} disabled={isUpdating} className="inline-flex  cursor-pointer items-center gap-2 rounded-lg bg-emerald-600/90 px-3 py-2 text-sm text-white hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
											<CheckCircle2 size={16} />
											Approve
										</button>
										<button onClick={() => handleReject(req._id)} disabled={isUpdating} className="inline-flex  cursor-pointer items-center gap-2 rounded-lg bg-red-600/90 px-3 py-2 text-sm text-white hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
											<XCircle  size={16} />
											Reject
										</button>
									</div>

									<div className="w-full">
										<div className="mt-3 rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-3 text-slate-400 text-sm inline-flex items-center gap-2">
											<button onClick={() => handleDelete(req._id)} disabled={isDeleting} className="inline-flex items-center gap-2 text-slate-400 hover:text-red-300 disabled:opacity-60 disabled:cursor-not-allowed">
												<Trash2 size={16} className="text-slate-500" />
												<span>Move to trash</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default EnrollmentRequest;
