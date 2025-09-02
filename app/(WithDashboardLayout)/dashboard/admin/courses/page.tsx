"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteCourseMutation, useGetAllCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation } from "@/src/Redux/features/course/courseApi";

const Course = () => {
    const { data: courses, isLoading, isError, refetch } = useGetAllCoursesQuery();
    const router = useRouter();
    const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
    const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();
    const [deleteCourse, { isLoading: deleting }] = useDeleteCourseMutation();

    const [formState, setFormState] = useState<{ id?: string; title: string; description: string; price: string; thumbnail?: File | null }>({
        title: "",
        description: "",
        price: "",
        thumbnail: null,
    });

    const isEditing = useMemo(() => Boolean(formState.id), [formState.id]);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("title", formState.title);
        if (formState.description) fd.append("description", formState.description);
        if (formState.price) fd.append("price", String(Number(formState.price)));
        if (formState.thumbnail) fd.append("thumbnail", formState.thumbnail);
        try {
            if (isEditing && formState.id) {
                await updateCourse({ id: formState.id, data: fd }).unwrap();
            } else {
                const res = await createCourse(fd).unwrap();
                console.log(res, 'ressssss')
            }
            setFormState({ title: "", description: "", price: "", thumbnail: null });
            refetch();
        } catch (err: any) {
            console.error(err.message)
        }
    };

    const startEdit = (c: any) => {
        setFormState({
            id: c?._id || c?.id,
            title: c?.title || "",
            description: c?.description || "",
            price: String(c?.price ?? ""),
            thumbnail: null,
        });
    };

    const remove = async (id: string) => {
        try {
            await deleteCourse({ id }).unwrap();
            if (formState.id === id) setFormState({ title: "", description: "", price: "", thumbnail: null });
        } catch { }
    };

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-xl font-semibold">Courses</h2>

            <form onSubmit={onSubmit} className="grid gap-3 max-w-xl">
                <input
                    className="border px-3 py-2 rounded"
                    placeholder="Title"
                    value={formState.title}
                    onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))}
                    required
                />
                <textarea
                    className="border px-3 py-2 rounded"
                    placeholder="Description"
                    value={formState.description}
                    onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                />
                <input
                    className="border px-3 py-2 rounded"
                    placeholder="Price"
                    type="number"
                    value={formState.price}
                    onChange={(e) => setFormState((s) => ({ ...s, price: e.target.value }))}
                />
                <input
                    className="border px-3 py-2 rounded"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormState((s) => ({ ...s, thumbnail: e.target.files?.[0] || null }))}
                />
                <div className="flex items-center gap-2">
                    <button disabled={creating || updating} className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
                        {isEditing ? (updating ? "Updating..." : "Update Course") : (creating ? "Creating..." : "Create Course")}
                    </button>
                    {isEditing && (
                        <button type="button" className="px-3 py-2 rounded border" onClick={() => setFormState({ title: "", description: "", price: "", thumbnail: null })}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading && <div>Loading...</div>}
                {isError && <div>Failed to load.</div>}
                {!isLoading && Array.isArray(courses) && courses.length === 0 && <div>No courses found.</div>}
                {!isLoading && Array.isArray(courses) && courses.map((c: any) => (
                    <div
                        key={c?._id || c?.id}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col cursor-pointer"
                        onClick={() => router.push(`/dashboard/admin/courses/${c?._id || c?.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") router.push(`/dashboard/admin/courses/${c?._id || c?.id}`);
                        }}
                    >
                        {c?.thumbnail && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.thumbnail} alt={c?.title} className="w-full h-40 object-cover" />
                        )}
                        <div className="p-4 flex flex-col gap-2 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-base line-clamp-2">{c?.title}</h3>
                                {c?.price !== undefined && (
                                    <span className="text-sm font-medium text-blue-600 shrink-0">${c.price}</span>
                                )}
                            </div>
                            {c?.description && (
                                <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
                            )}
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <button className="px-3 py-1.5 rounded border text-sm" onClick={(e) => { e.stopPropagation(); startEdit(c); }}>Edit</button>
                                <button className="px-3 py-1.5 rounded bg-red-600 text-white text-sm" disabled={deleting} onClick={(e) => { e.stopPropagation(); remove(c?._id || c?.id); }}>
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Course;