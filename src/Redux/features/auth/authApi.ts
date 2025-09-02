import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo: any) => ({
                url: '/auth/login',
                method: 'POST',
                body: userInfo,
            }),
        }),
        // register
        register: builder.mutation({
            query: (userInfo: any) => ({
                url: '/users/create-user',
                method: 'POST',
                body: userInfo,
            }),
        }),
        getAllUser: builder.query<any, void>({
            query: () => ({
                url: `/users/all-user`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.data,
            providesTags: (result) => {
                const users = Array.isArray(result) ? result : [];
                return [
                    { type: 'users', id: 'LIST' },
                    ...users.map((u: any) => ({ type: 'users' as const, id: u?.id || u?._id })),
                ];
            },
        }),
        getSingleUser: builder.query<any, string>({
            query: (id: string) => ({
                url: `/users/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'users', id }],
        }),
        createUser: builder.mutation<any, { email: string; name: string; role: string; status: string; password: string; isDeleted?: boolean }>({
            query: (payload) => ({
                url: '/users/create-user',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: [{ type: 'users', id: 'LIST' }],
        }),
        updateUser: builder.mutation<any, { id: string; data: Partial<{ email: string; name: string; role: string; status: string; isDeleted: boolean }> }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'users', id },
                { type: 'users', id: 'LIST' },
            ],
        }),
        deleteUser: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'users', id },
                { type: 'users', id: 'LIST' },
            ],
        }),
        changeUserRole: builder.mutation<any, { id: string; role: string }>({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'users', id },
                { type: 'users', id: 'LIST' },
            ],
        }),
        changeUserStatus: builder.mutation<any, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/users/status/${id}`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'users', id },
                { type: 'users', id: 'LIST' },
            ],
        }),
       
    }),
})

export const { useLoginMutation, useGetSingleUserQuery, useRegisterMutation , useGetAllUserQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation, useChangeUserRoleMutation, useChangeUserStatusMutation } = authApi;