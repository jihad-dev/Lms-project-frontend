"use client";
import Swal from 'sweetalert2'
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteCourseMutation, useGetAllCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation } from "@/src/Redux/features/course/courseApi";
import { BookOpen, Upload, Plus, Edit2, Trash2, Eye, X } from "lucide-react";
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
        duration: string;
        category: string;
        difficultyLevel: string;
        published: boolean;
        thumbnail?: File | null
    }>({
        title: "",
        instructor: "",
        description: "",
        price: "0",
        duration: "0",
        category: "",
        difficultyLevel: "Beginner",
        published: false,
        thumbnail: null,
    });

    const isEditing = useMemo(() => Boolean(formState.id), [formState.id]);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Create course data object
        const courseData = {
            title: formState.title,
            instructor: formState.instructor || undefined,
            description: formState.description,
            price: Number(formState.price),
            duration: Number(formState.duration),
            category: formState.category || undefined,
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

        try {

            if (isEditing && formState.id) {
                const updateData = formState.thumbnail ? fd! : courseData;
                await updateCourse({ id: formState.id, data: updateData }).unwrap();
            } else {
                if (formState.thumbnail && fd) {

                    await createCourse(fd).unwrap();


                } else {

                    await createCourse(courseData).unwrap();

                }
            }
            setFormState({
                title: "",
                instructor: "",
                description: "",
                price: "0",
                duration: "0",
                category: "",
                difficultyLevel: "Beginner",
                published: false,
                thumbnail: null
            });
            refetch();
        } catch (err: any) {
            console.error(err.message)
        }
    };

    const startEdit = (c: any) => {
        setFormState({
            id: c?._id || c?.id,
            title: c?.title || "",
            instructor: c?.instructor || "",
            description: c?.description || "",
            price: String(c?.price ?? "0"),
            duration: String(c?.duration ?? "0"),
            category: c?.category || "",
            difficultyLevel: c?.difficultyLevel || "Beginner",
            published: c?.published || false,
            thumbnail: null,
        });
    };
    // Reset Form Value 
    const resetForm = () => {
        setFormState({
            title: "",
            instructor: "",
            description: "",
            price: "0",
            duration: "0",
            category: "",
            difficultyLevel: "Beginner",
            published: false,
            thumbnail: null
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Courses Management</h1>
                        <p className="text-muted-foreground mt-2">Manage and create courses for your learning platform</p>
                    </div>
                    <Link
                        href="/all-course"
                        className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Browse Courses
                    </Link>
                </div>

                {/* Form Section */}
                <div className="bg-card rounded-xl p-6 border">
                    <h2 className="text-2xl font-semibold mb-6">Create New Course</h2>
                    <p className="text-muted-foreground mb-8">Add a new course to your learning platform.</p>

                    <form onSubmit={onSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Basic Information</h3>
                                    <p className="text-muted-foreground text-sm">Essential details about your course</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Course Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
                                        placeholder="Enter course title"
                                        value={formState.title}
                                        onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Instructor
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
                                        placeholder="Course instructor name"
                                        value={formState.instructor}
                                        onChange={(e) => setFormState((s) => ({ ...s, instructor: e.target.value }))}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Description <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all resize-none"
                                        placeholder="Describe what students will learn in this course..."
                                        rows={4}
                                        value={formState.description}
                                        onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Price ($) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formState.price}
                                        onChange={(e) => setFormState((s) => ({ ...s, price: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
                                        type="number"
                                        min="0"
                                        value={formState.duration}
                                        onChange={(e) => setFormState((s) => ({ ...s, duration: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Category
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
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
                                        className="w-full rounded-lg border border-input bg-background text-foreground px-4 py-3 focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all"
                                        value={formState.difficultyLevel}
                                        onChange={(e) => setFormState((s) => ({ ...s, difficultyLevel: e.target.value }))}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-2">
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
                                        <span className="text-muted-foreground">
                                            {formState.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Thumbnail Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Course Thumbnail</h3>
                                    <p className="text-muted-foreground text-sm">Upload an image to represent your course</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Thumbnail Image
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        className="hidden"
                                        type="file"
                                        id="thumbnail"
                                        accept="image/*"
                                        onChange={(e) => setFormState((s) => ({ ...s, thumbnail: e.target.files?.[0] || null }))}
                                    />
                                    <label
                                        htmlFor="thumbnail"
                                        className="border border-input bg-background text-foreground px-4 py-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                                    >
                                        Choose File
                                    </label>
                                    <span className="text-muted-foreground">
                                        {formState.thumbnail ? formState.thumbnail.name : 'No file chosen'}
                                    </span>
                                    {formState.thumbnail && (
                                        <button
                                            type="button"
                                            onClick={() => setFormState((s) => ({ ...s, thumbnail: null }))}
                                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center gap-4 pt-6 border-t border-border">
                            <button
                                disabled={creating || updating}
                                className="flex items-center gap-2 bg-primary hover:opacity-90 disabled:opacity-60 text-primary-foreground px-6 py-3 rounded-lg transition-colors font-medium"
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
                                    className="px-6 py-3 rounded-lg border border-input text-foreground hover:bg-accent transition-colors"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Courses Grid */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Existing Courses</h3>

                    {isLoading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground mt-4">Loading courses...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-12">
                            <p className="text-destructive">Failed to load courses.</p>
                        </div>
                    )}

                    {!isLoading && Array.isArray(courses) && courses.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No courses found. Create your first course above!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {!isLoading && Array.isArray(courses) && courses.map((c: any) => (
                            <div
                                key={c?._id || c?.id}
                                className="rounded-lg border bg-card overflow-hidden group relative transition-all duration-300 hover:border-primary/70"
                            >
                                {/* Thumbnail with overlay and badge */}
                                <div className="relative h-52 bg-muted flex items-center justify-center overflow-hidden">
                                    {c?.thumbnail ? (
                                        <img
                                            src={c.thumbnail}
                                            alt={c?.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-4xl font-bold">
                                            {c?.title?.[0] || "C"}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {c?.category && (
                                            <span className="px-3 py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold shadow">
                                                {c.category}
                                            </span>
                                        )}
                                        {c?.difficultyLevel && (
                                            <span className="px-3 py-1 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-semibold shadow">
                                                {c.difficultyLevel}
                                            </span>
                                        )}
                                    </div>
                                    {c?.price !== undefined && (
                                        <span className="absolute bottom-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow">
                                            ${c.price}
                                        </span>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {c?.title}
                                            </h3>
                                            {c?.status && (
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${c.status === "published"
                                                    ? "bg-emerald-500/20 text-emerald-600"
                                                    : "bg-yellow-500/20 text-yellow-600"
                                                    }`}>
                                                    {c.status === "published" ? "Published" : "Draft"}
                                                </span>
                                            )}
                                        </div>
                                        {c?.instructor && (
                                            <p className="text-sm text-muted-foreground italic">
                                                by {c.instructor}
                                            </p>
                                        )}
                                        {c?.description && (
                                            <div>
                                                <ExpandableDescription description={c.description} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex w-full gap-2 pt-3">
                                        <button
                                            className="w-1/2  cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-l-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-medium shadow"
                                            onClick={(e) => { e.stopPropagation(); startEdit(c); }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            className="w-1/2 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-r-lg bg-destructive text-destructive-foreground transition-colors disabled:bg-muted font-medium shadow"
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
                                            <Trash2 className="w-4 h-4" />
                                            Delete
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