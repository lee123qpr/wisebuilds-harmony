
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { CreditPlan } from '@/hooks/useCredits';
import { Skeleton } from '@/components/ui/skeleton';

interface CreditPlansProps {
  plans: CreditPlan[] | undefined;
  onPurchase: (planId: string) => void;
  isLoading: boolean;
  onRefresh?: () => void;
}

const CreditPlans = ({ plans, onPurchase, isLoading, onRefresh }: CreditPlansProps) => {
  const [purchasingPlanId, setPurchasingPlanId] = useState<string | null>(null);
  
  const handlePurchase = (planId: string) => {
    setPurchasingPlanId(planId);
    onPurchase(planId);
  };
  
  // Reset the purchasing state if we're no longer loading
  React.useEffect(() => {
    if (!isLoading && purchasingPlanId) {
      setPurchasingPlanId(null);
    }
  }, [isLoading]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
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
      <Card className="col-span-full bg-white">
        <CardContent className="pt-6 flex flex-col items-center justify-center p-10 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Credit Plans Available</h3>
          <p className="text-gray-500 mb-4">We couldn't find any active credit plans at the moment.</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Plans
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => {
        const priceInPounds = (plan.price / 100).toFixed(2);
        const isBestValue = plan.discount_percentage >= 20;
        const isPurchasing = purchasingPlanId === plan.id;
        
        return (
          <Card key={plan.id} className={`relative bg-white ${isBestValue ? 'border-blue-400 shadow-lg' : ''}`}>
            {isBestValue && (
              <div className="absolute -top-3 -right-3">
                <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Best Value
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>
                {plan.discount_percentage > 0 ? (
                  <span>Save {plan.discount_percentage}%</span>
                ) : (
                  <span>Starter package</span>
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">£{priceInPounds}</span>
                <span className="text-gray-500"> / {plan.credits} credits</span>
              </div>
              
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{plan.credits} credits to use</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Apply to projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Contact clients directly</span>
                </li>
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePurchase(plan.id)}
                variant={isBestValue ? "default" : "outline"}
                disabled={isLoading || !!purchasingPlanId}
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Purchase'
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default CreditPlans;
