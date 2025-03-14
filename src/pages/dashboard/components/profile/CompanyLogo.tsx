import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useLogoUpload } from '../../hooks/useLogoUpload';
import CompanyAvatar from './CompanyAvatar';
import ProfileInfoBadges from './ProfileInfoBadges';

interface CompanyLogoProps {
  logoUrl: string | null;
  uploadingLogo: boolean;
  setUploadingLogo: (value: boolean) => void;
  setLogoUrl: (url: string) => void;
  companyName: string;
  contactName: string;
  userId: string;
  memberSince: string | null;
  emailVerified: boolean;
  jobsCompleted: number;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl: initialLogoUrl,
  uploadingLogo: initialUploadingLogo,
  setUploadingLogo: setParentUploadingLogo,
  setLogoUrl: setParentLogoUrl,
  companyName,
  contactName,
  userId,
  memberSince,
  emailVerified,
  jobsCompleted
}) => {
  // Use our custom hook for logo upload
  const {
    cachedLogoUrl,
    uploadingLogo,
    imageKey,
    handleLogoUpload,
    setLogoUrl,
    setUploadingLogo
  } = useLogoUpload({
    userId,
    companyName,
    contactName
  });

  // Sync with parent state when our local state changes
  React.useEffect(() => {
    if (cachedLogoUrl) {
      setParentLogoUrl(cachedLogoUrl);
    }
  }, [cachedLogoUrl, setParentLogoUrl]);

  React.useEffect(() => {
    setParentUploadingLogo(uploadingLogo);
  }, [uploadingLogo, setParentUploadingLogo]);

  // Initialize our local state with the props
  React.useEffect(() => {
    if (initialLogoUrl && !cachedLogoUrl) {
      setLogoUrl(initialLogoUrl);
    }
  }, [initialLogoUrl, cachedLogoUrl, setLogoUrl]);

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!companyName) return 'BC'; // Default: Business Client
    
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format the member since date
  const formattedMemberSince = memberSince 
    ? format(new Date(memberSince), 'MMMM yyyy')
    : 'Recently joined';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-row items-center gap-4">
          <CompanyAvatar
            logoUrl={cachedLogoUrl}
            uploadingLogo={uploadingLogo}
            imageKey={imageKey}
            initials={getInitials()}
            handleLogoUpload={handleLogoUpload}
          />

          <div className="flex-1 min-w-0">
            <div className="mb-1">
              <h2 className="text-xl font-semibold truncate">{companyName || 'Your Company'}</h2>
              <p className="text-sm text-muted-foreground">{contactName || 'Contact Person'}</p>
            </div>

            <ProfileInfoBadges
              emailVerified={emailVerified}
              memberSince={memberSince || ''}
              formattedMemberSince={formattedMemberSince}
              jobsCompleted={jobsCompleted}
              userId={userId}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLogo;
