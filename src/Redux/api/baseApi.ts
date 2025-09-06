import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { toast } from "sonner";
import { logout, setUser } from "../features/auth/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {

    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `${token}`);

    }
    return headers;
  },
});

// token expired hola new refresh token generate code
const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 404) {
    toast.error((result?.error?.data as any)?.message);
  }
  if (result?.error?.status === 403) {

    toast.error("Access denied. Please login again.");
    // Redirect to login or unauthorized page
    api.dispatch(logout());

    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized';
    }
  }
  if (result?.error?.status === 401) {

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data?.data?.accessToken) {
        const user = (api.getState() as RootState).auth.user;

        api.dispatch(
          setUser({
            user,
            token: data.data.accessToken,
          })
        );

        result = await baseQuery(args, api, extraOptions);
      } else {

        toast.error("Session expired. Please login again.");
        api.dispatch(logout());
        if (typeof window !== 'undefined') {
          window.location.href = '/unauthorized';
        }
      }
    } catch (refreshError) {

      toast.error("Session expired. Please login again.");
      api.dispatch(logout());
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["admins", "users", "courses", "modules", "lectures", "enrollments"],
  endpoints: () => ({}),
});