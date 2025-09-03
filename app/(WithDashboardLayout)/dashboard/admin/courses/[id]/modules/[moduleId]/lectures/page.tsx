"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Save,
    X,
    AlertCircle,
    Play,
    Clock,
    FileText,
    ArrowLeft,
    GripVertical,
    Video,
    BookOpen
} from "lucide-react";
import { toast } from "sonner";
import {
    useGetLecturesByModuleIdQuery,
    useCreateLectureMutation,
    useUpdateLectureMutation,
    useDeleteLectureMutation,
    useToggleLecturePublishMutation,
    useReorderLecturesMutation,
} from "@/src/Redux/features/course/lectureApi";
import { useGetModuleByIdQuery } from "@/src/Redux/features/course/moduleApi";
import { useGetCourseByIdQuery } from "@/src/Redux/features/course/courseApi";
import { ILecture, LectureFormData } from "@/src/types/lecture";
import Link from "next/link";

const LectureManagement = () => {
    const params = useParams();
    const router = useRouter();
    const courseId = (params?.id as string) || "";
    const moduleId = (params?.moduleId as string) || "";

    // State for form and UI
    const [isCreating, setIsCreating] = useState(false);
    const [editingLecture, setEditingLecture] = useState<ILecture | null>(null);
    const [formData, setFormData] = useState<LectureFormData>({
        title: "",
        description: "",
        content: "",
        pdfNotes: [],
        videoUrl: "",
        duration: 0,
        lectureNumber: 1,
        order: 1,
    });

    // API hooks
    const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(courseId);
    const { data: module, isLoading: moduleLoading } = useGetModuleByIdQuery(moduleId);
    const { data: lectures = [], isLoading: lecturesLoading, refetch } = useGetLecturesByModuleIdQuery(moduleId);
    const [createLecture, { isLoading: creating }] = useCreateLectureMutation();
    const [updateLecture, { isLoading: updating }] = useUpdateLectureMutation();
    const [deleteLecture, { isLoading: deleting }] = useDeleteLectureMutation();
    const [togglePublish, { isLoading: toggling }] = useToggleLecturePublishMutation();
    const [reorderLectures, { isLoading: reordering }] = useReorderLecturesMutation();

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration' || name === 'lectureNumber' ? parseInt(value) || 0 : value
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            content: "",
            pdfNotes: ["Sample PDF note"],
            videoUrl: "",
            duration: 0,
            lectureNumber: lectures.length + 1,
            order: lectures.length + 1,
        });
        setIsCreating(false);
        setEditingLecture(null);
    };

    // Create new lecture
    const handleCreateLecture = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error("Title is required");
            return;
        }
        
        if (!formData.pdfNotes || formData.pdfNotes.length === 0) {
            toast.error("At least one PDF note is required");
            return;
        }

        try {
            await createLecture({
                title: formData.title,
                description: formData.description,
                content: formData.content,
                pdfNotes: formData.pdfNotes,
                videoUrl: formData.videoUrl,
                duration: formData.duration,
                order: formData.order,
                moduleId,
                courseId,
                isPublished: false,
            }).unwrap();

            toast.success("Lecture created successfully!");
            resetForm();
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create lecture");
        }
    };

    // Update existing lecture
    const handleUpdateLecture = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLecture?._id || !formData.title.trim()) {
            toast.error("Title is required");
            return;
        }
        
        if (!formData.pdfNotes || formData.pdfNotes.length === 0) {
            toast.error("At least one PDF note is required");
            return;
        }

        try {
            await updateLecture({
                id: editingLecture._id,
                courseId,
                data: {
                    ...formData,
                },
            }).unwrap();

            toast.success("Lecture updated successfully!");
            resetForm();
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update lecture");
        }
    };

    // Delete lecture
    const handleDeleteLecture = async (lectureId: string) => {
        if (!confirm("Are you sure you want to delete this lecture? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteLecture({ id: lectureId, courseId }).unwrap();
            toast.success("Lecture deleted successfully!");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete lecture");
        }
    };

    // Toggle lecture publish status
    const handleTogglePublish = async (lecture: ILecture) => {
        try {
            await togglePublish({
                id: lecture._id!,
                courseId,
                isPublished: !lecture.isPublished,
            }).unwrap();

            toast.success(`Lecture ${!lecture.isPublished ? 'published' : 'unpublished'} successfully!`);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to toggle lecture status");
        }
    };

    // Start editing lecture
    const startEditing = (lecture: ILecture) => {
        setEditingLecture(lecture);
        setFormData({
            title: lecture.title,
            description: lecture.description || "",
            content: lecture.content || "",
            pdfNotes: lecture.pdfNotes || [],
            videoUrl: lecture.videoUrl || "",
            duration: lecture.duration || 0,
            lectureNumber: lecture.lectureNumber || 1,
            order: lecture.order || 1,
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

        const newOrder = [...lectures];
        const [draggedItem] = newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, draggedItem);

        try {
            await reorderLectures({
                moduleId,
                courseId,
                lectureIds: newOrder.map(l => l._id!),
            }).unwrap();

            toast.success("Lecture order updated successfully!");
            refetch();
        } catch (error: any) {
            toast.error("Failed to reorder lectures");
        }
    };

    if (courseLoading || moduleLoading || lecturesLoading) {
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

    if (!module) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Module not found</h2>
                <Link
                    href={`/dashboard/admin/courses/${courseId}`}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Back to Course Modules
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="border-b pb-4">
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href={`/dashboard/admin/courses/${courseId}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Modules
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Lecture Management</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="font-medium">{course?.title}</span>
                    <span>•</span>
                    <span className="font-medium">{module.title}</span>
                    <span>•</span>
                    <span>{lectures.length} lectures</span>
                    <span>•</span>
                    <span>{lectures.filter(l => l.isPublished).length} published</span>
                </div>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingLecture) && (
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                            {editingLecture ? 'Edit Lecture' : 'Create New Lecture'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={editingLecture ? handleUpdateLecture : handleCreateLecture} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lecture Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter lecture title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lecture Number
                                </label>
                                <input
                                    type="number"
                                    name="lectureNumber"
                                    value={formData.lectureNumber}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video URL (optional)
                                </label>
                                <input
                                    type="url"
                                    name="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com/video"
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
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter lecture description (optional)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                PDF Notes *
                            </label>
                            <textarea
                                name="pdfNotes"
                                value={formData.pdfNotes.join('\n')}
                                onChange={(e) => {
                                    const notes = e.target.value.split('\n').filter(note => note.trim());
                                    setFormData(prev => ({ ...prev, pdfNotes: notes }));
                                }}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter PDF notes (one per line)"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">Enter one note per line. At least one note is required.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter lecture content, notes, or instructions..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={creating || updating}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={16} />
                                {creating || updating ? 'Saving...' : (editingLecture ? 'Update Lecture' : 'Create Lecture')}
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
            {!isCreating && !editingLecture && (
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        Add New Lecture
                    </button>
                </div>
            )}

            {/* Lectures List */}
            <div className="space-y-4">
                {lectures.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Video className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No lectures yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating your first lecture for this module.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setIsCreating(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                Add Lecture
                            </button>
                        </div>
                    </div>
                ) : (
                    lectures.map((lecture, index) => (
                        <div
                            key={lecture._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-move"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Lecture Tags */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                Lecture {lecture.lectureNumber}
                                            </span>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${lecture.isPublished
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {lecture.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </div>

                                        {/* Lecture Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {lecture.title}
                                        </h3>

                                        {/* Lecture Description */}
                                        {lecture.description && (
                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                                {lecture.description}
                                            </p>
                                        )}

                                        {/* Lecture Content Preview */}
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                                {lecture.content}
                                            </p>
                                        </div>

                                        {/* Lecture Stats */}
                                        <div className="flex items-center gap-6 text-gray-500 text-sm">
                                            {lecture.duration > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    <span>{lecture.duration} min</span>
                                                </div>
                                            )}
                                            {lecture.videoUrl && (
                                                <div className="flex items-center gap-2">
                                                    <Play size={16} />
                                                    <span>Video available</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3 ml-6">
                                        <button
                                            onClick={() => handleTogglePublish(lecture)}
                                            disabled={toggling}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50"
                                            title={lecture.isPublished ? 'Unpublish lecture' : 'Publish lecture'}
                                        >
                                            {lecture.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                                            {lecture.isPublished ? 'Unpublish' : 'Publish'}
                                        </button>

                                        <button
                                            onClick={() => startEditing(lecture)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                            title="Edit lecture"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteLecture(lecture._id!)}
                                            disabled={deleting}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                                            title="Delete lecture"
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
                        <h4 className="font-medium mb-1">Lecture Management Tips</h4>
                        <ul className="space-y-1 text-blue-700">
                            <li>• Drag and drop lectures to reorder them within the module</li>
                            <li>• Unpublished lectures are only visible to instructors</li>
                            <li>• Lecture numbers are automatically assigned but can be customized</li>
                            <li>• Content field supports markdown and rich text formatting</li>
                            <li>• Video URLs can be added for external video content</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureManagement;
