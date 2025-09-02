import { baseApi } from "../../api/baseApi";

type Course = {
    _id: string;
    title: string;
    description?: string;
    price?: number;
    status?: string; // e.g., 'published' | 'draft'
    thumbnail?: string;
    [key: string]: any;
};

export const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Public
        getAllCourses: builder.query<Course[], void>({
            query: () => ({
                url: `/courses`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response?.data ?? response,
            providesTags: (result) => {
                const courses = Array.isArray(result) ? result : [];
                return [
                    { type: 'courses', id: 'LIST' },
                    ...courses.map((c: any) => ({ type: 'courses' as const, id: c?._id || c?.id })),
                ];
            },
        }),
        getPublishedCourses: builder.query<Course[], void>({
            query: () => ({
                url: `/courses/published`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response?.data ?? response,
            providesTags: [{ type: 'courses', id: 'PUBLISHED' }],
        }),
        getCourseById: builder.query<Course, string>({
            query: (id) => ({
                url: `/courses/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response?.data ?? response,
            providesTags: (_result, _error, id) => [{ type: 'courses', id }],
        }),

        // Admin
        createCourse: builder.mutation<any, FormData | Record<string, any>>({
            query: (payload) => {
                const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
                const body = isFormData ? payload : (() => {
                    const fd = new FormData();
                    Object.entries(payload as Record<string, any>).forEach(([k, v]) => {
                        if (v !== undefined && v !== null) {
                            fd.append(k, v as any);
                        }
                    });
                    return fd;
                })();
                return {
                    url: '/courses/create-course',
                    method: 'POST',
                    body,
                } as const;
            },
            invalidatesTags: [{ type: 'courses', id: 'LIST' }, { type: 'courses', id: 'PUBLISHED' }],
        }),
        updateCourse: builder.mutation<any, { id: string; data: FormData | Record<string, any> }>({
            query: ({ id, data }) => {
                const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
                const body = isFormData ? data : (() => {
                    const fd = new FormData();
                    Object.entries(data as Record<string, any>).forEach(([k, v]) => {
                        if (v !== undefined && v !== null) {
                            fd.append(k, v as any);
                        }
                    });
                    return fd;
                })();
                return {
                    url: `/courses/${id}`,
                    method: 'PUT',
                    body,
                } as const;
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'courses', id },
                { type: 'courses', id: 'LIST' },
                { type: 'courses', id: 'PUBLISHED' },
            ],
        }),
        deleteCourse: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/courses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'courses', id },
                { type: 'courses', id: 'LIST' },
                { type: 'courses', id: 'PUBLISHED' },
            ],
        }),
    }),
});

export const {
    useGetAllCoursesQuery,
    useGetPublishedCoursesQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} = courseApi;