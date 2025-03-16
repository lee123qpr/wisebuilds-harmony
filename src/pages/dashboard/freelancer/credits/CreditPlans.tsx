
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { CreditPlan } from '@/hooks/useCredits';

interface CreditPlansProps {
  plans: CreditPlan[] | undefined;
  onPurchase: (planId: string) => void;
  isLoading: boolean;
}

const CreditPlans = ({ plans, onPurchase, isLoading }: CreditPlansProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-36 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </CardContent>
            <CardFooter>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No credit plans available at the moment</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => {
        const priceInPounds = (plan.price / 100).toFixed(2);
        const isBestValue = plan.discount_percentage >= 20;
        
        return (
          <Card key={plan.id} className={`relative ${isBestValue ? 'border-blue-400 shadow-lg' : ''}`}>
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
                onClick={() => onPurchase(plan.id)}
                variant={isBestValue ? "default" : "outline"}
              >
                Purchase
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default CreditPlans;
