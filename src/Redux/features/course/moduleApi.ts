import { baseApi } from "../../api/baseApi";
import { IModule, CreateModuleData, UpdateModuleData } from "../../../types/module";

export const moduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all modules
    getAllModules: builder.query<IModule[], void>({
      query: () => ({
        url: `/modules`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: [{ type: 'modules', id: 'LIST' }],
    }),

    // Get all modules for a course
    getModulesByCourseId: builder.query<IModule[], string>({
      query: (courseId) => ({
        url: `/modules/course/${courseId}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result, error, courseId) => [
        { type: 'modules', id: courseId },
        ...(result?.map((module) => ({ type: 'modules' as const, id: module._id })) ?? []),
      ],
    }),

    // Get single module by ID
    getModuleById: builder.query<IModule, string>({
      query: (id) => ({
        url: `/modules/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (_result, _error, id) => [{ type: 'modules', id }],
    }),

    // Create new module
    createModule: builder.mutation<IModule, CreateModuleData>({
      query: (moduleData) => ({
        url: '/modules',
        method: 'POST',
        body: moduleData,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: 'modules', id: courseId },
        { type: 'courses', id: courseId },
      ],
    }),

    // Update module
    updateModule: builder.mutation<IModule, { id: string; courseId: string; data: UpdateModuleData }>({
      query: ({ id, data }) => ({
        url: `/modules/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id, courseId }) => [
        { type: 'modules', id },
        { type: 'modules', id: courseId },
        { type: 'courses', id: courseId },
      ],
    }),

    // Delete module
    deleteModule: builder.mutation<any, { id: string; courseId: string }>({
      query: ({ id }) => ({
        url: `/modules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, courseId }) => [
        { type: 'modules', id },
        { type: 'modules', id: courseId },
        { type: 'courses', id: courseId },
      ],
    }),

    // Toggle module publish status
    toggleModulePublish: builder.mutation<IModule, { id: string; courseId: string; isPublished: boolean }>({
      query: ({ id, isPublished }) => ({
        url: `/modules/${id}/publish`,
        method: 'PATCH',
        body: { isPublished },
      }),
      invalidatesTags: (_result, _error, { id, courseId }) => [
        { type: 'modules', id },
        { type: 'modules', id: courseId },
        { type: 'courses', id: courseId },
      ],
    }),

    // Reorder modules
    reorderModules: builder.mutation<any, { courseId: string; moduleIds: string[] }>({
      query: ({ courseId, moduleIds }) => ({
        url: `/modules/reorder`,
        method: 'PATCH',
        body: { courseId, moduleIds },
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: 'modules', id: courseId },
        { type: 'courses', id: courseId },
      ],
    }),
  }),
});

export const {
  useGetAllModulesQuery,
  useGetModulesByCourseIdQuery,
  useGetModuleByIdQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useToggleModulePublishMutation,
  useReorderModulesMutation,
} = moduleApi;
