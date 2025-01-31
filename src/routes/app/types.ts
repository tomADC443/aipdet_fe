
export type FetchData<T> = {
    status: 'loading' | 'error' | 'success';
    data: T | null;
    errorCode?: number;
};

export type FetchResponse<T> = {
    status: 'error' | 'success';
    data: T | null;
    errorCode?: number;
};

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type FetchOptions = {
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
};