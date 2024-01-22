export interface Dataset{
    name: string;
    fetchUrl: URL;
    dataPath: string;
    type: DatasetType;
}

export interface DatasetType{
    name: string
}