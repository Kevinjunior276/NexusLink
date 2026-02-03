const getBaseUrl = () => {
    // If an environment variable is set (Vercel production or local .env), use it
    if (process.env.NEXT_PUBLIC_API_URL) {
        // Ensure no trailing slash if user accidentally adds it (api.ts adds endpoints starting with /)
        // Actually, let's keep it simple: users should provide base url like '.../api' or handle it here
        // The instructions said NEXT_PUBLIC_API_URL = https://nexus-backend.onrender.com
        // We need to append /api if the user follows instructions strictly to provide root URL
        // But our code expects API_URL to include /api usually? Let's check usages.
        // Usage: `${API_URL}${endpoint}` where endpoint usually starts with /.
        // So API_URL should NOT end with /.
        // However, standard django setup is /api/.
        // Let's assume the user puts the HOST string in env var.

        // Let's stick to the convention defined in instructions:
        // Instruction: NEXT_PUBLIC_API_URL = https://nexus-backend.onrender.com
        // Code should append /api

        let url = process.env.NEXT_PUBLIC_API_URL;
        if (url.endsWith('/')) url = url.slice(0, -1);
        return `${url}/api`;

        // Wait, if users put '.../api' it breaks. 
        // Let's be smart.
        // If the env var contains 'api' at the end, trust it? No, safer to just append /api to the HOST.
    }

    // Default fallback for local development if env var is missing
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
    async post(endpoint: string, data: any) {
        console.log(`POST request to ${endpoint}`, data);
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(endpoint),
                body: JSON.stringify(data),
            });
            console.log(`Response status: ${response.status}`);
            return handleResponse(response);
        } catch (err: any) {
            console.error('Fetch error:', err);
            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                throw new Error(`Impossible de contacter le serveur à ${API_URL}${endpoint}. Vérifiez votre connexion.`);
            }
            throw err;
        }
    },

    async patch(endpoint: string, data: any) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(endpoint),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async get(endpoint: string) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: getHeaders(endpoint),
        });
        return handleResponse(response);
    },

    async delete(endpoint: string) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(endpoint),
        });
        if (!response.ok) return handleResponse(response);
        return response.status === 204 ? null : response.json();
    }
};
