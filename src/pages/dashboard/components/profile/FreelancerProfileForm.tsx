
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { freelancerProfileSchema } from './freelancerSchema';
import * as z from 'zod';
import FreelancerBasicInfoFields from './form/FreelancerBasicInfoFields';
import FreelancerContactFields from './form/FreelancerContactFields';
import FreelancerWorkDetailsFields from './form/FreelancerWorkDetailsFields';
import FreelancerBioField from './form/FreelancerBioField';

type FreelancerProfileFormProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerProfileForm: React.FC<FreelancerProfileFormProps> = ({ form, disabled = false }) => {
  return (
    <div className="space-y-4">
      <FreelancerBasicInfoFields form={form} disabled={disabled} />
      <FreelancerContactFields form={form} disabled={disabled} />
      <FreelancerWorkDetailsFields form={form} disabled={disabled} />
      <FreelancerBioField form={form} disabled={disabled} />
    </div>
  );
};

export default FreelancerProfileForm;
