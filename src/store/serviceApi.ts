import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FormValuesService } from "../types/Service";

export const serviceApi = createApi({
  reducerPath: "sericeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    createService: builder.mutation<{
      message: string;
      data: FormValuesService;
    },FormValuesService>({
      query: (body) => ({
        url: "/service",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const { useCreateServiceMutation } = serviceApi;
