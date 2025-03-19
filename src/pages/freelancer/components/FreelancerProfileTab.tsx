
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CheckCircle2, Mail, Phone, Calendar, Briefcase, MapPin, Link as LinkIcon } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';
import { format, parseISO } from 'date-fns';
import ProfileRatingStars from './ProfileRatingStars';

interface FreelancerProfileTabProps {
  profile: FreelancerProfile;
}

const FreelancerProfileTab: React.FC<FreelancerProfileTabProps> = ({ profile }) => {
  const getInitials = (name?: string) => {
    if (!name) return 'FL';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Recently joined';
    try {
      return format(parseISO(dateString), 'MMMM yyyy');
    } catch (e) {
      return 'Recently joined';
    }
  };

  const formatPreviousEmployers = () => {
    if (!profile.previous_employers || profile.previous_employers.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        {profile.previous_employers.map((employer, index) => (
          <div key={index} className="border p-3 rounded-md">
            <div className="font-medium">{employer.employerName}</div>
            <div className="text-sm">{employer.position}</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(employer.startDate), 'MMM yyyy')} - 
              {employer.current ? 
                ' Present' : 
                employer.endDate ? ` ${format(new Date(employer.endDate), 'MMM yyyy')}` : ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profile_photo} alt={profile.display_name} />
                <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col items-center gap-1">
                {profile.email_verified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Email Verified
                  </Badge>
                )}
                
                {profile.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    ID Verified
                  </Badge>
                )}
              </div>
              
              <div className="text-center">
                <ProfileRatingStars rating={profile.rating} reviewsCount={profile.reviews_count} />
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                Member since {formatMemberSince(profile.member_since)}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-1.5 flex-shrink-0" />
                {profile.jobs_completed || 0} jobs completed
              </div>
            </div>
            
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">{profile.display_name || 'Freelancer'}</h2>
                <p className="text-muted-foreground">{profile.job_title || 'Freelancer'}</p>
                
                {profile.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    {profile.location}
                  </div>
                )}
              </div>
              
              {profile.bio && (
                <div className="bg-slate-50 p-4 rounded-md mb-4">
                  <p className="font-medium mb-1">Bio:</p>
                  <p className="text-sm">{profile.bio}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="font-medium">Contact information:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${profile.email}`} className="text-sm text-blue-600 hover:underline">{profile.email}</a>
                    </div>
                  )}
                  
                  {profile.phone_number && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${profile.phone_number}`} className="text-sm text-blue-600 hover:underline">{profile.phone_number}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-md font-medium mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p>{profile.display_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profession</p>
                <p>{profile.job_title || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{profile.location || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-md font-medium mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p>{profile.phone_number || 'Not provided'}</p>
              </div>
              {profile.website && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Professional Details */}
          <div>
            <h3 className="text-md font-medium mb-3">Professional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.hourly_rate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
                  <p>{profile.hourly_rate}</p>
                </div>
              )}
              {profile.day_rate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Day Rate</p>
                  <p>{profile.day_rate}</p>
                </div>
              )}
              {profile.availability && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Availability</p>
                  <p>{profile.availability}</p>
                </div>
              )}
              {profile.experience && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p>{profile.experience}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Previous Employers */}
          {profile.previous_employers && profile.previous_employers.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-3">Previous Employers</h3>
              {formatPreviousEmployers()}
            </div>
          )}

          {/* Professional Indemnity Insurance */}
          {profile.indemnity_insurance && (
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-md font-medium mb-3">Professional Indemnity Insurance</h3>
              <p className="text-sm">
                {profile.indemnity_insurance.hasInsurance 
                  ? `Insured - Coverage: ${profile.indemnity_insurance.coverLevel || 'Not specified'}`
                  : 'Not insured'}
              </p>
            </div>
          )}
          
          {/* Qualifications and Accreditations */}
          {profile.qualifications && profile.qualifications.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-3">Qualifications</h3>
              <ul className="list-disc pl-5 space-y-1">
                {profile.qualifications.map((qualification, index) => (
                  <li key={index} className="text-sm">{qualification}</li>
                ))}
              </ul>
            </div>
          )}
          
          {profile.accreditations && profile.accreditations.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-3">Accreditations</h3>
              <div className="flex flex-wrap gap-2">
                {profile.accreditations.map((accreditation, index) => (
                  <Badge key={index} variant="outline">{accreditation}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelancerProfileTab;
