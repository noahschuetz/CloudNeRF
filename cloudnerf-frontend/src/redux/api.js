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
				url: `datasets/${body.name}+${body.description}+${body.compatible_models}+${body.images}`,
				method: "POST",
				body,
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
} = api;
export default api;
