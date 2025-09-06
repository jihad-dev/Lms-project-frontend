"use client";
import Swal from 'sweetalert2'
import { FormEvent, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeleteCourseMutation, useGetAllCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation } from "@/src/Redux/features/course/courseApi";
import { BookOpen, Upload, Plus, Edit2, Trash2, Eye, X, AlertCircle, CheckCircle } from "lucide-react";
import { ExpandableDescription } from "@/lib/ExpandableDescription";
import Link from 'next/link';

const Course = () => {
    const { data: courses, isLoading, isError, refetch } = useGetAllCoursesQuery();
    const router = useRouter();
    const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
    const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();
    const [deleteCourse, { isLoading: deleting }] = useDeleteCourseMutation();

    const [formState, setFormState] = useState<{
        id?: string;
        title: string;
        instructor: string;
        description: string;
        price: string;
        durationHours: string;
        durationMinutes: string;
        category: string;
        difficultyLevel: string;
        published: boolean;
        thumbnail?: File | null
    }>({
        title: "",
        instructor: "",
        description: "",
        price: "0",
        durationHours: "0",
        durationMinutes: "0",
        category: "",
        difficultyLevel: "Beginner",
        published: false,
        thumbnail: null,
    });

    // Error and validation states
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const isEditing = useMemo(() => Boolean(formState.id), [formState.id]);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (submitError) {
            const timer = setTimeout(() => setSubmitError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [submitError]);

    // Form validation
    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formState.title.trim()) {
            errors.title = "Course title is required";
        } else if (formState.title.length < 3) {
            errors.title = "Course title must be at least 3 characters";
        }

        if (!formState.description.trim()) {
            errors.description = "Course description is required";
        } else if (formState.description.length < 10) {
            errors.description = "Course description must be at least 10 characters";
        }

        if (!formState.price || Number(formState.price) < 0) {
            errors.price = "Price must be a valid positive number";
        }

        if (formState.thumbnail && formState.thumbnail.size > 5 * 1024 * 1024) {
            errors.thumbnail = "Thumbnail size must be less than 5MB";
        }

        if (formState.thumbnail && !formState.thumbnail.type.startsWith('image/')) {
            errors.thumbnail = "Thumbnail must be an image file";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Helper function to format duration
    const formatDuration = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) {
            return `${minutes}min`;
        } else if (minutes === 0) {
            return `${hours}hr`;
        } else {
            return `${hours}hr ${minutes}min`;
        }
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        setSuccessMessage("");

        // Validate form before submission
        if (!validateForm()) {
            setSubmitError("Please fix the errors below before submitting");
            return;
        }

        try {
            // Create course data object
            const totalMinutes = (Number(formState.durationHours) * 60) + Number(formState.durationMinutes);
            const courseData = {
                title: formState.title.trim(),
                instructor: formState.instructor.trim() || undefined,
                description: formState.description.trim(),
                price: Number(formState.price),
                duration: totalMinutes,
                category: formState.category.trim() || undefined,
                difficultyLevel: formState.difficultyLevel,
                published: formState.published
            };

            // If there's a thumbnail, use FormData, otherwise use JSON
            let fd: FormData | null = null;
            if (formState.thumbnail) {
                fd = new FormData();
                Object.entries(courseData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        fd!.append(key, value as any);
                    }
                });
                fd.append("thumbnail", formState.thumbnail);
            }

            if (isEditing && formState.id) {
                const updateData = formState.thumbnail ? fd! : courseData;
                await updateCourse({ id: formState.id, data: updateData }).unwrap();
                setSuccessMessage("Course updated successfully!");
            } else {
                if (formState.thumbnail && fd) {
                    await createCourse(fd).unwrap();
                } else {
                    await createCourse(courseData).unwrap();
                }
                setSuccessMessage("Course created successfully!");
            }

            // Reset form
            setFormState({
                title: "",
                instructor: "",
                description: "",
                price: "0",
                durationHours: "0",
                durationMinutes: "0",
                category: "",
                difficultyLevel: "Beginner",
                published: false,
                thumbnail: null
            });
            setFormErrors({});
            refetch();
        } catch (err: any) {
            console.error("Course submission error:", err);
            const errorMessage = err?.data?.message || err?.message || "An unexpected error occurred. Please try again.";
            setSubmitError(errorMessage);
        }
    };

    const startEdit = (c: any) => {
        const totalMinutes = c?.duration ?? 0;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setFormState({
            id: c?._id || c?.id,
            title: c?.title || "",
            instructor: c?.instructor || "",
            description: c?.description || "",
            price: String(c?.price ?? "0"),
            durationHours: String(hours),
            durationMinutes: String(minutes),
            category: c?.category || "",
            difficultyLevel: c?.difficultyLevel || "Beginner",
            published: c?.published || false,
            thumbnail: null,
        });
        setFormErrors({});
        setSubmitError("");
        setSuccessMessage("");
    };

    // Reset Form Value 
    const resetForm = () => {
        setFormState({
            title: "",
            instructor: "",
            description: "",
            price: "0",
            durationHours: "0",
            durationMinutes: "0",
            category: "",
            difficultyLevel: "Beginner",
            published: false,
            thumbnail: null
        });
        setFormErrors({});
        setSubmitError("");
        setSuccessMessage("");
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-3 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-bold">Courses Management</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">Manage and create courses for your learning platform</p>
                    </div>
                    <Link
                        href="/all-course"
                        className="flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="hidden sm:inline">Browse Courses</span>
                        <span className="sm:hidden">Browse</span>
                    </Link>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <p className="text-green-800 dark:text-green-200 text-sm">{successMessage}</p>
                    </div>
                )}

                {submitError && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-red-800 dark:text-red-200 text-sm">{submitError}</p>
                    </div>
                )}

                {/* Form Section */}
                <div className="bg-card rounded-xl p-4 sm:p-6 border">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                        {isEditing ? "Edit Course" : "Create New Course"}
                    </h2>
                    <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                        {isEditing ? "Update course information below." : "Add a new course to your learning platform."}
                    </p>

                    <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold">Basic Information</h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm">Essential details about your course</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Course Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        className={`w-full rounded-lg border px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all text-sm sm:text-base ${
                                            formErrors.title 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                : 'border-input bg-background text-foreground'
                                        }`}
                                        placeholder="Enter course title"
                                        value={formState.title}
                                        onChange={(e) => {
                                            setFormState((s) => ({ ...s, title: e.target.value }));
                                            if (formErrors.title) {
                                                setFormErrors(prev => ({ ...prev, title: "" }));
                                            }
                                        }}
                                        required
                                    />
                                    {formErrors.title && (
                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Instructor
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all text-sm sm:text-base"
                                        placeholder="Course instructor name"
                                        value={formState.instructor}
                                        onChange={(e) => setFormState((s) => ({ ...s, instructor: e.target.value }))}
                                    />
                                </div>

                                <div className="lg:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Description <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        className={`w-full rounded-lg border px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all resize-none text-sm sm:text-base ${
                                            formErrors.description 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                : 'border-input bg-background text-foreground'
                                        }`}
                                        placeholder="Describe what students will learn in this course..."
                                        rows={4}
                                        value={formState.description}
                                        onChange={(e) => {
                                            setFormState((s) => ({ ...s, description: e.target.value }));
                                            if (formErrors.description) {
                                                setFormErrors(prev => ({ ...prev, description: "" }));
                                            }
                                        }}
                                        required
                                    />
                                    {formErrors.description && (
                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Price ($) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        className={`w-full rounded-lg border px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all text-sm sm:text-base ${
                                            formErrors.price 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                : 'border-input bg-background text-foreground'
                                        }`}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formState.price}
                                        onChange={(e) => {
                                            setFormState((s) => ({ ...s, price: e.target.value }));
                                            if (formErrors.price) {
                                                setFormErrors(prev => ({ ...prev, price: "" }));
                                            }
                                        }}
                                        required
                                    />
                                    {formErrors.price && (
                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {formErrors.price}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Duration
                                    </label>
                                    <div className="flex gap-2 sm:gap-3">
                                        <div className="flex-1">
                                            <input
                                                className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all text-sm sm:text-base"
                                                type="number"
                                                min="0"
                                                placeholder="Hours"
                                                value={formState.durationHours}
                                                onChange={(e) => setFormState((s) => ({ ...s, durationHours: e.target.value }))}
                                            />
                                            <span className="text-xs text-muted-foreground mt-1 block">Hours</span>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all text-sm sm:text-base"
                                                type="number"
                                                min="0"
                                                max="59"
                                                placeholder="Minutes"
                                                value={formState.durationMinutes}
                                                onChange={(e) => setFormState((s) => ({ ...s, durationMinutes: e.target.value }))}
                                            />
                                            <span className="text-xs text-muted-foreground mt-1 block">Minutes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Category
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all text-sm sm:text-base"
                                        placeholder="e.g., Programming, Design"
                                        value={formState.category}
                                        onChange={(e) => setFormState((s) => ({ ...s, category: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Difficulty Level
                                    </label>
                                    <select
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all text-sm sm:text-base"
                                        value={formState.difficultyLevel}
                                        onChange={(e) => setFormState((s) => ({ ...s, difficultyLevel: e.target.value }))}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                <div className="lg:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Publish Status
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormState((s) => ({ ...s, published: !s.published }))}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formState.published ? 'bg-primary/80' : 'bg-muted'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${formState.published ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                        <span className="text-muted-foreground text-sm">
                                            {formState.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Thumbnail Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold">Course Thumbnail</h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm">Upload an image to represent your course</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Thumbnail Image
                                </label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <input
                                        className="hidden"
                                        type="file"
                                        id="thumbnail"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setFormState((s) => ({ ...s, thumbnail: file }));
                                            if (formErrors.thumbnail) {
                                                setFormErrors(prev => ({ ...prev, thumbnail: "" }));
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="thumbnail"
                                        className="border border-input bg-background text-foreground px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-accent transition-colors cursor-pointer text-sm sm:text-base text-center"
                                    >
                                        Choose File
                                    </label>
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-muted-foreground text-sm truncate">
                                            {formState.thumbnail ? formState.thumbnail.name : 'No file chosen'}
                                        </span>
                                        {formState.thumbnail && (
                                            <button
                                                type="button"
                                                onClick={() => setFormState((s) => ({ ...s, thumbnail: null }))}
                                                className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {formErrors.thumbnail && (
                                    <p className="text-red-500 text-xs flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {formErrors.thumbnail}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
                            <button
                                disabled={creating || updating}
                                className="flex items-center justify-center gap-2 bg-primary hover:opacity-90 disabled:opacity-60 text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors font-medium text-sm sm:text-base"
                                type="submit"
                            >
                                {isEditing ? (
                                    <>
                                        <Edit2 className="w-4 h-4" />
                                        {updating ? "Updating..." : "Update Course"}
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        {creating ? "Creating..." : "Create Course"}
                                    </>
                                )}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-input text-foreground hover:bg-accent transition-colors text-sm sm:text-base"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Courses Grid */}
                <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl font-semibold">Existing Courses</h3>

                    {isLoading && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground mt-4 text-sm sm:text-base">Loading courses...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="flex items-center justify-center gap-2 text-destructive">
                                <AlertCircle className="w-5 h-5" />
                                <p className="text-sm sm:text-base">Failed to load courses. Please try again.</p>
                            </div>
                            <button
                                onClick={() => refetch()}
                                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && Array.isArray(courses) && courses.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="flex flex-col items-center gap-3">
                                <BookOpen className="w-12 h-12 text-muted-foreground" />
                                <p className="text-muted-foreground text-sm sm:text-base">No courses found. Create your first course above!</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {!isLoading && Array.isArray(courses) && courses.map((c: any) => (
                            <div
                                key={c?._id || c?.id}
                                className="rounded-lg border bg-card overflow-hidden group relative transition-all duration-300 hover:border-primary/70 hover:shadow-lg"
                            >
                                {/* Thumbnail with overlay and badge */}
                                <div className="relative h-40 sm:h-48 lg:h-52 bg-muted flex items-center justify-center overflow-hidden">
                                    {c?.thumbnail ? (
                                        <img
                                            src={c.thumbnail}
                                            alt={c?.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-2xl sm:text-3xl lg:text-4xl font-bold">
                                            {c?.title?.[0] || "C"}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-1 sm:gap-2">
                                        {c?.category && (
                                            <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold shadow">
                                                {c.category}
                                            </span>
                                        )}
                                        {c?.difficultyLevel && (
                                            <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-semibold shadow">
                                                {c.difficultyLevel}
                                            </span>
                                        )}
                                    </div>
                                    {c?.price !== undefined && (
                                        <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-primary text-primary-foreground px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow">
                                            ${c.price}
                                        </span>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1 min-w-0">
                                                {c?.title}
                                            </h3>
                                            {c?.status && (
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${c.status === "published"
                                                    ? "bg-emerald-500/20 text-emerald-600"
                                                    : "bg-yellow-500/20 text-yellow-600"
                                                    }`}>
                                                    {c.status === "published" ? "Published" : "Draft"}
                                                </span>
                                            )}
                                        </div>
                                        {c?.instructor && (
                                            <p className="text-xs sm:text-sm text-muted-foreground italic">
                                                by {c.instructor}
                                            </p>
                                        )}
                                        {c?.duration && (
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                Duration: {formatDuration(c.duration)}
                                            </p>
                                        )}
                                        {c?.description && (
                                            <div className="text-xs sm:text-sm">
                                                <ExpandableDescription description={c.description} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex w-full gap-2 pt-2 sm:pt-3">
                                        <button
                                            className="w-1/2 cursor-pointer flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-l-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-medium shadow text-xs sm:text-sm"
                                            onClick={(e) => { e.stopPropagation(); startEdit(c); }}
                                        >
                                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="hidden sm:inline">Edit</span>
                                        </button>
                                        <button
                                            className="w-1/2 cursor-pointer flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-r-lg bg-destructive text-destructive-foreground transition-colors disabled:bg-muted font-medium shadow text-xs sm:text-sm"
                                            disabled={deleting}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const result = await Swal.fire({
                                                    title: "Are you sure?",
                                                    text: "You won't be able to revert this!",
                                                    icon: "warning",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    confirmButtonText: "Yes, delete it!"
                                                });
                                                if (result.isConfirmed) {
                                                    try {
                                                        await deleteCourse({ id: c?._id }).unwrap();
                                                        Swal.fire({
                                                            title: "Deleted!",
                                                            text: "The course has been deleted.",
                                                            icon: "success"
                                                        });
                                                        refetch();
                                                    } catch (error) {
                                                        Swal.fire({
                                                            title: "Error!",
                                                            text: "Failed to delete the course.",
                                                            icon: "error"
                                                        });
                                                    }
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course;