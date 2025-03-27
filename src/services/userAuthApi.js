import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.REACT_APP_API_URL || "https://fullstackapp-11.onrender.com";

export const userAuthApi = createApi({
  reducerPath: "userAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }), // ✅ Using environment variable
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: "register/",
        method: "POST",
        body: user,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: "login/",
        method: "POST",
        body: user,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getLoggedUser: builder.query({
      query: (access_token) => ({
        url: `${API_URL}/profile/`,
        method: "GET",
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    changeUserPassword: builder.mutation({
      query: ({ actualData, access_token }) => ({
        url: "changepassword/",
        method: "POST",
        body: actualData,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (user) => ({
        url: "send-reset-password-email/",
        method: "POST",
        body: user,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ uid, token, password, password2 }) => ({
        url: `reset-password/${uid}/${token}/`,
        method: "POST",
        body: JSON.stringify({ password, password2 }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetLoggedUserQuery,
  useChangeUserPasswordMutation,
  useSendPasswordResetEmailMutation,
  useResetPasswordMutation,
} = userAuthApi;
