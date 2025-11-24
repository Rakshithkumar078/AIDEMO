export function getBaseApiUrl(): string {
    const envApiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
    return envApiBaseUrl;
}
