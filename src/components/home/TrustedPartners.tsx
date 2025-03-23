
import React from 'react';

const TrustedPartners = () => {
  const partners = [
    { name: "Barratt Developments", logo: "/partners/barratt.svg" },
    { name: "Kier Group", logo: "/partners/kier.svg" },
    { name: "Balfour Beatty", logo: "/partners/balfour.svg" },
    { name: "Taylor Wimpey", logo: "/partners/taylor-wimpey.svg" },
    { name: "Morgan Sindall", logo: "/partners/morgan-sindall.svg" },
    { name: "Laing O'Rourke", logo: "/partners/laing.svg" },
  ];
  
  return (
    <section className="py-8 bg-bw-off-white border-y border-bw-gray-light">
      <div className="container px-4 mx-auto">
        <p className="text-center text-bw-gray-medium text-sm font-medium uppercase tracking-wider mb-6">Trusted by Leading UK Construction Companies</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div key={index} className="grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="h-10 flex items-center justify-center">
                <img 
                  src={partner.logo}
                  alt={partner.name} 
                  className="max-h-full max-w-[120px]" 
                />
              </div>
              <p className="text-xs text-center mt-2 text-bw-gray-medium">{partner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;
