"use client";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
    Plus,
    Edit,
    Trash2,
    X,
    AlertCircle,
    Play,
    Clock,
    FileText,
    Save,
    BookOpen
} from "lucide-react";
import { toast } from "sonner";
import {
    useGetModulesByCourseIdQuery,
    useCreateModuleMutation,
    useUpdateModuleMutation,
    useDeleteModuleMutation,
} from "@/src/Redux/features/course/moduleApi";
import { useGetLecturesByCourseIdQuery } from "@/src/Redux/features/course/lectureApi";
import { IModule } from "@/src/types/module";
import { useGetCourseByIdQuery } from "@/src/Redux/features/course/courseApi";
import Link from "next/link";

const MySwal = withReactContent(Swal);

const CourseModuleLectureManagement = () => {
    const params = useParams();
    const courseId = (params?.id as string) || "";

    // State for form and UI
    const [isCreating, setIsCreating] = useState(false);
    const [editingModule, setEditingModule] = useState<IModule | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        moduleNumber: 1,
    });

    // API hooks
    const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(courseId);
    const { data: modules = [], isLoading: modulesLoading, refetch } = useGetModulesByCourseIdQuery(courseId);
    const { data: allLectures = [] } = useGetLecturesByCourseIdQuery(courseId);
    const [createModule, { isLoading: creating }] = useCreateModuleMutation();
    const [updateModule, { isLoading: updating }] = useUpdateModuleMutation();
    const [deleteModule, { isLoading: deleting }] = useDeleteModuleMutation();

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'moduleNumber' ? parseInt(value) || 1 : value
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            moduleNumber: modules.length + 1,
        });
        setIsCreating(false);
        setEditingModule(null);
    };

    // Create new module
    const handleCreateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title.trim()) {
            toast.error("Module title is required");
            return;
        }

        if (formData.moduleNumber < 1) {
            toast.error("Module number must be at least 1");
            return;
        }

        try {
            await createModule({
                ...formData,
                courseId,
                isPublished: false,
            }).unwrap();

            toast.success("Module created successfully!");
            resetForm();
            refetch();
        } catch (error: any) {
            console.error("Create module error:", error);
            toast.error(error?.data?.message || "Failed to create module. Please try again.");
        }
    };

    // Update existing module
    const handleUpdateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!editingModule?._id) {
            toast.error("Module ID is required for update");
            return;
        }

        if (!formData.title.trim()) {
            toast.error("Module title is required");
            return;
        }

        if (formData.moduleNumber < 1) {
            toast.error("Module number must be at least 1");
            return;
        }

        try {
            await updateModule({
                id: editingModule._id,
                courseId,
                data: {
                    ...formData,
                },
            }).unwrap();

            toast.success("Module updated successfully!");
            resetForm();
            refetch();
        } catch (error: any) {
            console.error("Update module error:", error);
            toast.error(error?.data?.message || "Failed to update module. Please try again.");
        }
    };

    // Delete module with SweetAlert2 confirmation


    const handleDeleteModule = async (moduleId: string) => {
        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                popup: "rounded-xl",
                title: "text-lg font-bold",
                confirmButton: "bg-blue-600 text-white px-4 py-2 rounded-md",
                cancelButton: "bg-red-600 text-white px-4 py-2 rounded-md"
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteModule({ id: moduleId, courseId }).unwrap();
                await MySwal.fire({
                    title: "Deleted!",
                    text: "Module has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: {
                        popup: "rounded-xl"
                    }
                });
                refetch();
            } catch (error: any) {
                console.error("Delete module error:", error);
                toast.error(error?.data?.message || "Failed to delete module. Please try again.");
            }
        }
    };


    // Start editing module
    const startEditing = (module: IModule) => {
        setEditingModule(module);
        setFormData({
            title: module.title,
            description: module.description || "",
            moduleNumber: module.moduleNumber,
        });
    };

    // Drag and drop functionality removed

    if (courseLoading || modulesLoading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-8"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300 mb-1">Course Modules</h2>
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
                        <span className="font-medium">{course?.title}</span>
                        <span>•</span>
                        <span>{modules.length} modules</span>
                        <span>•</span>
                        <span>{modules.filter(m => m.isPublished).length} published</span>
                    </div>
                </div>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingModule) && (
                <div className="rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-700 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                            {editingModule ? 'Edit Module' : 'Create New Module'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            aria-label="Close"
                            type="button"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    <form onSubmit={editingModule ? handleUpdateModule : handleCreateModule} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                    Module Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-200 dark:bg-slate-800 dark:text-slate-100"
                                    placeholder="Enter module title"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                    Module Number
                                </label>
                                <input
                                    type="number"
                                    name="moduleNumber"
                                    value={formData.moduleNumber}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-200 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-200 dark:bg-slate-800 dark:text-slate-100"
                                placeholder="Enter module description (optional)"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating || updating}
                                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-base font-semibold text-white hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 transition flex items-center gap-2"
                            >
                                <Save size={16} />
                                {creating || updating ? 'Saving...' : (editingModule ? 'Update Module' : 'Create Module')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Create Button */}
            {!isCreating && !editingModule && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-base font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 transition"
                        disabled={modulesLoading}
                    >
                        <Plus size={16} />
                        Add New Module
                    </button>
                </div>
            )}

            {/* Modules List */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                {modules.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                        <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">No modules yet</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Get started by creating your first course module.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                Add Module
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 p-4">
                        {modules.map((module, index) => (
                            <div
                                key={module._id}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-default hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Module Tags */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    Module {module.moduleNumber}
                                                </span>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${module.isPublished
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                    }`}>
                                                    {module.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </div>

                                            {/* Module Title */}
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                                                {module.title}
                                            </h3>

                                            {/* Module Description */}
                                            {module.description && (
                                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                                                    {module.description}
                                                </p>
                                            )}

                                            {/* Module Stats */}
                                            <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Play size={16} />
                                                    <span>{allLectures.filter(l => l.moduleId === module._id).length} lectures</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    <span>{allLectures.filter(l => l.moduleId === module._id).reduce((total, l) => total + (l.duration || 0), 0)} min</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-3 ml-6">
                                            <Link href={`/dashboard/admin/courses/${courseId}/modules/${module._id}/lectures`}>
                                                <button
                                                    className="inline-flex items-center gap-2 rounded-md border border-blue-500 px-3 py-2 text-blue-600 font-semibold bg-white hover:bg-blue-50 dark:bg-slate-900 dark:border-blue-700 dark:hover:bg-blue-900/20 transition text-sm whitespace-nowrap"
                                                    title="Create Lectures"
                                                >
                                                    <FileText size={16} />
                                                    Create Lectures
                                                </button>
                                            </Link>

                                            <button
                                                onClick={() => startEditing(module)}
                                                className="inline-flex items-center gap-2 rounded-md border border-slate-500 px-3 py-2 text-slate-600 font-semibold bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-900/20 transition text-sm whitespace-nowrap"
                                                title="Edit module"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeleteModule(module._id!)}
                                                disabled={deleting}
                                                className="inline-flex items-center gap-2 rounded-md border border-red-500 px-3 py-2 text-red-600 font-semibold bg-white hover:bg-red-50 dark:bg-slate-900 dark:border-red-700 dark:hover:bg-red-900/20 transition disabled:opacity-50 text-sm whitespace-nowrap"
                                                title="Delete module"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                        <h4 className="font-medium mb-1">Module Management Tips</h4>
                        <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                            <li>• Unpublished modules are only visible to instructors</li>
                            <li>• Module numbers are automatically assigned but can be customized</li>
                            <li>• Each module can contain multiple lectures - click "Create Lectures" to manage them</li>
                        </ul>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                .animate-fadeIn {
                    animation: fadeIn 0.25s cubic-bezier(.4,0,.2,1);
                }
            `}</style>
        </div>
    );
};

export default CourseModuleLectureManagement;


