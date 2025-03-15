
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CreditBalanceCardProps {
  creditBalance: number | null;
  isLoading: boolean;
}

const CreditBalanceCard = ({ creditBalance, isLoading }: CreditBalanceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span>Credit Balance</span>
        </CardTitle>
        <CardDescription>
          Use credits to contact clients or apply for projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{creditBalance || 0}</span>
            <span className="ml-2 text-gray-500">credits</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate('/dashboard/freelancer/credits')}
          className="w-full"
        >
          Buy More Credits
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreditBalanceCard;
