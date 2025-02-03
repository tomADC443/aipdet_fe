export type AOI = {
    id: string;
    name: string;
    description: string;
    createdAt: number;
    geometry: string;
}

export type FetchedAOI = AOI & {
    hasTask: boolean;
}