import { baseApi } from "../../api/baseApi";

type CreateEnrollmentRequestPayload = {
  courseId: string;
};

type EnrollmentRequest = {
  _id: string;
  userId: string;
  courseId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type UpdateEnrollmentRequestPayload = {
  _id: string;
  status: string;
};

type DeleteEnrollmentRequestPayload = {
  _id: string;
};

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnrollmentRequest: builder.mutation<
      EnrollmentRequest,
      CreateEnrollmentRequestPayload>({
        query: (body) => ({
          url: "/enrollment",
          method: "POST",
          body,
        }),
        invalidatesTags: [
          { type: 'enrollments', id: 'LIST' },
          { type: 'courses', id: 'LIST' }
        ],
      }),
    getAllEnrollmentRequests: builder.query<EnrollmentRequest[], void>({
      query: () => ({
        url: "/enrollment",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: [{ type: 'enrollments', id: 'LIST' }],
    }),
    getMyEnrollmentRequests: builder.query<EnrollmentRequest[], void>({
      query: () => ({
        url: "/enrollment/my-requests",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: [{ type: 'enrollments', id: 'LIST' }],
    }),
    updateEnrollmentRequest: builder.mutation<EnrollmentRequest, UpdateEnrollmentRequestPayload>({
      query: ({ _id, status }) => ({
        url: `/enrollment/${_id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: 'enrollments', id: _id },
        { type: 'enrollments', id: 'LIST' },
        { type: 'courses', id: 'LIST' }
      ],
    }),
    deleteEnrollmentRequest: builder.mutation<EnrollmentRequest, DeleteEnrollmentRequestPayload>({
      query: ({ _id }) => ({
        url: `/enrollment/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: 'enrollments', id: _id },
        { type: 'enrollments', id: 'LIST' },
        { type: 'courses', id: 'LIST' }
      ],
    }),
  }),
});

export const { useCreateEnrollmentRequestMutation, useGetAllEnrollmentRequestsQuery, useGetMyEnrollmentRequestsQuery, useUpdateEnrollmentRequestMutation, useDeleteEnrollmentRequestMutation } = enrollmentApi;


