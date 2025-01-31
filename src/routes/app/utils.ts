export function formatUnixTimestampToLocalTime(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleString();
}

type FetchResponse<T> = {
    status: 'error' | 'success';
    data: T | null;
    errorCode?: number;
};

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type FetchOptions = {
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
};

export async function authenticatedBackendFetch<T>(
    endpoint: string,
    method: FetchMethod,
    options: FetchOptions = {}
): Promise<FetchResponse<T>> {
    const defaultOptions: FetchOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        }
    };

    try {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL_API}/api/${endpoint}`,
            {
                method,
                ...defaultOptions,
                ...options
            }
        );

        if (!response.ok) {
            console.error('Response Not OK:', response);
            return {
                status: 'error',
                data: null,
                errorCode: response.status
            };
        }

        const data = await response.json();
        return {
            status: 'success',
            data
        };
    } catch (error) {
        console.error('Fetch error:', error);

        return {
            status: 'error',
            data: null,
        };
    }
}

export function getErrorCodeText(errorCode?: number): string {
    if (errorCode === 400) {
        return 'Bad Request. Please try again later.';
    } else if (errorCode === 401 || errorCode === 403) {
        return "You are not authorized to request this data.";
    } else if (errorCode === 404) {
        return 'Task could not be found. Please try again later.'
    } else {
        return 'Failed to fetch total image count. Please try again later.';
    }
}