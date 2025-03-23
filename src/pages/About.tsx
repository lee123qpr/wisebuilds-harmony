
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AboutHero from '@/components/about/AboutHero';
import WhoWeAre from '@/components/about/WhoWeAre';
import OurStory from '@/components/about/OurStory';
import OurMission from '@/components/about/OurMission';
import WhyUseUs from '@/components/about/WhyUseUs';
import OurValues from '@/components/about/OurValues';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <MainLayout>
      <AboutHero />
      <WhoWeAre />
      <Separator className="max-w-4xl mx-auto my-12" />
      <OurStory />
      <Separator className="max-w-4xl mx-auto my-12" />
      <OurMission />
      <Separator className="max-w-4xl mx-auto my-12" />
      <WhyUseUs />
      <Separator className="max-w-4xl mx-auto my-12" />
      <OurValues />
    </MainLayout>
  );
};

export default About;
