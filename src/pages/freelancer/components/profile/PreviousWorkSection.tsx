
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { FileText, Link, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PreviousWorkSectionProps {
  profile: FreelancerProfile;
}

const PreviousWorkSection: React.FC<PreviousWorkSectionProps> = ({ profile }) => {
  if (!profile.previous_work || 
      (Array.isArray(profile.previous_work) && profile.previous_work.length === 0)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          Examples of Previous Work
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {Array.isArray(profile.previous_work) && profile.previous_work.map((work, index) => {
            // Handle different formats of previous_work data
            if (typeof work === 'string') {
              return (
                <a 
                  key={index}
                  href={work}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded-md hover:bg-accent text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {work.split('/').pop() || 'Document'}
                </a>
              );
            } else if (typeof work === 'object' && work !== null) {
              return (
                <a 
                  key={index}
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 rounded-md hover:bg-accent text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {work.name || 'Document'}
                </a>
              );
            }
            return null;
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviousWorkSection;
