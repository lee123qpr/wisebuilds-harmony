
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateCardProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonAction?: () => void;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ 
  title, 
  description, 
  buttonText, 
  buttonAction 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {buttonText && buttonAction && (
          <Button onClick={buttonAction} className="w-full">
            {buttonText}
          </Button>
        )}
        {!buttonText && (
          <p className="text-center py-8 text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
