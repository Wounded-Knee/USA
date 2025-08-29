import { quotes, Quote } from '../data/quotes';
import { backgrounds, BackgroundOption } from '../data/backgrounds';

/**
 * Simple hash function to convert a string to a number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a deterministic quote based on the UTC date
 */
export function getQuoteForDate(date: Date = new Date()): Quote {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const hash = hashString(dateString);
  const index = hash % quotes.length;
  return quotes[index];
}

/**
 * Get a compatible background for a quote
 */
export function getBackgroundForQuote(quote: Quote): BackgroundOption {
  // Get all compatible backgrounds
  const compatibleBackgrounds = backgrounds.filter(bg => 
    quote.backgroundIds.includes(bg.id)
  );
  
  if (compatibleBackgrounds.length === 0) {
    // Fallback to first background if no matches
    return backgrounds[0];
  }
  
  // Use quote ID to deterministically select a background
  const hash = hashString(quote.id);
  const index = hash % compatibleBackgrounds.length;
  return compatibleBackgrounds[index];
}

/**
 * Get today's quote and background combination
 */
export function getTodaysQuoteAndBackground() {
  const quote = getQuoteForDate();
  const background = getBackgroundForQuote(quote);
  
  return {
    quote,
    background
  };
}

/**
 * Get quote and background for a specific date
 */
export function getQuoteAndBackgroundForDate(date: Date) {
  const quote = getQuoteForDate(date);
  const background = getBackgroundForQuote(quote);
  
  return {
    quote,
    background
  };
}
