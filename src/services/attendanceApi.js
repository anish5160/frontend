import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { unsetUserToken } from "../features/authSlice";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/user/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access_token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Attendance"],

  endpoints: (builder) => ({
    getAttendance: builder.query({
      query: ({ subject } = {}) => {
        const params = new URLSearchParams();
        if (subject) params.append("subject", subject);
        const queryString = params.toString();
        return `attendance${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.attendance_percentage_per_subject
          ? Object.keys(result.attendance_percentage_per_subject).map((subject) => ({
              type: "Attendance",
              id: subject,
            }))
          : [],
      transformResponse: (response) => ({
        attendance_calendar: response.attendance_calendar || {},
        attendance_percentage_per_subject: response.attendance_percentage_per_subject || {},
      }),
    }),

    markAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: "attendance/",
        method: "POST",
        body: attendanceData,
      }),
      invalidatesTags: ["Attendance"],
    }),

    deleteAttendance: builder.mutation({
      query: (subject) => ({
        url: `attendance/${encodeURIComponent(subject)}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
      async onQueryStarted(subject, { dispatch, queryFulfilled }) {
        if (!subject) {
          console.error("Delete operation aborted: No subject provided");
          return;
        }

        const patchResult = dispatch(
          attendanceApi.util.updateQueryData("getAttendance", undefined, (draft) => {
            if (draft.attendance_percentage_per_subject) {
              delete draft.attendance_percentage_per_subject[subject];
            }
            if (draft.attendance_calendar) {
              for (const date in draft.attendance_calendar) {
                if (draft.attendance_calendar[date][subject]) {
                  delete draft.attendance_calendar[date][subject];
                  if (Object.keys(draft.attendance_calendar[date]).length === 0) {
                    delete draft.attendance_calendar[date];
                  }
                }
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error("Delete operation failed:", error);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;
