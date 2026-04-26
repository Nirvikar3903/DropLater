import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { noteParser } from './noteParser';

export const notesApi = createApi({
  reducerPath: 'notesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => {
      const token = import.meta.env.VITE_ADMIN_TOKEN;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notes'],
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.set('status', params.status);
        if (params.page) searchParams.set('page', String(params.page));
        if (params.limit) searchParams.set('limit', String(params.limit));
        const qs = searchParams.toString();
        return `/api/notes${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Notes', id: 'LIST' }],
      transformResponse: (response) => {
        const notes = Array.isArray(response) ? response : response.notes || response.data || [];
        return notes.map(noteParser);
      },
    }),

    createNote: builder.mutation({
      query: (body) => ({
        url: '/api/notes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Notes', id: 'LIST' }],
    }),

    replayNote: builder.mutation({
      query: (id) => ({
        url: `/api/notes/${id}/replay`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Notes', id: 'LIST' }, { type: 'Notes', id: 'ID' }],
    }),

    getNoteById: builder.query({
      query: (id) => `/api/notes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notes', id: 'ID' }, { type: 'Notes', id }],
      transformResponse: (response) => noteParser(response),
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useReplayNoteMutation,
  useGetNoteByIdQuery,
} = notesApi;
