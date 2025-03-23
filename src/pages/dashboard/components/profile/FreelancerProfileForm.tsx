
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { freelancerProfileSchema } from './freelancerSchema';
import * as z from 'zod';
import FreelancerBasicInfoFields from './form/FreelancerBasicInfoFields';
import FreelancerContactFields from './form/FreelancerContactFields';
import FreelancerWorkDetailsFields from './form/FreelancerWorkDetailsFields';
import FreelancerBioField from './form/FreelancerBioField';
import FreelancerPreviousWorkField from './form/FreelancerPreviousWorkField';

type FreelancerProfileFormProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerProfileForm: React.FC<FreelancerProfileFormProps> = ({ form, disabled = false }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b">
          <div className="h-5 w-1 bg-primary rounded-full"></div>
          Basic Information
        </h3>
        <FreelancerBasicInfoFields form={form} disabled={disabled} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b">
          <div className="h-5 w-1 bg-primary rounded-full"></div>
          Contact Information
        </h3>
        <FreelancerContactFields form={form} disabled={disabled} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b">
          <div className="h-5 w-1 bg-primary rounded-full"></div>
          Professional Details
        </h3>
        <FreelancerWorkDetailsFields form={form} disabled={disabled} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b">
          <div className="h-5 w-1 bg-primary rounded-full"></div>
          Professional Bio
        </h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <FreelancerBioField form={form} disabled={disabled} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b">
          <div className="h-5 w-1 bg-primary rounded-full"></div>
          Previous Work Examples
        </h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <FreelancerPreviousWorkField form={form} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileForm;
