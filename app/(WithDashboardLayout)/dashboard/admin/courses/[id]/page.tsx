"use client";

import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    GripVertical,
    BookOpen,
    Save,
    X,
    AlertCircle,
    Play,
    Clock,
    FileText
} from "lucide-react";
import { toast } from "sonner";
import {
    useGetModulesByCourseIdQuery,
    useCreateModuleMutation,
    useUpdateModuleMutation,
    useDeleteModuleMutation,
    useToggleModulePublishMutation,
    useReorderModulesMutation,
} from "@/src/Redux/features/course/moduleApi";
import { useGetLecturesByCourseIdQuery } from "@/src/Redux/features/course/lectureApi";
import { IModule } from "@/src/types/module";
import { useGetCourseByIdQuery } from "@/src/Redux/features/course/courseApi";
import Link from "next/link";

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
    const [togglePublish, { isLoading: toggling }] = useToggleModulePublishMutation();
    const [reorderModules, { isLoading: reordering }] = useReorderModulesMutation();

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
        if (!formData.title.trim()) {
            toast.error("Module title is required");
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
            toast.error(error?.data?.message || "Failed to create module");
        }
    };

    // Update existing module
    const handleUpdateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingModule?._id || !formData.title.trim()) {
            toast.error("Module title is required");
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
            toast.error(error?.data?.message || "Failed to update module");
        }
    };

    // Delete module
    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteModule({ id: moduleId, courseId }).unwrap();
            toast.success("Module deleted successfully!");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete module");
        }
    };

    // Toggle module publish status
    const handleTogglePublish = async (module: IModule) => {
        try {
            await togglePublish({
                id: module._id!,
                courseId,
                isPublished: !module.isPublished,
            }).unwrap();

            toast.success(`Module ${!module.isPublished ? 'published' : 'unpublished'} successfully!`);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to toggle module status");
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

    // Handle drag and drop reordering
    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

        if (dragIndex === dropIndex) return;

        const newOrder = [...modules];
        const [draggedItem] = newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, draggedItem);

        try {
            await reorderModules({
                courseId,
                moduleIds: newOrder.map(m => m._id!),
            }).unwrap();

            toast.success("Module order updated successfully!");
            refetch();
        } catch (error: any) {
            toast.error("Failed to reorder modules");
        }
    };

    if (courseLoading || modulesLoading) {
        return (
            <div className="p-4 space-y-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Course Modules</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="font-medium">{course?.title}</span>
                    <span>•</span>
                    <span>{modules.length} modules</span>
                    <span>•</span>
                    <span>{modules.filter(m => m.isPublished).length} published</span>
                </div>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingModule) && (
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            {editingModule ? 'Edit Module' : 'Create New Module'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={editingModule ? handleUpdateModule : handleCreateModule} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Module Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter module title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Module Number
                                </label>
                                <input
                                    type="number"
                                    name="moduleNumber"
                                    value={formData.moduleNumber}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter module description (optional)"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={creating || updating}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={16} />
                                {creating || updating ? 'Saving...' : (editingModule ? 'Update Module' : 'Create Module')}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Create Button */}
            {!isCreating && !editingModule && (
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        Add New Module
                    </button>
                </div>
            )}

            {/* Modules List */}
            <div className="space-y-4">
                {modules.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No modules yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating your first course module.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                Add Module
                            </button>
                        </div>
                    </div>
                ) : (
                    modules.map((module, index) => (
                        <div
                            key={module._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-move"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Module Tags */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">
                                                Module {module.moduleNumber}
                                            </span>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${module.isPublished
                                                ? 'bg-green-600 text-white'
                                                : 'bg-orange-500 text-white'
                                                }`}>
                                                {module.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </div>

                                        {/* Module Title */}
                                        <h3 className="text-xl font-bold text-white mb-3">
                                            {module.title}
                                        </h3>

                                        {/* Module Description */}
                                        {module.description && (
                                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                                {module.description}
                                            </p>
                                        )}

                                        {/* Module Stats */}
                                        <div className="flex items-center gap-6 text-gray-400 text-sm">
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
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                                title="Create Lectures"
                                            >
                                                <FileText size={16} />
                                                Create Lectures
                                            </button>

                                        </Link>

                                        <button
                                            onClick={() => startEditing(module)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                                            title="Edit module"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteModule(module._id!)}
                                            disabled={deleting}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                                            title="Delete module"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <h4 className="font-medium mb-1">Module Management Tips</h4>
                        <ul className="space-y-1 text-blue-700">
                            <li>• Drag and drop modules to reorder them</li>
                            <li>• Unpublished modules are only visible to instructors</li>
                            <li>• Module numbers are automatically assigned but can be customized</li>
                            <li>• Each module can contain multiple lectures - click "Create Lectures" to manage them</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseModuleLectureManagement;


