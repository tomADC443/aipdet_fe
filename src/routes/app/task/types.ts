import type { GeoJSON } from 'geojson';
export type Task = {
    id: string;
    name: string;
    status: string;
    createdAt: number;
    isPublic: boolean;
    description: string;
    aoi: {
        id: string;
        name: string;
        description: string;
        geometry: GeoJSON;
        createdAt: number;
    };

}