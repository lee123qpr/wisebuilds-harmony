
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { format, parseISO } from 'date-fns';

interface ProfileHeaderSectionProps {
  profile: FreelancerProfile;
}

// This component is no longer needed as we're not showing a duplicated profile card
const ProfileHeaderSection: React.FC<ProfileHeaderSectionProps> = ({ profile }) => {
  return null;
};

export default ProfileHeaderSection;
