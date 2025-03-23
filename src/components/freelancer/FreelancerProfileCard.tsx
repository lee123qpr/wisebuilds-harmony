
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Upload, Check, Loader2, Shield } from 'lucide-react';
import { format } from 'date-fns';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';
import { supabase } from '@/integrations/supabase/client';
import FreelancerMetadata from '@/components/freelancer/FreelancerMetadata';

interface InsuranceStatus {
  hasInsurance: boolean;
  coverLevel: string;
}

interface FreelancerProfileCardProps {
  profileImage: string | null;
  uploadingImage?: boolean;
  setUploadingImage?: (uploading: boolean) => void;
  setProfileImage?: (url: string | null) => void;
  fullName: string;
  profession: string | null;
  userId: string;
  memberSince?: string | null;
  emailVerified?: boolean;
  jobsCompleted?: number;
  idVerified?: boolean;
  rating?: number | null;
  reviewsCount?: number;
  location?: string | null;
  allowImageUpload?: boolean;
  compact?: boolean;
  insuranceStatus?: InsuranceStatus;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({
  profileImage,
  uploadingImage = false,
  setUploadingImage,
  setProfileImage,
  fullName,
  profession,
  userId,
  memberSince,
  emailVerified = false,
  jobsCompleted = 0,
  idVerified = false,
  rating,
  reviewsCount,
  location,
  allowImageUpload = false,
  compact = false,
  insuranceStatus
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowImageUpload || !setUploadingImage || !setProfileImage) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      
      // Create a filename with user ID to prevent conflicts
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `profile_photos/${fileName}`;
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) throw error;
      
      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Set the profile image URL
      setProfileImage(urlData.publicUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading profile image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`border shadow-md rounded-lg p-6 ${compact ? 'p-4' : 'p-6'}`}>
      <div className={`flex ${compact ? 'flex-row gap-3' : 'flex-col md:flex-row gap-6'} items-center md:items-start`}>
        <div className="relative">
          <Avatar className={`${compact ? 'h-16 w-16' : 'h-24 w-24'} border-2 border-primary/10`}>
            <AvatarImage src={profileImage || undefined} alt={fullName} className="object-cover" />
            <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
          </Avatar>
          
          {allowImageUpload && (
            <>
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="profile-picture"
                className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
              >
                {uploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </label>
            </>
          )}
        </div>
        
        <div className={`flex-1 ${compact ? '' : 'text-center md:text-left'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-bold`}>{fullName}</h2>
            {idVerified && <VerificationBadge type="id" status="verified" />}
          </div>
          
          {profession && (
            <p className="text-muted-foreground">{profession}</p>
          )}
          
          {/* Rating stars component */}
          <div className={`${compact ? 'mt-1' : 'mt-2'} flex justify-center md:justify-start`}>
            <ProfileRatingStars 
              userId={userId} 
              rating={rating} 
              reviewsCount={reviewsCount} 
              showEmpty={true} 
            />
          </div>
          
          {/* Show freelancer metadata */}
          {!compact && (
            <div className="mt-4">
              <FreelancerMetadata 
                profile={{
                  id: userId,
                  member_since: memberSince,
                  jobs_completed: jobsCompleted,
                  location: location
                }} 
                compact={false}
              />
            </div>
          )}
          
          {/* Only show badges in full mode */}
          {!compact && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {memberSince && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Member since {format(new Date(memberSince), 'MMM yyyy')}
                </Badge>
              )}
              
              {emailVerified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Email verified
                </Badge>
              )}
              
              <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                <Check className="h-3 w-3" />
                {jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed
              </Badge>
              
              {/* Insurance Badge */}
              {insuranceStatus && (
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${
                    insuranceStatus.hasInsurance 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <Shield className={`h-3 w-3 ${
                    insuranceStatus.hasInsurance 
                      ? 'text-green-600' 
                      : 'text-amber-600'
                  }`} />
                  {insuranceStatus.hasInsurance ? (
                    <>
                      Insured
                      {insuranceStatus.coverLevel !== 'Not specified' && 
                        <span>• {insuranceStatus.coverLevel}</span>
                      }
                    </>
                  ) : (
                    <span>Not Insured</span>
                  )}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileCard;
