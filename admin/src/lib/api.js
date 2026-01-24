import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  
  uploadStory: (formData, onProgress) => api.post('/admin/upload-story', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total))
  }),
  
  getStories: () => api.get('/admin/stories'),
  
  deleteStory: (id) => api.delete(`/delete-story/${id}`),
};

export const publicAPI = {
  getStories: (lang = 'en') => api.get(`/stories?lang=${lang}`),
  
  getStory: (id, lang = 'en') => api.get(`/stories/${id}?lang=${lang}`),
  
  getChapters: (storyId, lang = 'en') => api.get(`/stories/${storyId}/chapters?lang=${lang}`),
  
  getChapter: (chapterId, lang = 'en') => api.get(`/chapters/${chapterId}?lang=${lang}`),
  
  getStoryChapter: (storyId, chapterId, lang = 'en') => api.get(`/stories/${storyId}/chapters/${chapterId}?lang=${lang}`),
  
  getStoryWithFirstChapter: (id, lang = 'en') => api.get(`/stories/${id}?lang=${lang}&includeFirstChapter=true`),
};

export default api;
