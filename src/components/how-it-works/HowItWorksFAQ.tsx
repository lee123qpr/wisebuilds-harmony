
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowItWorksFAQ = () => {
  const faqs = [
    {
      question: "How does BuildWise verify professionals?",
      answer: "We conduct thorough verification checks including qualification verification, identity checks, work history validation, and insurance coverage confirmation. Our multi-step process ensures that only qualified and reliable professionals can offer services through our platform."
    },
    {
      question: "What does it cost to use BuildWise?",
      answer: "For businesses, posting projects is completely free. You only pay when you hire a professional. For construction professionals, creating a profile is free. A credit-based system applies when accessing project contact details, with various affordable packages available."
    },
    {
      question: "How long does it take to find a professional?",
      answer: "Most businesses receive their first applications within 24-48 hours of posting a project. The time to hire depends on project complexity and specific requirements, but our matching system accelerates the process significantly compared to traditional hiring methods."
    },
    {
      question: "Can I hire professionals for both short and long-term projects?",
      answer: "Absolutely. BuildWise supports projects of all durations, from one-day tasks to multi-month contracts. You can specify project duration when posting, and our matching system will connect you with professionals available for your required timeframe."
    },
    {
      question: "What types of construction professionals can I find on BuildWise?",
      answer: "Our platform features a wide range of construction professionals including architects, engineers, project managers, quantity surveyors, site managers, tradespeople, and more. Whatever your construction project needs, you'll find qualified experts on BuildWise."
    },
    {
      question: "How do payments work?",
      answer: "BuildWise facilitates the connection between businesses and professionals. Payment terms are agreed upon directly between both parties. We provide secure messaging and document sharing to help formalize agreements, but we don't process project payments."
    }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 mr-2 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Frequently Asked Questions</h2>
          </div>
          <p className="text-lg text-bw-gray-medium max-w-3xl mx-auto">
            Find answers to common questions about how BuildWise UK works
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-bw-gray-medium">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default HowItWorksFAQ;
