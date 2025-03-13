import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, CalendarIcon, Upload, X, FileText, FileImage } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const roleOptions = [
  { value: 'quantity_surveyor', label: 'Quantity Surveyor' },
  { value: 'estimator', label: 'Estimator' },
  { value: 'planner', label: 'Planner' },
  { value: 'cad_engineer', label: 'CAD Engineer' },
  { value: 'architect', label: 'Architect' }
];

const workTypeOptions = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' }
];

const durationOptions = [
  { value: '1_day', label: '1 day' },
  { value: '3_days', label: '3 days' },
  { value: '1_week', label: '1 week' },
  { value: '2_weeks', label: '2 weeks' },
  { value: '3_weeks', label: '3 weeks' },
  { value: '4_weeks', label: '4 weeks' },
  { value: '5_weeks', label: '5 weeks' },
  { value: '6_weeks_plus', label: '6 weeks+' }
];

const budgetOptions = [
  { value: '0-500', label: '£0-£500' },
  { value: '500-1000', label: '£500-£1,000' },
  { value: '1000-2500', label: '£1,000-£2,500' },
  { value: '2500-5000', label: '£2,500-£5,000' },
  { value: '5000-10000', label: '£5,000-£10,000' },
  { value: '10000_plus', label: '£10,000+' }
];

const hiringStatusOptions = [
  { value: 'enquiring', label: 'Just enquiring' },
  { value: 'ready', label: 'Ready to hire' },
  { value: 'urgent', label: 'Urgent' }
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf', // PDF
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/msword', // DOC
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'application/vnd.ms-excel', // XLS
  'image/jpeg', // JPG/JPEG
  'image/png', // PNG
  'application/acad', // DWG
  'image/vnd.dwg', // DWG alternative
  'application/dwg', // DWG alternative
  'application/x-dwg' // DWG alternative
];

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  role: z.string().min(1, 'Role is required'),
  requiresInsurance: z.boolean().default(false),
  location: z.string().min(3, 'Location is required'),
  workType: z.string().min(1, 'Work type is required'),
  duration: z.string().min(1, 'Duration is required'),
  budget: z.string().min(1, 'Budget is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  hiringStatus: z.string().min(1, 'Hiring status is required'),
  requiresSiteVisits: z.boolean().default(false),
  requiresEquipment: z.boolean().default(false),
  documents: z.any().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const NewProjectDialog = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      role: '',
      requiresInsurance: false,
      location: '',
      workType: '',
      duration: '',
      budget: '',
      hiringStatus: '',
      requiresSiteVisits: false,
      requiresEquipment: false,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    let hasInvalidFile = false;
    let errorMessage = '';

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        hasInvalidFile = true;
        errorMessage = `File ${file.name} exceeds the 10MB limit`;
        return;
      }

      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        hasInvalidFile = true;
        errorMessage = `File ${file.name} is not a supported file type`;
        return;
      }

      newFiles.push(file);
    });

    if (hasInvalidFile) {
      toast({
        variant: 'destructive',
        title: 'Invalid file',
        description: errorMessage,
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const uploadFilesToSupabase = async () => {
    if (!user || selectedFiles.length === 0) return [];
    
    const uploadPromises = selectedFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      return {
        path: data.path,
        name: file.name,
        size: file.size,
        type: file.type
      };
    });
    
    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsUploading(true);
      console.log('Creating new project:', data);
      if (!user) {
        throw new Error('You must be logged in to create a project');
      }

      // Upload files first
      let documentReferences = [];
      try {
        documentReferences = await uploadFilesToSupabase();
      } catch (uploadError) {
        console.error('Error uploading files:', uploadError);
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: 'Failed to upload project documents. Please try again.',
        });
        setIsUploading(false);
        return;
      }

      const projectData = {
        user_id: user.id,
        title: data.title,
        description: data.description,
        role: data.role,
        requires_insurance: data.requiresInsurance,
        location: data.location,
        work_type: data.workType,
        duration: data.duration,
        budget: data.budget,
        start_date: data.startDate.toISOString(),
        hiring_status: data.hiringStatus,
        requires_site_visits: data.requiresSiteVisits,
        requires_equipment: data.requiresEquipment,
        status: 'active',
        documents: documentReferences.length > 0 ? documentReferences : null
      };

      const { error } = await supabase
        .from('projects')
        .insert(projectData);

      if (error) {
        throw error;
      }
      
      toast({
        title: 'Project created',
        description: 'Your project was successfully posted.',
      });
      
      form.reset();
      setSelectedFiles([]);
      setOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create project. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Post New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to post a new construction project.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Commercial Building Renovation" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear and specific title for the position
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed overview of the project" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed overview of what the project entails
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Required</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select required role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify the professional role needed for this project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requiresInsurance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Professional Indemnity Insurance Required</FormLabel>
                    <FormDescription>
                      Check if professional indemnity insurance is required for this project
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., London" {...field} />
                  </FormControl>
                  <FormDescription>
                    Where the work will be performed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How the work will be performed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {budgetOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Preferred Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When you would like the project to start
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hiringStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hiring Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hiring status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hiringStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your current hiring intention
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <FormLabel>Specific Requirements</FormLabel>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="requiresSiteVisits"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Requires Site Visits</FormLabel>
                        <FormDescription>
                          Check if availability for site visits is required
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresEquipment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Equipment Needed</FormLabel>
                        <FormDescription>
                          Check if specific equipment is needed for this project
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Documents</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOCX, DWG, JPG, PNG, XLSX (MAX. 10MB)</p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf,.docx,.doc,.dwg,.jpg,.jpeg,.png,.xlsx,.xls"
                          />
                        </label>
                      </div>
                      
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Selected files:</p>
                          <ul className="space-y-2">
                            {selectedFiles.map((file, index) => (
                              <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center space-x-2">
                                  {getFileIcon(file.type)}
                                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload key project documents here
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isUploading || form.formState.isSubmitting}>
                {isUploading || form.formState.isSubmitting ? 
                  "Creating..." : 
                  "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
