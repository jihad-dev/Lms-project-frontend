'use client'

import React from "react";
import {
    useCreateUserMutation,
    useDeleteUserMutation,
    useGetAllUserQuery,
    useChangeUserStatusMutation,
    useUpdateUserMutation,
} from "@/src/Redux/features/auth/authApi";
import { toast } from "sonner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type UserRecord = {
    id?: string;
    _id?: string;
    email: string;
    name: string;
    role: string;
    status: string;
    password?: string; // only for create
    isDeleted: boolean;
};

const defaultFormValues: UserRecord = {
    email: "",
    name: "",
    role: "admin",
    status: "in-progress",
    password: "",
    isDeleted: false,
};

const statusColor = (status: string) => {
    switch (status) {
        case "in-progress":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        case "blocked":
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200";
    }
};

const roleColor = (role: string) => {
    switch (role) {
        case "admin":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        case "instructor":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        case "student":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-200";
    }
};

const Users = () => {
    const { data, isLoading, isFetching } = useGetAllUserQuery(undefined);
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [changeUserStatus] = useChangeUserStatusMutation();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [formValues, setFormValues] = React.useState<UserRecord>(defaultFormValues);
    const [originalStatus, setOriginalStatus] = React.useState<string | null>(null);

    const users: UserRecord[] = Array.isArray(data) ? data : [];

    const openCreate = () => {
        setEditingId(null);
        setFormValues(defaultFormValues);
        setIsModalOpen(true);
    };

    const openEdit = async (record: UserRecord) => {
        const id = (record.id || record._id) as string | undefined;
        const currentStatus = record.status ?? "in-progress";

        setEditingId(id || null);
        setOriginalStatus(currentStatus);
        setFormValues({
            email: record.email ?? "",
            name: record.name ?? "",
            role: record.role ?? "admin",
            status: currentStatus,
            isDeleted: Boolean(record.isDeleted),
            id: record.id,
            _id: record._id,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormValues(defaultFormValues);
        setOriginalStatus(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as any;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? Boolean(checked) : value,
        }));
    };

    const validate = (values: UserRecord) => {
        if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) return "Valid email is required";
        if (!values.name) return "Name is required";
        if (!values.role) return "Role is required";
        if (!values.status) return "Status is required";
        if (!editingId && !values.password) return "Password is required";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validate(formValues);
        if (error) {
            toast.error(error);
            return;
        }

        try {
            if (editingId) {
                const updateData = {
                    email: formValues.email,
                    name: formValues.name,
                    role: formValues.role,
                    isDeleted: formValues.isDeleted,
                };

                await updateUser({
                    id: editingId,
                    data: updateData
                }).unwrap();

                if (originalStatus !== null && originalStatus !== formValues.status) {
                    await changeUserStatus({ id: editingId, status: formValues.status }).unwrap();
                }
                toast.success("User updated");
            } else {
                await createUser({
                    email: formValues.email,
                    name: formValues.name,
                    role: formValues.role,
                    password: formValues.password as string,
                    status: formValues.status,
                    isDeleted: formValues.isDeleted,
                }).unwrap();

                toast.success("User created");
            }
            closeModal();
        } catch (err: any) {
            toast.error(err?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        MySwal.fire({
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser({ id }).unwrap();
                    MySwal.fire({
                        title: "Deleted!",
                        text: "User has been deleted.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        customClass: {
                            popup: "rounded-xl"
                        }
                    });
                } catch (err: any) {
                    toast.error(err?.data?.message || "Delete failed");
                }
            }
        });
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300 mb-1">Manage Users</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Create, edit, and manage all users in the system.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-base font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 transition"
                    disabled={isLoading || isFetching}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    New User
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ">
                <table className="min-w-full text-xs md:text-sm">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
                        <tr className="text-left">
                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 text-base">Email</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 text-base hidden md:table-cell">Name</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 text-base">Role</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 text-base hidden sm:table-cell">Status</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 text-base hidden lg:table-cell">Deleted?</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200 text-base">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading || isFetching ? (
                            <tr>
                                <td className="px-4 py-8 text-center text-lg text-slate-400" colSpan={6}>Loading...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td className="px-4 py-8 text-center text-lg text-slate-400" colSpan={6}>No users found</td>
                            </tr>
                        ) : (
                            users.map((u) => {
                                const id = (u.id || u._id) as string;
                                return (
                                    <tr key={id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-slate-900/40 transition">
                                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 break-all">{u.email}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200 hidden md:table-cell">{u.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleColor(u.role)}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(u.status)}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${u.isDeleted ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}`}>
                                                {u.isDeleted ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button
                                                className="inline-flex items-center gap-1 rounded-md border border-blue-500 px-2.5 py-1.5 text-blue-600 font-semibold bg-white hover:bg-blue-50 dark:bg-slate-900 dark:border-blue-700 dark:hover:bg-blue-900/20 transition"
                                                onClick={() => openEdit(u)}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                className="inline-flex items-center gap-1 rounded-md border border-red-500 px-2.5 py-1.5 text-red-600 font-semibold bg-white hover:bg-red-50 dark:bg-slate-900 dark:border-red-700 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                                                onClick={() => handleDelete(id)}
                                                disabled={isDeleting}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-700 animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                {editingId ? "Edit User" : "Create User"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                aria-label="Close"
                                type="button"
                            >
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-200 dark:bg-slate-800 dark:text-slate-100"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-200 dark:bg-slate-800 dark:text-slate-100"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formValues.role}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-base outline-none dark:bg-slate-800 dark:text-slate-100"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="instructor">Instructor</option>
                                        <option value="student">Student</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formValues.status}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-base outline-none dark:bg-slate-800 dark:text-slate-100"
                                    >
                                        <option value="in-progress">In Progress</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </div>
                            </div>
                            {!editingId && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formValues.password ?? ""}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-200 dark:bg-slate-800 dark:text-slate-100"
                                        required
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <input
                                    id="isDeleted"
                                    type="checkbox"
                                    name="isDeleted"
                                    checked={formValues.isDeleted}
                                    onChange={handleChange}
                                    className="h-4 w-4 accent-red-600"
                                />
                                <label htmlFor="isDeleted" className="text-sm font-medium text-slate-700 dark:text-slate-200">Deleted</label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-base font-semibold text-white hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 transition"
                                    disabled={isCreating || isUpdating}
                                >
                                    {editingId ? (isUpdating ? "Saving..." : "Save") : (isCreating ? "Creating..." : "Create")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
    )
}
export default Users;