/**
 * Formats a YYYY-MM-DD date string into a localized readable format.
 * @param dateStr Date string in YYYY-MM-DD format
 * @param locale Locale string (e.g., 'tr', 'en')
 */
export function formatDate(dateStr: string, locale: string = 'en'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  try {
    return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', options);
  } catch (e) {
    return date.toLocaleDateString('en-US', options);
  }
}

/**
 * Validates if the given date string is in YYYY-MM-DD format,
 * represents a valid date, and is not in the future.
 * @param dateStr Date string to validate
 */
export function isValidDob(dateStr: string): boolean {
  if (!dateStr) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  
  // Check if it's in the future
  const now = new Date();
  if (date > now) return false;
  
  // Additional strict check (e.g., "2021-02-31" becomes "2021-03-03" in JS Date)
  const [year, month, day] = dateStr.split('-').map(Number);
  return date.getFullYear() === year && (date.getMonth() + 1) === month && date.getDate() === day;
}
