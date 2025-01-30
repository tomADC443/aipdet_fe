export interface NDVIDataPoint {
    date: string;   // Format: "YYYY-MM-DD"
    value: number;  // Area in square kilometers
}

export type DashboardFetchData<T> = {
    status: 'loading' | 'error' | 'success';
    data: T | null;
};
export type NDVIAreaData = NDVIDataPoint[];
export type FeaturedLayer = 'NDVI' | 'WHC';