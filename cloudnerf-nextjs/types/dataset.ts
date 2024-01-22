export interface Dataset {
	name: string;
	fetchUrl: URL;
	type: DatasetType;
}

export enum DatasetType {
	colmap = 0,
	images = 1,
	video = 2,
	multiple_videos = 3,
}
