
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';
import ContactMap from '@/components/contact/ContactMap';

const Contact = () => {
  return (
    <MainLayout>
      <div className="py-12 bg-bw-off-white">
        <div className="container px-4 mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-logo-dark-blue">Contact Us</h1>
            <p className="text-xl text-bw-gray-medium max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help. Reach out to our team using any of the methods below.
            </p>
          </div>
          
          {/* Contact Information and Form */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <ContactInfo />
            <ContactForm />
          </div>
          
          {/* Map */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ContactMap />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
