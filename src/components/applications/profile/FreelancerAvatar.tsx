
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FreelancerAvatarProps {
  profilePhoto?: string;
  displayName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FreelancerAvatar: React.FC<FreelancerAvatarProps> = ({ 
  profilePhoto, 
  displayName,
  size = 'lg'
}) => {
  const getInitials = (name?: string) => {
    if (!name) return 'AF';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={profilePhoto} alt={displayName} />
      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
    </Avatar>
  );
};
