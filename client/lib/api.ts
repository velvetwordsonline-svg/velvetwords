const API_BASE = 'http://localhost:5001/api';

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getTrendingStories(lang = 'en') {
  const cacheKey = `trending-${lang}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await fetch(`${API_BASE}/trending?lang=${lang}`);
    if (response.ok) {
      const result = await response.json();
      const stories = result.data || [];
      
      const formatted = stories.map(story => ({
        id: story._id || story.id,
        title: story.title,
        author: story.author,
        description: story.description,
        coverImage: story.thumbnail,
        genre: story.category,
        rating: story.rating,
        reviewCount: story.reviewCount,
        totalChapters: story.totalChapters,
        isTrending: story.isTrending,
        createdAt: story.createdAt
      }));
      
      setCachedData(cacheKey, formatted);
      return formatted;
    }
    return [];
  } catch (error) {
    console.error('Error fetching trending stories:', error);
    return [];
  }
}

export async function getStoriesByCategory(category = null, lang = 'en') {
  try {
    let url = `${API_BASE}/stories`;
    if (category) url += `?category=${category}`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data.length > 0) {
        return data.map(story => ({
          id: story._id || story.id,
          title: story.title,
          author: story.author,
          description: story.description,
          category: story.category,
          totalChapters: story.totalChapters,
          coverImage: story.thumbnail,
          rating: story.rating,
          reviewCount: story.reviewCount,
          genre: story.category,
          isTrending: story.isTrending,
          createdAt: story.createdAt
        }));
      }
    }
    
    return [];
    
  } catch (error) {
    console.error('Error fetching from database:', error);
    return [];
  }
}

export async function getStory(id, lang = 'en') {
  try {
    const response = await fetch(`${API_BASE}/stories/${id}`);
    
    if (response.ok) {
      const story = await response.json();
      
      return {
        id: story._id || story.id,
        title: story.title,
        author: story.author,
        description: story.description,
        category: story.category,
        totalChapters: story.totalChapters,
        coverImage: story.thumbnail,
        rating: story.rating,
        reviewCount: story.reviewCount,
        genre: story.category,
        isTrending: story.isTrending,
        createdAt: story.createdAt
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching story from database:', error);
    return null;
  }
}

export async function getChapters(storyId, lang = 'en') {
  try {
    const response = await fetch(`${API_BASE}/stories/${storyId}/chapters`);
    
    if (response.ok) {
      const chapters = await response.json();
      
      return chapters.map((chapter: any) => ({
        id: chapter._id || chapter.id,
        storyId: chapter.storyId || storyId,
        number: chapter.chapterNumber || chapter.number,
        title: chapter.title,
        content: chapter.content,
        estimatedReadTime: chapter.estimatedReadTime,
        isLocked: false,
        createdAt: chapter.createdAt
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching chapters from database:', error);
    return [];
  }
}

export async function getChapter(chapterId, lang = 'en') {
  try {
    const response = await fetch(`${API_BASE}/chapters/${chapterId}`);
    
    if (response.ok) {
      const chapter = await response.json();
      
      return {
        id: chapter._id || chapter.id,
        storyId: chapter.storyId,
        number: chapter.chapterNumber || chapter.number,
        title: chapter.title,
        content: chapter.content,
        estimatedReadTime: chapter.estimatedReadTime,
        images: chapter.images,
        isLocked: false,
        createdAt: chapter.createdAt
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching chapter from database:', error);
    return null;
  }
}

export async function getCategories(lang = 'en') {
  try {
    const response = await fetch(`${API_BASE}/categories?lang=${lang}`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
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