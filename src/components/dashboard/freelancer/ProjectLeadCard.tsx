
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePurchaseLead } from '@/hooks/usePurchaseLead';
import { Loader2 } from 'lucide-react';

interface ProjectLead {
  id: string;
  title: string;
  description: string;
  budget: string;
  role: string;
  created_at: string;
  location: string;
  tags?: string[];
}

interface ProjectLeadCardProps {
  lead: ProjectLead;
}

const ProjectLeadCard: React.FC<ProjectLeadCardProps> = ({ lead }) => {
  const navigate = useNavigate();
  const { purchaseLead, isPurchasing } = usePurchaseLead();

  const handlePurchase = async () => {
    const success = await purchaseLead(lead.id, lead.title);
    if (success) {
      navigate('/dashboard/freelancer/applications');
    }
  };

  const handleView = () => {
    navigate(`/project/${lead.id}`);
  };

  return (
    <Card key={lead.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{lead.title}</CardTitle>
          <div className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
            New Lead
          </div>
        </div>
        <CardDescription>
          {new Date(lead.created_at).toLocaleDateString()} · {lead.budget}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 line-clamp-3">{lead.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-muted text-xs px-2 py-1 rounded-full">{lead.role}</span>
          <span className="bg-muted text-xs px-2 py-1 rounded-full">{lead.location}</span>
          {lead.tags?.map((tag, i) => (
            <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleView}>
            View Details
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handlePurchase}
            disabled={isPurchasing}
          >
            {isPurchasing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Purchase Lead
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectLeadCard;
