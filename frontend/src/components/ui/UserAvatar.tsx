import { useState } from 'react';

interface UserAvatarProps {
  avatarUrl?: string | null;
  name: string;
  className?: string;
}

export const UserAvatar = ({ avatarUrl, name, className = "" }: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  const initial = name?.charAt(0)?.toUpperCase() || 'U';

  if (avatarUrl && !hasError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className={`object-cover ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center font-bold bg-primary/20 text-primary ${className}`}>
      {initial}
    </div>
  );
};
