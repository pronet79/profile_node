import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true, // send/receive HttpOnly auth cookie
});

// Optional bearer token fallback (e.g. if cookies are blocked)
let authToken = null;
export function setAuthToken(token) {
  authToken = token;
  if (token) localStorage.setItem('pm_token', token);
  else localStorage.removeItem('pm_token');
}
authToken = localStorage.getItem('pm_token');

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// Normalize error messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Request failed';
    const errors = err.response?.data?.errors || [];
    return Promise.reject({ message, errors, status: err.response?.status });
  }
);

/* Uploads a single image file to the admin uploads endpoint.
   Returns the stored URL. Auth flows via cookie or bearer as usual. */
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data.data; // { url, publicId, provider }
}

/* Uploads a document (e.g. a resume PDF) to the server's own storage.
   Returns the stored URL. */
export async function uploadDocument(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await api.post('/uploads/document', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data.data; // { url, publicId, provider }
}
