// Activity categories
export const SPORTS_CATEGORIES = ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Badminton', 'Chess', 'Carrom', 'Other'];
export const GAMING_CATEGORIES = ['BGMI', 'Valorant', 'Free Fire', 'COD Mobile', 'EA FC', 'Real Cricket', 'Other'];
export const ALL_CATEGORIES = [...SPORTS_CATEGORIES, ...GAMING_CATEGORIES];

// Category icons (emoji fallback)
export const CATEGORY_ICONS = {
  Cricket: '🏏',
  Football: '⚽',
  Basketball: '🏀',
  Volleyball: '🏐',
  Badminton: '🏸',
  Chess: '♟️',
  Carrom: '🎯',
  BGMI: '🎮',
  Valorant: '🎮',
  'Free Fire': '🔥',
  'COD Mobile': '🔫',
  'EA FC': '⚽',
  'Real Cricket': '🏏',
  'Other': '🎯',
};

// Category colors (Tailwind classes)
export const CATEGORY_COLORS = {
  Cricket: 'from-green-500/20 to-emerald-500/10 border-green-500/20',
  Football: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/20',
  Basketball: 'from-orange-500/20 to-red-500/10 border-orange-500/20',
  Volleyball: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20',
  Badminton: 'from-teal-500/20 to-cyan-500/10 border-teal-500/20',
  Chess: 'from-gray-500/20 to-slate-500/10 border-gray-500/20',
  Carrom: 'from-brown-500/20 to-amber-800/10 border-amber-800/20',
  BGMI: 'from-purple-500/20 to-violet-500/10 border-purple-500/20',
  Valorant: 'from-red-500/20 to-rose-500/10 border-red-500/20',
  'Free Fire': 'from-orange-500/20 to-red-500/10 border-orange-500/20',
  'COD Mobile': 'from-green-600/20 to-lime-500/10 border-green-600/20',
  'EA FC': 'from-blue-600/20 to-indigo-500/10 border-blue-600/20',
  'Real Cricket': 'from-sky-500/20 to-blue-500/10 border-sky-500/20',
};

// Activity statuses
export const ACTIVITY_STATUSES = ['Open', 'Full', 'Ongoing', 'Completed', 'Cancelled'];

// Year options
export const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// Notification types
export const NOTIFICATION_TYPES = {
  PLAYER_JOINED: 'PLAYER_JOINED',
  PLAYER_LEFT: 'PLAYER_LEFT',
  ACTIVITY_FULL: 'ACTIVITY_FULL',
  ACTIVITY_CANCELLED: 'ACTIVITY_CANCELLED',
  WAITLIST_PROMOTED: 'WAITLIST_PROMOTED',
  ACTIVITY_STARTING_SOON: 'ACTIVITY_STARTING_SOON',
  REMOVED_FROM_ACTIVITY: 'REMOVED_FROM_ACTIVITY',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
