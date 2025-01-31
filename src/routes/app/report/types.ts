export interface NDVIDataPoint {
    date: string;   // Format: "YYYY-MM-DD"
    value: number;  // Area in square kilometers
}

export type DashboardFetchData<T> = {
    status: 'loading' | 'error' | 'success';
    data: T | null;
    errorCode?: number;
};
export type NDVIAreaData = NDVIDataPoint[];
export type FeaturedLayer = 'NDVI' | 'WHC';

export type SeasonAnalysisData = { // Shared in multiple components
    seasons: Array<{
        season_start_week: number;
        season_end_week: number;
        season_start_description: string;
        season_end_description: string;
    }>;
    monthly_average: {
        month: string[];
        values: number[];
    };
    growthRates: {
        weekly_changes: {
            weeks: number[];
            values: (number | null)[];
        };
        max_increase: {
            week: string;
            week_description: string;
            change: string;
            change_percentage: string;
        };
        max_decrease: {
            week: string;
            week_description: string;
            change: string;
            change_percentage: string;
        };
    };
};