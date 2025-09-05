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
    baseUrl: "http://localhost:5000/api/v1",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {

      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `${token}`);
        
      } else {
        console.log('❌ No token found in Redux state');
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
      // Use Next.js router instead of window.location
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }
    if (result?.error?.status === 401) {
      console.log('🔄 401 Unauthorized - Attempting token refresh');
      
      try {
        const res = await fetch(
          "http://localhost:5000/api/v1/auth/refresh-token",
          {
            method: "POST",
            credentials: "include",
          }
        );
    
        const data = await res.json();
        console.log('🔄 Refresh token response:', data);
    
        if (data?.data?.accessToken) {
          // We also need to get the user state here without using a hook
          const user = (api.getState() as RootState).auth.user;
          console.log('✅ Token refreshed successfully');

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