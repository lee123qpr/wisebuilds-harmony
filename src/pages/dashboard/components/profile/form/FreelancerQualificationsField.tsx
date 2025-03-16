
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

type FreelancerQualificationsFieldProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerQualificationsField: React.FC<FreelancerQualificationsFieldProps> = ({ form, disabled = false }) => {
  const [newQualification, setNewQualification] = React.useState('');
  const [newAccreditation, setNewAccreditation] = React.useState('');

  const qualifications = form.watch('qualifications');
  const accreditations = form.watch('accreditations');

  const handleAddQualification = () => {
    if (newQualification.trim() && !qualifications.includes(newQualification.trim())) {
      form.setValue('qualifications', [...qualifications, newQualification.trim()]);
      setNewQualification('');
    }
  };

  const handleRemoveQualification = (index: number) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    form.setValue('qualifications', updatedQualifications);
  };

  const handleAddAccreditation = () => {
    if (newAccreditation.trim() && !accreditations.includes(newAccreditation.trim())) {
      form.setValue('accreditations', [...accreditations, newAccreditation.trim()]);
      setNewAccreditation('');
    }
  };

  const handleRemoveAccreditation = (index: number) => {
    const updatedAccreditations = [...accreditations];
    updatedAccreditations.splice(index, 1);
    form.setValue('accreditations', updatedAccreditations);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="qualifications"
        render={() => (
          <FormItem>
            <FormLabel>Qualifications</FormLabel>
            <div className="flex flex-col space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a qualification"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  disabled={disabled}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddQualification}
                  disabled={disabled || !newQualification.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {qualifications.map((qualification, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                    {qualification}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQualification(index)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {qualifications.length === 0 && (
                  <span className="text-sm text-gray-500">No qualifications added yet</span>
                )}
              </div>
            </div>
            <FormDescription>
              Add your professional and educational qualifications
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accreditations"
        render={() => (
          <FormItem>
            <FormLabel>Accreditations</FormLabel>
            <div className="flex flex-col space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add an accreditation (e.g., MRICS, ICE, RIBA, CIOB)"
                  value={newAccreditation}
                  onChange={(e) => setNewAccreditation(e.target.value)}
                  disabled={disabled}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddAccreditation}
                  disabled={disabled || !newAccreditation.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {accreditations.map((accreditation, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                    {accreditation}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAccreditation(index)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {accreditations.length === 0 && (
                  <span className="text-sm text-gray-500">No accreditations added yet</span>
                )}
              </div>
            </div>
            <FormDescription>
              Add your professional accreditations (e.g., MRICS, ICE, RIBA, CIOB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FreelancerQualificationsField;
