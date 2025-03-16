
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';
import { format } from 'date-fns';

type FreelancerPreviousEmployersFieldProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

type Employer = {
  employerName: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  position: string;
};

const FreelancerPreviousEmployersField: React.FC<FreelancerPreviousEmployersFieldProps> = ({ form, disabled = false }) => {
  const [newEmployer, setNewEmployer] = useState<Employer>({
    employerName: '',
    startDate: new Date(),
    endDate: null,
    current: false,
    position: '',
  });

  const previousEmployers = form.watch('previousEmployers') || [];

  const handleAddEmployer = () => {
    if (!newEmployer.employerName || !newEmployer.position) return;
    
    // Ensure we have a valid startDate
    if (!newEmployer.startDate) {
      newEmployer.startDate = new Date();
    }
    
    const updatedEmployers = [...previousEmployers, newEmployer];
    form.setValue('previousEmployers', updatedEmployers, { shouldValidate: true });
    
    // Reset form
    setNewEmployer({
      employerName: '',
      startDate: new Date(),
      endDate: null,
      current: false,
      position: '',
    });
  };

  const handleRemoveEmployer = (index: number) => {
    const updatedEmployers = [...previousEmployers];
    updatedEmployers.splice(index, 1);
    form.setValue('previousEmployers', updatedEmployers, { shouldValidate: true });
  };

  const handleCurrentChange = (checked: boolean) => {
    setNewEmployer({
      ...newEmployer,
      current: checked,
      endDate: checked ? null : newEmployer.endDate,
    });
  };

  return (
    <FormField
      control={form.control}
      name="previousEmployers"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Previous Employers</FormLabel>
          <div className="space-y-4">
            {/* Display existing employers */}
            {previousEmployers.length > 0 && (
              <div className="space-y-3">
                {previousEmployers.map((employer, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="pt-4">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Employer</h4>
                            <p className="text-sm">{employer.employerName}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Position</h4>
                            <p className="text-sm">{employer.position}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Start Date</h4>
                            <p className="text-sm">{format(new Date(employer.startDate), 'PP')}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">End Date</h4>
                            <p className="text-sm">
                              {employer.current 
                                ? 'Current' 
                                : employer.endDate 
                                  ? format(new Date(employer.endDate), 'PP') 
                                  : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                      {!disabled && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveEmployer(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add new employer form */}
            {!disabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add New Employer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Employer Name</label>
                        <Input
                          value={newEmployer.employerName}
                          onChange={(e) => setNewEmployer({ ...newEmployer, employerName: e.target.value })}
                          placeholder="Enter employer name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Position</label>
                        <Input
                          value={newEmployer.position}
                          onChange={(e) => setNewEmployer({ ...newEmployer, position: e.target.value })}
                          placeholder="Your job title"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                !newEmployer.startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newEmployer.startDate ? (
                                format(newEmployer.startDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newEmployer.startDate}
                              onSelect={(date) => date && setNewEmployer({ ...newEmployer, startDate: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">End Date</label>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={newEmployer.current}
                              onCheckedChange={handleCurrentChange}
                            />
                            <span className="text-sm">Current position</span>
                          </div>
                        </div>
                        {!newEmployer.current && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal mt-1",
                                  !newEmployer.endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newEmployer.endDate ? (
                                  format(newEmployer.endDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newEmployer.endDate || undefined}
                                onSelect={(date) => setNewEmployer({ ...newEmployer, endDate: date })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="button" 
                    onClick={handleAddEmployer}
                    disabled={!newEmployer.employerName || !newEmployer.position}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employer
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          <FormDescription>
            Add your work history to showcase your experience
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FreelancerPreviousEmployersField;
