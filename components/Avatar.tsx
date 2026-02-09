
import React, { useState } from 'react';
import { StaffProfile } from '../types';
import { getAvatarOverlay, PHOTO_CONFIG, getPhotoUrl } from '../utils/avatarUtils';

interface AvatarProps {
  profile: StaffProfile;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
};

const overlaySizes = {
  sm: 'w-3 h-3 text-[6px]',
  md: 'w-5 h-5 text-[10px]',
  lg: 'w-7 h-7 text-[14px]',
  xl: 'w-10 h-10 text-[20px]',
};

export const Avatar: React.FC<AvatarProps> = ({ profile, size = 'md', className = '' }) => {
  const overlay = getAvatarOverlay(profile);
  const [hasError, setHasError] = useState(false);

  // Deterministic, gender-aware URL
  const photoUrl = getPhotoUrl(profile);

  return (
    <div className={`relative flex-shrink-0 group ${className}`} title="Profile photos are AI-generated for demo purposes.">
      <div className={`rounded-full overflow-hidden border-2 flex items-center justify-center transition-all duration-300 ${PHOTO_CONFIG.border} ${PHOTO_CONFIG.shadow} ${PHOTO_CONFIG.bg} ${sizes[size]}`}>
        {hasError ? (
           <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-black uppercase tracking-tighter">
             {profile.name.split(' ').map(n => n[0]).join('')}
           </div>
        ) : (
          <img 
            key={photoUrl} // Re-mount when URL changes (e.g. during gender toggle)
            src={photoUrl} 
            alt={`Profile photo for ${profile.name}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      
      {overlay && (
        <div className={`absolute bottom-0 right-0 ${overlaySizes[size]} bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center transform translate-x-1/4 translate-y-1/4 z-10`}>
          {overlay}
        </div>
      )}
    </div>
  );
};
