import { baseApi } from "../../api/baseApi";
import { ILecture, CreateLectureData, UpdateLectureData } from "@/src/types/lecture";

export const lectureApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all lectures for a module
    getLecturesByModuleId: builder.query<ILecture[], string>({
      query: (moduleId) => ({
        url: `/lectures/module/${moduleId}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result) => {
        const lectures = Array.isArray(result) ? result : [];
        return [
          { type: 'lectures', id: 'LIST' },
          ...lectures.map((l: any) => ({ type: 'lectures' as const, id: l?._id || l?.id })),
        ];
      },
    }),

    // Get all lectures for a course
    getLecturesByCourseId: builder.query<ILecture[], string>({
      query: (courseId) => ({
        url: `/lectures/course/${courseId}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result) => {
        const lectures = Array.isArray(result) ? result : [];
        return [
          { type: 'lectures', id: 'COURSE_LIST' },
          ...lectures.map((l: any) => ({ type: 'lectures' as const, id: l?._id || l?.id })),
        ];
      },
    }),

    // Get single lecture by ID
    getLectureById: builder.query<ILecture, string>({
      query: (id) => ({
        url: `/lectures/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (_result, _error, id) => [{ type: 'lectures', id }],
    }),

    // Create new lecture
    createLecture: builder.mutation<ILecture, CreateLectureData>({
      query: (data) => ({
        url: '/lectures',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'lectures', id: 'LIST' }, { type: 'lectures', id: 'COURSE_LIST' }],
    }),

    // Update existing lecture
    updateLecture: builder.mutation<ILecture, { id: string; courseId: string; data: UpdateLectureData }>({
      query: ({ id, data }) => ({
        url: `/lectures/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'lectures', id },
        { type: 'lectures', id: 'LIST' },
        { type: 'lectures', id: 'COURSE_LIST' },
      ],
    }),

    // Delete lecture
    deleteLecture: builder.mutation<void, { id: string; courseId: string }>({
      query: ({ id }) => ({
        url: `/lectures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'lectures', id: 'LIST' }, { type: 'lectures', id: 'COURSE_LIST' }],
    }),

    // Toggle lecture publish status
    toggleLecturePublish: builder.mutation<ILecture, { id: string; courseId: string; isPublished: boolean }>({
      query: ({ id, isPublished }) => ({
        url: `/lectures/${id}/publish`,
        method: 'PATCH',
        body: { isPublished },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'lectures', id },
        { type: 'lectures', id: 'LIST' },
        { type: 'lectures', id: 'COURSE_LIST' },
      ],
    }),

    // Reorder lectures within a module
    reorderLectures: builder.mutation<void, { moduleId: string; courseId: string; lectureIds: string[] }>({
      query: ({ moduleId, lectureIds }) => ({
        url: `/lectures/reorder`,
        method: 'PATCH',
        body: { moduleId, lectureIds },
      }),
      invalidatesTags: [{ type: 'lectures', id: 'LIST' }, { type: 'lectures', id: 'COURSE_LIST' }],
    }),

    // Get all lectures (for admin dashboard)
    getAllLectures: builder.query<ILecture[], void>({
      query: () => ({
        url: '/lectures',
        method: 'GET',
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: [{ type: 'lectures', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetLecturesByModuleIdQuery,
  useGetLecturesByCourseIdQuery,
  useGetLectureByIdQuery,
  useGetAllLecturesQuery,
  useCreateLectureMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
  useToggleLecturePublishMutation,
  useReorderLecturesMutation,
} = lectureApi;
