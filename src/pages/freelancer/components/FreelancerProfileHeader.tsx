
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import FreelancerProfileCard from '@/components/freelancer/FreelancerProfileCard';
import { Card } from '@/components/ui/card';
import { Shield, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FreelancerProfileHeaderProps {
  profile: FreelancerProfile;
}

const FreelancerProfileHeader: React.FC<FreelancerProfileHeaderProps> = ({ profile }) => {
  const fullName = profile.display_name || 
    (profile.first_name && profile.last_name ? 
    `${profile.first_name} ${profile.last_name}` : 
    'Freelancer');

  // Determine if insurance exists and get coverage level
  const hasInsurance = typeof profile.indemnity_insurance === 'boolean' 
    ? profile.indemnity_insurance 
    : profile.indemnity_insurance?.hasInsurance;
    
  const coverLevel = typeof profile.indemnity_insurance === 'boolean' 
    ? 'Not specified' 
    : profile.indemnity_insurance?.coverLevel || 'Not specified';

  return (
    <Card className="shadow-md border border-border/60 overflow-hidden">
      <FreelancerProfileCard
        profileImage={profile.profile_photo}
        fullName={fullName}
        profession={profile.job_title}
        userId={profile.id}
        memberSince={profile.member_since}
        emailVerified={profile.email_verified}
        jobsCompleted={profile.jobs_completed}
        idVerified={profile.verified}
        rating={profile.rating}
        reviewsCount={profile.reviews_count}
        location={profile.location}
        allowImageUpload={false}
      />
      
      {/* Insurance Badge */}
      {profile.indemnity_insurance && (
        <div className="px-6 py-3 border-t border-border/60 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-full ${hasInsurance ? 'bg-green-100' : 'bg-amber-100'}`}>
              {hasInsurance ? (
                <Shield className="h-4 w-4 text-green-600" />
              ) : (
                <Shield className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <Badge variant="outline" className={`flex items-center gap-1 ${hasInsurance ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
              {hasInsurance ? (
                <>
                  <span>Insured</span>
                  {coverLevel !== 'Not specified' && <span>• {coverLevel}</span>}
                </>
              ) : (
                <span>Not Insured</span>
              )}
            </Badge>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FreelancerProfileHeader;
