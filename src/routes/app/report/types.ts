export interface NDVIDataPoint {
    date: string;   // Format: "YYYY-MM-DD"
    value: number;  // Area in square kilometers
}

export type NDVIAreaData = NDVIDataPoint[];