import {DatasetType} from "@/types/dataset"

export interface Model{
    name: string;
    compatibleDatasetTypes: DatasetType[];
    dockerfile: string;
}