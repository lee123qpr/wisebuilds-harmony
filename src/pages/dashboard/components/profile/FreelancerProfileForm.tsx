
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { freelancerProfileSchema, FreelancerProfileData } from './freelancerSchema';
import * as z from 'zod';
import FreelancerBasicInfoFields from './form/FreelancerBasicInfoFields';
import FreelancerContactFields from './form/FreelancerContactFields';
import FreelancerWorkDetailsFields from './form/FreelancerWorkDetailsFields';
import FreelancerBioField from './form/FreelancerBioField';
import FreelancerPreviousWorkField from './form/FreelancerPreviousWorkField';

type FreelancerProfileFormProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
  initialValues?: FreelancerProfileData;
  isLoading?: boolean;
  onSubmitForm?: (values: FreelancerProfileData) => Promise<boolean>;
};

const FreelancerProfileForm: React.FC<FreelancerProfileFormProps> = ({ 
  form, 
  disabled = false,
  initialValues,
  isLoading,
  onSubmitForm
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <FreelancerBasicInfoFields form={form} disabled={disabled} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <FreelancerContactFields form={form} disabled={disabled} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Details</h3>
        <FreelancerWorkDetailsFields form={form} disabled={disabled} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Bio</h3>
        <FreelancerBioField form={form} disabled={disabled} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Previous Work Examples</h3>
        <FreelancerPreviousWorkField form={form} disabled={disabled} />
      </div>
    </div>
  );
};

export default FreelancerProfileForm;
