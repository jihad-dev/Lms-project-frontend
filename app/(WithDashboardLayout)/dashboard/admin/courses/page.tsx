"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteCourseMutation, useGetAllCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation } from "@/src/Redux/features/course/courseApi";
import { BookOpen, Upload, Plus, Edit2, Trash2, Eye, X } from "lucide-react";

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
            status: formState.published ? "published" : "draft", // Convert boolean to string status
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
                   
                    const res = await createCourse(fd).unwrap();
                
                } else {
                    
                    const res = await createCourse(courseData).unwrap();
                 
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

    const remove = async (id: string) => {
        try {
            await deleteCourse({ id }).unwrap();
            if (formState.id === id) setFormState({
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
        } catch { }
    };

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
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Courses Management</h1>
                        <p className="text-gray-400 mt-2">Manage and create courses for your learning platform</p>
                    </div>
                    <button
                        onClick={resetForm}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Course
                    </button>
                </div>

                {/* Form Section */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-semibold text-white mb-6">Create New Course</h2>
                    <p className="text-gray-400 mb-8">Add a new course to your learning platform.</p>

                    <form onSubmit={onSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                                    <p className="text-gray-400 text-sm">Essential details about your course</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Course Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter course title"
                                        value={formState.title}
                                        onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Instructor
                                    </label>
                                    <input
                                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Course instructor name"
                                        value={formState.instructor}
                                        onChange={(e) => setFormState((s) => ({ ...s, instructor: e.target.value }))}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Description <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Describe what students will learn in this course..."
                                        rows={4}
                                        value={formState.description}
                                        onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Price ($) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formState.price}
                                        onChange={(e) => setFormState((s) => ({ ...s, price: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        type="number"
                                        min="0"
                                        value={formState.duration}
                                        onChange={(e) => setFormState((s) => ({ ...s, duration: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Category
                                    </label>
                                    <input
                                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="e.g., Programming, Design"
                                        value={formState.category}
                                        onChange={(e) => setFormState((s) => ({ ...s, category: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Difficulty Level
                                    </label>
                                    <select
                                        className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={formState.difficultyLevel}
                                        onChange={(e) => setFormState((s) => ({ ...s, difficultyLevel: e.target.value }))}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Publish Status
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormState((s) => ({ ...s, published: !s.published }))}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formState.published ? 'bg-indigo-600' : 'bg-gray-600'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formState.published ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-gray-300">
                                            {formState.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Thumbnail Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <Upload className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Course Thumbnail</h3>
                                    <p className="text-gray-400 text-sm">Upload an image to represent your course</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
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
                                        className="bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                                    >
                                        Choose File
                                    </label>
                                    <span className="text-gray-400">
                                        {formState.thumbnail ? formState.thumbnail.name : 'No file chosen'}
                                    </span>
                                    {formState.thumbnail && (
                                        <button
                                            type="button"
                                            onClick={() => setFormState((s) => ({ ...s, thumbnail: null }))}
                                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
                            <button
                                disabled={creating || updating}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
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
                                    className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
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
                    <h3 className="text-xl font-semibold text-white">Existing Courses</h3>

                    {isLoading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="text-gray-400 mt-4">Loading courses...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-12">
                            <p className="text-red-400">Failed to load courses.</p>
                        </div>
                    )}

                    {!isLoading && Array.isArray(courses) && courses.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No courses found. Create your first course above!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {!isLoading && Array.isArray(courses) && courses.map((c: any) => (
                            <div
                                key={c?._id || c?.id}
                                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-500/50 group"
                            >
                                {c?.thumbnail && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={c.thumbnail}
                                            alt={c?.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                )}

                                <div className="p-5 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                                                {c?.title}
                                            </h3>
                                            {c?.price !== undefined && (
                                                <span className="text-lg font-bold text-indigo-400 shrink-0">
                                                    ${c.price}
                                                </span>
                                            )}
                                        </div>

                                        {c?.instructor && (
                                            <p className="text-sm text-gray-400">
                                                by {c.instructor}
                                            </p>
                                        )}

                                        {c?.description && (
                                            <p className="text-sm text-gray-300 line-clamp-2">
                                                {c.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            {c?.category && (
                                                <span className="px-2 py-1 bg-gray-700 rounded-full">
                                                    {c.category}
                                                </span>
                                            )}
                                            {c?.difficultyLevel && (
                                                <span className="px-2 py-1 bg-gray-700 rounded-full">
                                                    {c.difficultyLevel}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <button
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-indigo-500 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); startEdit(c); }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>

                                        <button
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                                            onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/admin/courses/${c?._id || c?.id}`); }}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>

                                        <button
                                            className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:bg-gray-600"
                                            disabled={deleting}
                                            onClick={(e) => { e.stopPropagation(); remove(c?._id || c?.id); }}
                                        >
                                            <Trash2 className="w-4 h-4" />
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