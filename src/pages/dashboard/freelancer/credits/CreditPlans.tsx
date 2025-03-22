
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditPlan } from '@/hooks/credits/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreditPlansProps {
  plans: CreditPlan[] | undefined;
  onPurchase: (planId: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

const CreditPlans: React.FC<CreditPlansProps> = ({ 
  plans, 
  onPurchase, 
  isLoading,
  onRefresh
}) => {
  const formatPrice = (price: number) => {
    // Convert from pence/cents to pounds/dollars
    const formattedPrice = (price / 100).toFixed(2);
    return `£${formattedPrice}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-16 w-full" />
            </CardHeader>
            <CardContent className="py-4">
              <Skeleton className="h-12 w-24 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Unable to load credit plans. Please try again later.</span>
          <Button variant="outline" size="sm" onClick={onRefresh} className="ml-4">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className="bg-white shadow-md transition-shadow hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
            {plan.discount_percentage > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                Save {plan.discount_percentage}%
              </Badge>
            )}
          </CardHeader>
          <CardContent className="py-4">
            <div className="text-3xl font-bold mb-4">
              {formatPrice(plan.price)}
            </div>
            <p className="text-gray-600">
              {plan.credits} credits
              {plan.discount_percentage > 0 && (
                <span className="text-green-600 font-medium"> (Best value)</span>
              )}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onPurchase(plan.id)} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Purchase Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CreditPlans;
