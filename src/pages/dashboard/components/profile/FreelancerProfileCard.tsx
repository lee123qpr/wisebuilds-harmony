
import React from 'react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Upload, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import VerificationBadge from '@/components/dashboard/freelancer/VerificationBadge';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';
import { supabase } from '@/integrations/supabase/client';

interface FreelancerProfileCardProps {
  profileImage: string | null;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
  setProfileImage: (url: string | null) => void;
  fullName: string;
  profession: string;
  userId: string;
  memberSince: string | null;
  emailVerified: boolean;
  jobsCompleted: number;
  idVerified: boolean;
  rating?: number | null;
  reviewsCount?: number;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({
  profileImage,
  uploadingImage,
  setUploadingImage,
  setProfileImage,
  fullName,
  profession,
  userId,
  memberSince,
  emailVerified,
  jobsCompleted,
  idVerified,
  rating,
  reviewsCount
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <Card className="border shadow-md">
      <CardContent className="pt-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary/10">
            <AvatarImage src={profileImage || undefined} alt={fullName} className="object-cover" />
            <AvatarFallback className="text-xl">
              {fullName.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
          </Avatar>
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
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <h2 className="text-xl font-bold">{fullName}</h2>
            {idVerified && <VerificationBadge status="verified" />}
          </div>
          <p className="text-muted-foreground">{profession}</p>
          
          {/* Add rating stars component */}
          <div className="mt-2 flex justify-center md:justify-start">
            <ProfileRatingStars 
              userId={userId} 
              rating={rating} 
              reviewsCount={reviewsCount} 
              showEmpty={true} 
            />
          </div>
          
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileCard;
