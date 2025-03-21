import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }),
  endpoints: (builder) => ({
    // Existing Endpoints
    registerUser: builder.mutation({
      query: (user) => ({
        url: 'register/',
        method: 'POST',
        body: user,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    loginUser: builder.mutation({
      query: (user) => ({
        url: 'login/',
        method: 'POST',
        body: user,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getLoggedUser: builder.query({
      query: (access_token) => ({
        url: 'profile/',
        method: 'GET',
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    changeUserPassword: builder.mutation({
      query: ({ actualData, access_token }) => ({
        url: 'changepassword/',
        method: 'POST',
        body: actualData,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${access_token}`,
        },
      }),
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (user) => ({
        url: 'send-reset-password-email/',
        method: 'POST',
        body: user,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    // ✅ Reset Password Endpoint
    resetPassword: builder.mutation({
      query: ({ uid, token, password, password2 }) => ({
        url: `reset-password/${uid}/${token}/`, // Match Django URL
        method: 'POST',
        body: JSON.stringify({ password, password2 }), // { password: "newpass", password2: "newpass" }
        headers: {
          'Content-Type': 'application/json',
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
  useResetPasswordMutation, // ✅ Export the new hook
} = userAuthApi;
