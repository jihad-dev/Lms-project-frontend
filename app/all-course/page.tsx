'use client';

import { useGetAllCoursesQuery } from "@/src/Redux/features/course/courseApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useMemo, useState } from "react";

const AllCoursePage = () => {
    const { data: courses, isLoading, isError } = useGetAllCoursesQuery(undefined);
    const coursesData = Array.isArray(courses) ? courses : [];

    // Filters & Sorting
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | "">("");
    const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
    const [sortBy, setSortBy] = useState<"relevance" | "title" | "priceAsc" | "priceDesc">("relevance");

    const filteredCourses = useMemo(() => {
        let result = [...coursesData];
        const s = search.trim().toLowerCase();

        if (s) {
            result = result.filter((c: any) =>
                String(c?.title || "").toLowerCase().includes(s) ||
                String(c?.description || "").toLowerCase().includes(s)
            );
        }

        if (statusFilter) {
            result = result.filter((c: any) => String(c?.status || "").toLowerCase() === String(statusFilter).toLowerCase());
        }

        if (priceFilter !== "all") {
            if (priceFilter === "free") {
                result = result.filter((c: any) => !c?.price || Number(c.price) === 0);
            } else if (priceFilter === "paid") {
                result = result.filter((c: any) => Number(c?.price) > 0);
            }
        }

        if (sortBy !== "relevance") {
            if (sortBy === "title") {
                result.sort((a: any, b: any) => String(a?.title || "").localeCompare(String(b?.title || "")));
            }
            if (sortBy === "priceAsc") {
                result.sort((a: any, b: any) => Number(a?.price || 0) - Number(b?.price || 0));
            }
            if (sortBy === "priceDesc") {
                result.sort((a: any, b: any) => Number(b?.price || 0) - Number(a?.price || 0));
            }
        }
        return result;
    }, [coursesData, search, statusFilter, priceFilter, sortBy]);

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("");
        setPriceFilter("all");
        setSortBy("relevance");
    };

    const SkeletonCard = () => (
        <div className="group rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
            <div className="h-40 w-full bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                <div className="flex items-center justify-between pt-2">
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                    <div className="h-9 w-24 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );

    const CourseCard = ({ course }: { course: any }) => {
        const { _id, title, description, price, thumbnail, status } = course || {};
        return (
            <Link href={`/courses/${_id}`} className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden hover:border-blue-200 ring-1 ring-transparent hover:ring-blue-100">
                <div className="relative h-40 w-full bg-gray-100">
                    {thumbnail ? (
                        // Using a plain img to avoid next/image domain config issues
                        <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-400">
                            <span className="font-semibold">No Image</span>
                        </div>
                    )}
                    {status && (
                        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                            {String(status).toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-gray-900 font-semibold text-base line-clamp-1 group-hover:text-blue-700 transition-colors">{title || 'Untitled Course'}</h3>
                    {description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm">
                            <span className="text-gray-500">Price</span>
                            <div className="font-semibold text-gray-900">{price ? `$${price}` : <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-green-700 border border-green-200 text-xs">Free</span>}</div>
                        </div>
                        <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium px-3 py-2 shadow-sm group-hover:from-blue-700 group-hover:to-indigo-700 transition-colors">
                            View Details
                        </span>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-end justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Courses</h1>
                            <p className="text-gray-500 mt-1 text-sm">Browse our full catalog of courses</p>
                        </div>
                        <div className="hidden sm:block">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                                {filteredCourses.length} results
                            </span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by title or description"
                                        className="w-full rounded-lg border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-600 pl-10"
                                        type="text"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.216 12.032l3.251 3.251a.75.75 0 1 0 1.06-1.06l-3.25-3.252A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" /></svg>
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-600"
                                >
                                    <option value="">All</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value as any)}
                                    className="w-full rounded-lg border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-600"
                                >
                                    <option value="all">All</option>
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Sort by</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full rounded-lg border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-600"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="title">Title (A-Z)</option>
                                    <option value="priceAsc">Price (Low to High)</option>
                                    <option value="priceDesc">Price (High to Low)</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-gray-600">Showing {filteredCourses.length} of {coursesData.length}</div>
                            <button onClick={resetFilters} className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100">
                                Reset filters
                            </button>
                        </div>
                    </div>

                    {isError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4">
                            Failed to load courses. Please try again.
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <SkeletonCard key={idx} />
                            ))}
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12V16.5Zm9-4.125a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                            </div>
                            <h3 className="text-gray-900 font-semibold">No courses found</h3>
                            <p className="text-gray-600 text-sm mt-1">Please check back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCourses.map((course: any) => (
                                <CourseCard key={course?._id || course?.id} course={course} />)
                            )}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default AllCoursePage;
