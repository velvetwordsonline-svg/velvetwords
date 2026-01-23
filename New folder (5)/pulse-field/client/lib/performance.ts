// Performance optimizations for faster loading

// 1. Lazy load components
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const Spotlight = lazy(() => import('@/components/Spotlight'));
const QuotesCarousel = lazy(() => import('@/components/QuotesCarousel'));
const UpcomingReleases = lazy(() => import('@/components/UpcomingReleases'));

// 2. Reduce initial data load
const INITIAL_STORIES_LIMIT = 12;
const INITIAL_CHARACTERS_LIMIT = 8;

// 3. Image optimization
const optimizeImageUrl = (url: string) => {
  if (url.startsWith('/assets/')) {
    return url + '?w=400&q=75'; // Add width and quality params
  }
  return url;
};

// 4. Debounce API calls
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export { 
  Spotlight, 
  QuotesCarousel, 
  UpcomingReleases, 
  INITIAL_STORIES_LIMIT,
  INITIAL_CHARACTERS_LIMIT,
  optimizeImageUrl,
  debounce
};