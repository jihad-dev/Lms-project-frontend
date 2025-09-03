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
                
             
                const updateResult = await updateUser({
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
        try {
            await deleteUser({ id }).unwrap();
            toast.success("User deleted");
        } catch (err: any) {
            toast.error(err?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Manage Users</h2>
                <button
                    onClick={openCreate}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={isLoading || isFetching}
                >
                    New User
                </button>
            </div>

            <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-700">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr className="text-left">
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">isDeleted</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading || isFetching ? (
                            <tr>
                                <td className="px-4 py-6" colSpan={6}>Loading...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td className="px-4 py-6" colSpan={6}>No users found</td>
                            </tr>
                        ) : (
                            users.map((u) => {
                                const id = (u.id || u._id) as string;
                                return (
                                    <tr key={id} className="border-t border-slate-100 dark:border-slate-800">
                                        <td className="px-4 py-2">{u.email}</td>
                                        <td className="px-4 py-2">{u.name}</td>
                                        <td className="px-4 py-2 capitalize">{u.role}</td>
                                        <td className="px-4 py-2">{u.status}</td>
                                        <td className="px-4 py-2">{u.isDeleted ? "true" : "false"}</td>
                                        <td className="px-4 py-2 text-right space-x-2">
                                            <button
                                                className="rounded-md border px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                onClick={() => openEdit(u)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="rounded-md border px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                                                onClick={() => handleDelete(id)}
                                                disabled={isDeleting}
                                            >
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg dark:bg-slate-900">
                        <h3 className="mb-3 text-lg font-semibold">
                            {editingId ? "Edit User" : "Create User"}
                        </h3>
                        <form className="space-y-3" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formValues.role}
                                        onChange={handleChange}
                                        className="w-full rounded-md border px-3 py-2 text-sm outline-none dark:bg-slate-800 dark:border-slate-700"
                                    >
                                        <option value="admin">admin</option>
                                        <option value="instructor">instructor</option>
                                        <option value="student">student</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formValues.status}
                                        onChange={handleChange}
                                        className="w-full rounded-md border px-3 py-2 text-sm outline-none dark:bg-slate-800 dark:border-slate-700"
                                    >
                                        <option value="in-progress">in-progress</option>
                                        <option value="blocked">blocked</option>

                                    </select>
                                </div>
                            </div>
                            {!editingId && (
                                <div>
                                    <label className="block text-sm mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formValues.password ?? ""}
                                        onChange={handleChange}
                                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:bg-slate-800 dark:border-slate-700"
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
                                    className="h-4 w-4"
                                />
                                <label htmlFor="isDeleted" className="text-sm">isDeleted</label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                    disabled={isCreating || isUpdating}
                                >
                                    {editingId ? (isUpdating ? "Saving..." : "Save") : (isCreating ? "Creating..." : "Create")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Users;