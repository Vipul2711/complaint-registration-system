
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(endpoint, options = {}) {
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}