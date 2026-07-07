import { formatDistanceToNow, format, isToday, isTomorrow } from 'date-fns';

/**
 * Format a date to a human-readable string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d, yyyy');
};

/**
 * Format timestamp to relative time (e.g. "2 hours ago")
 */
export const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Get status badge class
 */
export const getStatusClass = (status) => {
  const map = {
    Open: 'badge-open',
    Full: 'badge-full',
    Ongoing: 'badge-ongoing',
    Completed: 'badge-completed',
    Cancelled: 'badge-cancelled',
  };
  return map[status] || 'badge-completed';
};

/**
 * Truncate string to maxLength
 */
export const truncate = (str, maxLength = 80) => {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Get user initials from name
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
