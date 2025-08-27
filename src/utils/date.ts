import { DATE_FORMATS } from '../constants';

/**
 * Format date for display
 */
export function formatDate(date: string | Date, format: string = DATE_FORMATS.DISPLAY): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY-MM-DDTHH:mm:ss.SSSZ':
      return dateObj.toISOString();
    default:
      return `${day}/${month}/${year}`;
  }
}

/**
 * Parse date from display format to Date object
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  // Handle DD/MM/YYYY format
  const ddmmyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateString.match(ddmmyyyy);
  
  if (match) {
    const [, day, month, year] = match;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Fallback to standard Date parsing
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Get date range for common periods
 */
export function getDateRange(period: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear'): { from: Date; to: Date } {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const day = today.getDay();
  
  switch (period) {
    case 'today':
      return {
        from: new Date(year, month, date),
        to: new Date(year, month, date, 23, 59, 59, 999)
      };
      
    case 'yesterday':
      return {
        from: new Date(year, month, date - 1),
        to: new Date(year, month, date - 1, 23, 59, 59, 999)
      };
      
    case 'thisWeek':
      const startOfWeek = date - day + (day === 0 ? -6 : 1); // Monday
      return {
        from: new Date(year, month, startOfWeek),
        to: new Date(year, month, startOfWeek + 6, 23, 59, 59, 999)
      };
      
    case 'lastWeek':
      const startOfLastWeek = date - day - 6 + (day === 0 ? -6 : 1);
      return {
        from: new Date(year, month, startOfLastWeek),
        to: new Date(year, month, startOfLastWeek + 6, 23, 59, 59, 999)
      };
      
    case 'thisMonth':
      return {
        from: new Date(year, month, 1),
        to: new Date(year, month + 1, 0, 23, 59, 59, 999)
      };
      
    case 'lastMonth':
      return {
        from: new Date(year, month - 1, 1),
        to: new Date(year, month, 0, 23, 59, 59, 999)
      };
      
    case 'thisYear':
      return {
        from: new Date(year, 0, 1),
        to: new Date(year, 11, 31, 23, 59, 59, 999)
      };
      
    default:
      return {
        from: today,
        to: today
      };
  }
}

/**
 * Check if date is valid
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValidDate(dateObj)) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  if (diffInSeconds < 2629746) return `${Math.floor(diffInSeconds / 604800)} tuần trước`;
  if (diffInSeconds < 31556952) return `${Math.floor(diffInSeconds / 2629746)} tháng trước`;
  
  return `${Math.floor(diffInSeconds / 31556952)} năm trước`;
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}
