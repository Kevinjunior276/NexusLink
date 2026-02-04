const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
        let url = process.env.NEXT_PUBLIC_API_URL.trim();
        if (url.endsWith('/')) url = url.slice(0, -1);

        // If the user already included '/api' in the URL, don't duplicate it
        if (url.endsWith('/api')) return url;

        return `${url}/api`;
    }
    return 'http://localhost:8000/api';
};

const API_URL = getBaseUrl();

const getHeaders = (endpoint?: string) => {
    const headers: any = {
        'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined' && endpoint !== '/login/' && endpoint !== '/register/') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
            const errorData = await response.json();
            if (typeof errorData === 'object' && errorData !== null) {
                if (errorData.message) errorMessage = errorData.message;
                else if (errorData.error) errorMessage = errorData.error;
                else if (errorData.detail) errorMessage = errorData.detail;
                else {
                    const fields = Object.keys(errorData);
                    if (fields.length > 0) {
                        const firstField = fields[0];
                        const firstError = Array.isArray(errorData[firstField]) ? errorData[firstField][0] : errorData[firstField];
                        errorMessage = `${firstField === 'non_field_errors' ? '' : firstField + ': '}${firstError}`;
                    }
                }
            }
        } catch (e) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const api = {
    async post(endpoint: string, data: any, retries = 3) {
        console.log(`POST request to ${endpoint}`, data);
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(`${API_URL}${endpoint}`, {
                    method: 'POST',
                    headers: getHeaders(endpoint),
                    body: JSON.stringify(data),
                });
                console.log(`Response status: ${response.status}`);
                return await handleResponse(response);
            } catch (err: any) {
                const isNetworkError = err.message === 'Failed to fetch' || err.name === 'TypeError' || err.name === 'AbortError';
                if (isNetworkError && i < retries - 1) {
                    console.log(`Retry ${i + 1}/${retries} for ${endpoint}...`);
                    await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Delay increases: 2s, 4s
                    continue;
                }

                console.error('Fetch error:', err);
                throw new Error(
                    `Impossible de contacter le serveur. \n\n` +
                    `Le serveur est probablement en train de démarrer (Cold Start). \n` +
                    `Réessayez dans un instant.`
                );
            }
        }
    },

    async patch(endpoint: string, data: any) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(endpoint),
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    },

    async get(endpoint: string, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(`${API_URL}${endpoint}`, {
                    headers: getHeaders(endpoint),
                });
                return await handleResponse(response);
            } catch (err: any) {
                const isNetworkError = err.message === 'Failed to fetch' || err.name === 'TypeError' || err.name === 'AbortError';
                if (isNetworkError && i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
                    continue;
                }
                throw err;
            }
        }
    },

    async delete(endpoint: string) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(endpoint),
        });
        if (!response.ok) return await handleResponse(response);
        return response.status === 204 ? null : response.json();
    }
};
