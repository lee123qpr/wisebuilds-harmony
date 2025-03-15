
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

type FreelancerSkillsFieldProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

// This is a temporary list - the user mentioned they will provide a complete list later
const SUGGESTED_SKILLS = [
  "Architectural Design",
  "Structural Engineering",
  "Project Management",
  "Building Information Modeling (BIM)",
  "AutoCAD",
  "Revit",
  "3D Rendering",
  "Sustainable Design",
  "Building Regulations",
  "Construction Documentation",
  "Cost Estimation",
  "Site Planning",
  "Urban Planning",
  "Interior Design",
  "Landscape Design"
];

const FreelancerSkillsField: React.FC<FreelancerSkillsFieldProps> = ({ form, disabled = false }) => {
  const [newSkill, setNewSkill] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = React.useState(SUGGESTED_SKILLS);

  const skills = form.watch('skills');
  const maxSkills = 6;

  const handleAddSkill = (skill: string) => {
    if (skills.length >= maxSkills) {
      return;
    }
    
    if (skill.trim() && !skills.includes(skill.trim())) {
      form.setValue('skills', [...skills, skill.trim()]);
      setNewSkill('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    form.setValue('skills', updatedSkills);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSkill(value);
    
    if (value.trim()) {
      const filtered = SUGGESTED_SKILLS.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="skills"
      render={() => (
        <FormItem>
          <FormLabel>Skills (Max 6)</FormLabel>
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={handleInputChange}
                  onFocus={() => newSkill.trim() && setShowSuggestions(true)}
                  disabled={disabled || skills.length >= maxSkills}
                  className="w-full"
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleAddSkill(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddSkill(newSkill)}
                disabled={disabled || !newSkill.trim() || skills.length >= maxSkills}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                  {skill}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {skills.length === 0 && (
                <span className="text-sm text-gray-500">No skills added yet</span>
              )}
            </div>
          </div>
          <FormDescription>
            Add up to 6 skills that showcase your expertise
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FreelancerSkillsField;
