import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FormValuesVacancy } from "../types/Vacancy";

export const vacancyApi = createApi({
  reducerPath: "vacancyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  }),
  tagTypes: ["Vacancy"],
  endpoints: (builder) => ({
    createVacancy: builder.mutation<
      {
        message: string;
        data: FormValuesVacancy;
      },
      FormValuesVacancy
    >({
      query: (body) => ({
        url: "/vacancy",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Vacancy"],
    }),
  }),
});

export const { useCreateVacancyMutation } = vacancyApi;
