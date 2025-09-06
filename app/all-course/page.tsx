'use client';

import { useGetAllCoursesQuery } from "@/src/Redux/features/course/courseApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

const AllCoursePage = () => {
    const { data: courses, isLoading, isError, error, refetch } = useGetAllCoursesQuery(undefined);
    const coursesData = Array.isArray(courses) ? courses : [];

    // Filters & Sorting
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | "">("");
    const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
    const [sortBy, setSortBy] = useState<"relevance" | "title" | "priceAsc" | "priceDesc">("relevance");
    const [retryCount, setRetryCount] = useState(0);

    // Error handling with retry mechanism
    useEffect(() => {
        if (isError && retryCount < 3) {
            const errorMessage = (error as any)?.data?.message || (error as any)?.message || "Failed to load courses";
            toast.error(`${errorMessage}. Retrying... (${retryCount + 1}/3)`);
            
            const timer = setTimeout(() => {
                setRetryCount(prev => prev + 1);
                refetch();
            }, 2000 * (retryCount + 1)); // Exponential backoff

            return () => clearTimeout(timer);
        } else if (isError && retryCount >= 3) {
            toast.error("Failed to load courses after multiple attempts. Please refresh the page.");
        }
    }, [isError, error, retryCount, refetch]);

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
        <div className="group rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse hover:shadow-md transition-all duration-300">
            <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <div className="h-6 w-4/5 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center justify-between pt-3">
                    <div className="h-7 w-20 bg-gray-200 rounded-full" />
                    <div className="h-10 w-28 bg-gray-200 rounded-xl" />
                </div>
            </div>
        </div>
    );

    const CourseCard = ({ course }: { course: any }) => {
        const { _id, title, description, price, thumbnail, status } = course || {};
        const isFree = !price || Number(price) === 0;
        
        return (
            <Link 
                href={`/courses/${_id}`} 
                className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-blue-200 ring-1 ring-transparent hover:ring-blue-100 hover:-translate-y-1"
            >
                <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                    {thumbnail ? (
                        <img 
                            src={thumbnail} 
                            alt={title} 
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            loading="lazy"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-500">Course Preview</span>
                            </div>
                        </div>
                    )}
                    {status && (
                        <span className={`absolute top-4 left-4 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border ${
                            status.toLowerCase() === 'published' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                            {String(status).toUpperCase()}
                        </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                    <h3 className="text-gray-900 font-bold text-lg line-clamp-2 group-hover:text-blue-700 transition-colors mb-2">
                        {title || 'Untitled Course'}
                    </h3>
                    {description && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                            {description}
                        </p>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium mb-1">Price</span>
                            {isFree ? (
                                <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700 border border-green-200">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Free
                                </span>
                            ) : (
                                <span className="text-xl font-bold text-gray-900">${price}</span>
                            )}
                        </div>
                        <span className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2.5 shadow-sm group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-200 group-hover:shadow-md">
                            View Course
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <Navbar />

            <main className="flex-1">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Header Section */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Discover Amazing
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Courses</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                            Explore our comprehensive catalog of courses designed to help you learn and grow
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 shadow-sm">
                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {filteredCourses.length} courses available
                            </div>
                            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-200">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Updated daily
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 sm:mb-12 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Filter & Search</h2>
                            <button 
                                onClick={resetFilters} 
                                className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {/* Search */}
                            <div className="sm:col-span-2 lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Courses</label>
                                <div className="relative">
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by title or description..."
                                        className="w-full rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-12 pr-4 py-3 text-sm transition-all duration-200"
                                        type="text"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm transition-all duration-200"
                                >
                                    <option value="">All Status</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            
                            {/* Price Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value as any)}
                                    className="w-full rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm transition-all duration-200"
                                >
                                    <option value="all">All Prices</option>
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Sort and Results */}
                        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-4 py-3 text-sm transition-all duration-200 min-w-[200px]"
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="title">Title (A-Z)</option>
                                        <option value="priceAsc">Price (Low to High)</option>
                                        <option value="priceDesc">Price (High to Low)</option>
                                    </select>
                                </div>
                                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                                    <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of <span className="font-semibold text-gray-900">{coursesData.length}</span> courses
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error State */}
                    {isError && retryCount >= 3 && (
                        <div className="rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-sm p-8 text-center mb-8">
                            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Courses</h3>
                            <p className="text-red-700 mb-4">We couldn't load the courses. Please try refreshing the page.</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="inline-flex items-center rounded-xl bg-red-600 text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh Page
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                                    <span className="text-sm font-medium">Loading courses...</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <SkeletonCard key={idx} />
                                ))}
                            </div>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-12 text-center">
                            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">No courses found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search || statusFilter || priceFilter !== "all" 
                                    ? "Try adjusting your filters to see more courses." 
                                    : "No courses are available at the moment. Please check back later."
                                }
                            </p>
                            {(search || statusFilter || priceFilter !== "all") && (
                                <button 
                                    onClick={resetFilters}
                                    className="inline-flex items-center rounded-xl bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
                                </h2>
                                <div className="text-sm text-gray-500">
                                    Sorted by {sortBy === 'relevance' ? 'relevance' : sortBy === 'title' ? 'title (A-Z)' : sortBy === 'priceAsc' ? 'price (low to high)' : 'price (high to low)'}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredCourses.map((course: any) => (
                                    <CourseCard key={course?._id || course?.id} course={course} />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default AllCoursePage;
