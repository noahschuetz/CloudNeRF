import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
	tagTypes: ["datasets"],
	endpoints: (build) => ({
		getDatasets: build.query({
			query: () => "datasets",
			providesTags: ["datasets"],
		}),
		getDataset: build.query({
			query: (id) => `datasets/${id}`,
			providesTags: (result, error, id) => [{ type: "datasets", id }],
		}),
		getDatasetImages: build.query({
			query: (id) => `datasets/${id}/images`,
			providesTags: (result, error, id) => [{ type: "datasets", id }],
		}),
		//infos as parameters in url of the query
		createDataset: build.mutation({
			query: (body) => ({
				url: `datasets/`,
				method: "POST",
				body,
			}),
			invalidatesTags: ["datasets"],
		}),
		deleteDataset: build.mutation({
			query: (id) => ({
				url: `datasets/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["datasets"],
		}),
		updateImages: build.mutation({
			query: (id) => ({
				url: `datasets/${id}/images`,
				method: "PATCH",
			}),
			invalidatesTags: ["datasets"],
		}),
	}),
});

export const {
	useGetDatasetsQuery,
	useGetDatasetQuery,
	useGetDatasetImagesQuery,
	useCreateDatasetMutation,
	useDeleteDatasetMutation,
	useUpdateImagesMutation,

} = api;
export default api;
