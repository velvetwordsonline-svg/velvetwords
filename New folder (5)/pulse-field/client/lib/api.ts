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
    // Always fetch fresh data from backend first
    let url = `${API_BASE}/stories?lang=${lang}`;
    if (category) url += `&category=${category}`;
    
    let stories = [];
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        const backendStories = await response.json();
        console.log('Backend stories with thumbnails:', backendStories);
        
        // Format backend stories properly
        stories = backendStories.map(story => ({
          id: story.id || story._id,
          title: story.title,
          author: story.author,
          description: story.description,
          category: story.category,
          totalChapters: story.totalChapters || 1,
          coverImage: story.thumbnail || '/assets/portrait/1p.jpg'
        }));
      }
    } catch (error) {
      console.warn('Backend fetch failed, using localStorage');
    }
    
    // Also get from localStorage (for admin uploaded stories)
    const localStories = JSON.parse(localStorage.getItem('stories') || '[]');
    console.log('Raw localStorage stories:', localStories);
    
    // Merge and deduplicate stories
    const allStories = [...stories];
    
    localStories.forEach(localStory => {
      if (!allStories.find(s => s.id === localStory.id || s._id === localStory._id)) {
        console.log('Processing local story:', localStory.title, 'thumbnail:', localStory.thumbnail);
        
        // Format local story to match expected structure
        const formattedStory = {
          id: localStory._id || localStory.id,
          title: localStory.title?.en || localStory.title,
          author: localStory.author,
          description: localStory.description?.en || localStory.description,
          category: localStory.category,
          totalChapters: localStory.totalChapters || 1,
          coverImage: localStory.thumbnail || '/assets/portrait/1p.jpg'
        };
        console.log('Final coverImage:', formattedStory.coverImage);
        allStories.push(formattedStory);
      }
    });
    
    // Filter by category if specified
    const filteredStories = category 
      ? allStories.filter(story => story.category === category)
      : allStories;
    
    return filteredStories;
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