
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from '@/components/ui/separator';

const CookiePolicy: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">
              This Cookie Policy explains how BuildWise UK ("we", "us", or "our") uses cookies and similar 
              technologies on our website. It explains what these technologies are and why we use them, 
              as well as your rights to control our use of them.
            </p>
            
            <Separator className="my-6" />
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">What are cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to the website owners.
              Cookies can be "persistent" or "session" cookies.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">How we use cookies</h2>
            <p>
              We use cookies for a variety of reasons, including to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Understand how you use our website</li>
              <li>Improve the way our website works</li>
              <li>Remember your preferences</li>
              <li>Measure the effectiveness of our marketing</li>
              <li>Enable certain functions on our website</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Types of cookies we use</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Necessary cookies</h3>
            <p>
              These cookies are essential for our website to function properly. They enable core functionality such as 
              security, network management, and account authentication. You may disable these by changing your browser 
              settings, but this may affect how the website functions.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Functional cookies</h3>
            <p>
              These cookies enable our website to provide enhanced functionality and personalization. They may be set 
              by us or by third-party providers whose services we have added to our pages.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Analytical cookies</h3>
            <p>
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance 
              of our website. They help us to know which pages are the most and least popular and see how visitors 
              move around the site.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Marketing cookies</h3>
            <p>
              These cookies are used to track visitors across websites. The intention is to display ads that are 
              relevant and engaging for the individual user and thereby more valuable for publishers and third-party 
              advertisers.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your cookie choices and how to opt-out</h2>
            <p>
              You can manage your cookie preferences at any time by clicking on the "Cookie Settings" button at 
              the bottom of our website. You can also control cookies through your browser settings.
            </p>
            <p className="mt-4">
              Most web browsers allow some control of most cookies through the browser settings. To find out more 
              about cookies, including how to see what cookies have been set, visit <a href="https://www.allaboutcookies.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to our Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use 
              or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy 
              regularly to stay informed about our use of cookies and related technologies.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: info@buildwiseuk.com<br />
              Phone: +44 20 3897 2233<br />
              Address: 71-75 Shelton Street, London WC2H 9JQ
            </p>
            
            <p className="mt-8 text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiePolicy;
