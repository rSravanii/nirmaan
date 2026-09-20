const rawApiUrl = String(import.meta.env.VITE_API_URL || '').trim();

// Local development defaults to the Node API. Production should set VITE_API_URL
// in the Vercel project settings to the public Render API URL ending in /api.
export const API_URL = (rawApiUrl || 'http://localhost:5000/api').replace(/\/+$/, '');

export function resolveAssetUrl(value?: string | null): string {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  const apiOrigin = API_URL.replace(/\/api\/?$/, '');
  if (value.startsWith('/')) return `${apiOrigin}${value}`;
  return `${apiOrigin}/${value}`;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; status?: number; [key: string]: any }> {
  const token = localStorage.getItem('gramutthan_token');
  const headers = new Headers(options.headers || {});

  if (token) headers.set('Authorization', `Bearer ${token}`);

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const raw = await response.text();
    let data: any = null;

    if (raw.trim()) {
      if (contentType.toLowerCase().includes('application/json')) {
        try {
          data = JSON.parse(raw);
        } catch {
          return {
            success: false,
            status: response.status,
            message: 'The server returned invalid JSON. Please try again.',
          };
        }
      } else {
        return {
          success: false,
          status: response.status,
          message:
            response.status >= 500
              ? 'The server returned an unexpected error. Please try again.'
              : `Unexpected server response (${response.status}).`,
        };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data?.message || `Request failed with status ${response.status}.`,
        ...(data || {}),
      };
    }

    return data || { success: true, status: response.status };
  } catch (err: any) {
    console.error(`API request failed [${url}]:`, err);
    return {
      success: false,
      status: 0,
      message:
        err?.message?.includes('Failed to fetch')
          ? 'Unable to reach the Nirmaan server. Please check the deployment/API URL and your internet connection.'
          : err?.message || 'Network request failed.',
    };
  }
}
