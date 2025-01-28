export interface NDVIDataPoint {
    date: string;   // Format: "YYYY-MM-DD"
    value: number;  // Area in square kilometers
}

export type DashboardFetchData = {
    status: 'loading' | 'error' | 'success';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any | null;
};
export type NDVIAreaData = NDVIDataPoint[];