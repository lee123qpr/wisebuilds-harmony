
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import TrustedPartners from '@/components/home/TrustedPartners';
import HowItWorks from '@/components/home/HowItWorks';
import UserSegments from '@/components/home/UserSegments';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Trusted Partners Section */}
      <TrustedPartners />

      {/* How It Works Section */}
      <HowItWorks />

      {/* For Businesses & Freelancers */}
      <UserSegments />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
