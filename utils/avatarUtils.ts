
import { StaffProfile, GenderHint } from '../types';

export const PHOTO_CONFIG = {
  bg: 'bg-slate-100',
  border: 'border-white',
  shadow: 'shadow-md'
};

/**
 * Deterministically maps a profile to a realistic portrait based on genderHint and ID.
 * This ensures "James Smith" doesn't get a female photo and vice versa.
 */
export const getPhotoUrl = (profile: StaffProfile): string => {
  if (profile.avatarUrl) return profile.avatarUrl;

  const gender = profile.genderHint || 'neutral';
  
  // Create a stable numeric hash from the ID string
  const hash = Array.from(profile.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use professional portrait sets from randomuser.me for deterministic demo data
  // Index between 1-99
  const index = (hash % 90) + 1;

  switch (gender) {
    case 'male':
      return `https://randomuser.me/api/portraits/men/${index}.jpg`;
    case 'female':
      return `https://randomuser.me/api/portraits/women/${index}.jpg`;
    default:
      // Mix them up for neutral/unspecified
      return index % 2 === 0 
        ? `https://randomuser.me/api/portraits/men/${index}.jpg` 
        : `https://randomuser.me/api/portraits/women/${index}.jpg`;
  }
};

export const getAvatarOverlay = (profile: StaffProfile) => {
  if (profile.isSafetyCritical) return '🛡️';
  if (profile.rank === 1) return '⭐';
  if (profile.badges.includes('Most Improved')) return '📈';
  return null;
};
