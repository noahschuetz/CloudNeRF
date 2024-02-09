import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
	tagTypes: ["datasets"],
	endpoints: (build) => ({
		getDatasets: build.query({
			query: () => "datasets",
			providesTags: ["datasets"],
			// map the name of results to the name, label, and value fields
			transformResponse: (response, meta) => {
				return response.map((dataset) => ({
					...dataset,
					label: dataset.name,
					value: dataset.name,
				}));
			},
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
				url: "datasets/",
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
		getDockerImages: build.query({
			query: () => "models/docker_images/",
			providesTags: (result, error, id) => [{ type: "models", id }],
		}),
		getRunModelConfigs: build.query({
			query: () => "models/configs/",
			providesTags: (result, error, id) => [{ type: "models", id }],
		}),
		getResults: build.query({
			query: () => `results/`,
			providesTags: (result, error, id) => [{ type: "results", id }],
		}),
		getResultMeshUrl: build.query({
			query: (id) => `results/${id}/meshUrl`,
			providesTags: (result, error, id) => [{ type: "results", id }],
			transformResponse: (response, meta) => {
				return response.signedUrl;
			},

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
	useGetDockerImagesQuery,
	useGetRunModelConfigsQuery,
	useGetResultsQuery,
	useGetResultMeshQuery,
	} = api;
export default api;
