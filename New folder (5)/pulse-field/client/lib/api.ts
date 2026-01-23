const API_BASE = 'https://velvetwords-backend.vercel.app/api';

export async function getTrendingStories(lang = 'en') {
  try {
    const response = await fetch(`${API_BASE}/trending?lang=${lang}`);
    if (response.ok) {
      const result = await response.json();
      const stories = result.data || [];
      
      // Format stories to match expected structure
      return stories.map(story => ({
        id: story._id || story.id,
        title: story.title,
        author: story.author,
        description: story.description || 'No description available',
        coverImage: story.thumbnail || '/assets/portrait/1p.jpg',
        genre: story.category || 'Romance',
        rating: story.rating || 4.5,
        reviewCount: story.reviewCount || 100,
        totalChapters: story.totalChapters || 1,
        isTrending: story.isTrending || true,
        createdAt: story.createdAt || new Date().toISOString()
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching trending stories:', error);
    return [];
  }
}

export async function getStoriesByCategory(category = null, lang = 'en') {
  try {
    // Use aggressive caching to reduce Vercel bandwidth
    const cacheKey = `stories_${category || 'all'}_${lang}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
    const now = Date.now();
    
    // Use cache if less than 15 minutes old
    if (cachedData && cacheTimestamp) {
      const cacheAge = now - parseInt(cacheTimestamp);
      if (cacheAge < 15 * 60 * 1000) { // 15 minutes
        console.log('Using cached category data to save bandwidth');
        return JSON.parse(cachedData);
      }
    }
    
    // Only fetch if cache is old
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    let url = `${API_BASE}/stories?lang=${lang}`;
    if (category) url += `&category=${category}`;
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const backendStories = await response.json();
        const formattedStories = backendStories.map(story => ({
          id: story.id || story._id,
          title: story.title,
          author: story.author,
          description: story.description,
          category: story.category,
          totalChapters: story.totalChapters || 1,
          coverImage: story.thumbnail || '/assets/portrait/1p.jpg'
        }));
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify(formattedStories));
        localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
        return formattedStories;
      }
    } catch (error) {
      clearTimeout(timeoutId);
    }
    
    // Fallback to any cached data (even if old)
    if (cachedData) {
      console.log('Using old cached data as fallback');
      return JSON.parse(cachedData);
    }
    
    return [];
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