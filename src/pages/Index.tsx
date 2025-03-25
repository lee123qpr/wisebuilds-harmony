
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import TrustedPartners from '@/components/home/TrustedPartners';
import HowItWorks from '@/components/home/HowItWorks';
import UserSegments from '@/components/home/UserSegments';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';

const Index = () => {
  // Add debug logging to verify component rendering
  useEffect(() => {
    console.log('Index page component mounted');
  }, []);
  
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

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
