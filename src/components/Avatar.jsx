import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Avatar component – shows profile picture or coloured initials.
 * Sizes: 'sm' | 'md' | 'lg' | 'xl'
 */
export default function Avatar({ profile, size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? 'U';

  // Deterministic colour from first initial character code
  const hue = ((initials.charCodeAt(0) || 65) * 37) % 360;
  const bg  = `hsl(${hue},55%,38%)`;

  if (profile?.profile_picture_url) {
    return (
      <img
        src={profile.profile_picture_url}
        alt={profile.full_name || 'User avatar'}
        className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0 ${className}`}
        onError={e => { e.target.style.display = 'none'; }}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ring-2 ring-white shadow-sm select-none ${className}`}
      style={{ backgroundColor: bg }}
      aria-label={`Avatar for ${profile?.full_name || 'User'}`}
    >
      {initials}
    </div>
  );
}

/**
 * Convenience wrapper that reads the current user's profile from AuthContext.
 */
export function CurrentUserAvatar({ size = 'md', className = '' }) {
  const { profile } = useAuth();
  return <Avatar profile={profile} size={size} className={className} />;
}
