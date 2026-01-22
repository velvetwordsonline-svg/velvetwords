import axios from 'axios';

const API_BASE = 'https://www.velvetwords.online/backend';
const IMAGE_BASE = 'https://www.velvetwords.online/backend';

export async function getStoriesByCategory(category: string | null = null, lang: string = 'en') {
  // Use localStorage as primary source
  const localStories = JSON.parse(localStorage.getItem('stories') || '[]');
  
  // Filter by category if specified
  let filteredStories = localStories;
  if (category) {
    filteredStories = localStories.filter((story: any) => story.category === category);
  }
  
  return filteredStories;
}

export async function getStory(id: string, lang: string = 'en') {
  const { data } = await axios.get(`${API_BASE}/stories/${id}?lang=${lang}`);
  return data;
}

export async function getChapters(storyId: string, lang: string = 'en') {
  const { data } = await axios.get(`${API_BASE}/stories/${storyId}/chapters?lang=${lang}`);
  return data;
}

export async function getChapter(chapterId: string, lang: string = 'en') {
  const { data } = await axios.get(`${API_BASE}/chapters/${chapterId}?lang=${lang}`);
  return data;
}

export async function authenticatePhone(phone: string) {
  const { data } = await axios.post(`${API_BASE}/auth/phone`, { phone });
  return data;
}

export async function subscribeUser(phone: string, plan: string) {
  const { data } = await axios.post(`${API_BASE}/subscription/subscribe`, { phone, plan });
  return data;
}

export async function updateReadingProgress(phone: string, storyId: string, chapterNumber: number, position: number, percentage: number) {
  const { data } = await axios.post(`${API_BASE}/reading/progress`, {
    phone, storyId, chapterNumber, position, percentage
  });
  return data;
}

export async function getUserData(phone: string) {
  const { data } = await axios.get(`${API_BASE}/user/${phone}`);
  return data;
}

export async function checkChapterAccess(phone: string, chapterNumber: number) {
  const { data } = await axios.post(`${API_BASE}/access/chapter`, { phone, chapterNumber });
  return data;
}
