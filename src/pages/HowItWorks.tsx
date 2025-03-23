
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HowItWorksHero from '@/components/how-it-works/HowItWorksHero';
import FreelancerSteps from '@/components/how-it-works/FreelancerSteps';
import ClientSteps from '@/components/how-it-works/ClientSteps';
import FreelancerClientTabs from '@/components/how-it-works/FreelancerClientTabs';
import HowItWorksFAQ from '@/components/how-it-works/HowItWorksFAQ';
import CallToAction from '@/components/how-it-works/CallToAction';
import { Separator } from '@/components/ui/separator';

const HowItWorks = () => {
  return (
    <MainLayout>
      <HowItWorksHero />
      <FreelancerClientTabs />
      <Separator className="max-w-4xl mx-auto my-12" />
      <FreelancerSteps />
      <Separator className="max-w-4xl mx-auto my-12" />
      <ClientSteps />
      <Separator className="max-w-4xl mx-auto my-12" />
      <HowItWorksFAQ />
      <CallToAction />
    </MainLayout>
  );
};

export default HowItWorks;
