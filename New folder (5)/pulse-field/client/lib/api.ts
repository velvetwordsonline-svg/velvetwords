const API_BASE = 'https://www.velvetwords.online/backend/api';

export async function getStoriesByCategory(category = null, lang = 'en') {
  try {
    let url = `${API_BASE}/stories?lang=${lang}`;
    if (category) url += `&category=${category}`;
    
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function getStory(id, lang = 'en') {
  const response = await fetch(`${API_BASE}/stories/${id}?lang=${lang}`);
  return await response.json();
}

export async function getChapters(storyId, lang = 'en') {
  const response = await fetch(`${API_BASE}/stories/${storyId}/chapters?lang=${lang}`);
  return await response.json();
}

export async function getChapter(chapterId, lang = 'en') {
  const response = await fetch(`${API_BASE}/chapters/${chapterId}?lang=${lang}`);
  return await response.json();
}

export async function authenticatePhone(phone) {
  const response = await fetch(`${API_BASE}/auth/phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return await response.json();
}

export async function subscribeUser(phone, plan) {
  const response = await fetch(`${API_BASE}/subscription/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, plan })
  });
  return await response.json();
}