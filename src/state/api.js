import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["KhachHang", "Sales", "Overview"],
  endpoints: (build) => ({
    getKhachHang: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "khachhang",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["KhachHang"],
    }),
    addKhachHang: build.mutation({
      query: (newKhachHang) => ({
        url: "khachhang",
        method: "POST",
        body: newKhachHang,
      }),
      invalidatesTags: ["KhachHang"], 
    }),
    editKhachHang: build.mutation({
      query: ({ id, ...data }) => ({
        url: `khachhang/${id}`, 
        method: "PUT", 
        body: data, 
      }),
      invalidatesTags: ["Data"], 
    }),
    getSales: build.query({
      query: () => "api/dashboard",
      providesTags: ["Sales"],
    }),
    getOverview: build.query({
      query: ({ page, pageSize, sort, search, start, end }) => ({
        url: "thongkekhachhang",
        method: "GET",
        params: { page, pageSize, sort, search, start, end },
      }),
      providesTags: ["Overview"],
    }),
  }),
});

export const { useGetKhachHangQuery, useAddKhachHangMutation, useEditKhachHangMutation, useGetSalesQuery, useGetOverviewQuery, } = api;
