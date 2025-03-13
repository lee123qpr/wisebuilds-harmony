import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Check, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/components/projects/useProjects';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { filterLocations, Location, Badge } from '@/utils/locationService';

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().min(1, 'Location is required'),
  work_type: z.string(),
  duration: z.string(),
  budget: z.string(),
  requires_insurance: z.boolean().default(false),
  requires_site_visits: z.boolean().default(false),
  requires_equipment: z.boolean().default(false),
  start_date: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const EditProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  
  const [locationInputValue, setLocationInputValue] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  useEffect(() => {
    setFilteredLocations(filterLocations(locationInputValue));
  }, [locationInputValue]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      role: '',
      location: '',
      work_type: 'remote',
      duration: 'less_than_1_week',
      budget: 'less_than_1000',
      requires_insurance: false,
      requires_site_visits: false,
      requires_equipment: false,
      start_date: '',
    },
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        const projectWithDocuments = {
          ...data,
          documents: Array.isArray(data.documents) 
            ? data.documents 
            : (data.documents ? JSON.parse(String(data.documents)) : [])
        } as Project;
        
        setProject(projectWithDocuments);
        
        form.reset({
          title: projectWithDocuments.title,
          description: projectWithDocuments.description,
          role: projectWithDocuments.role,
          location: projectWithDocuments.location,
          work_type: projectWithDocuments.work_type,
          duration: projectWithDocuments.duration,
          budget: projectWithDocuments.budget,
          requires_insurance: projectWithDocuments.requires_insurance,
          requires_site_visits: projectWithDocuments.requires_site_visits,
          requires_equipment: projectWithDocuments.requires_equipment,
          start_date: projectWithDocuments.start_date ? new Date(projectWithDocuments.start_date).toISOString().split('T')[0] : undefined,
        });
      } catch (error: any) {
        console.error('Error fetching project:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching project',
          description: error.message || 'Failed to fetch project details'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setSubmitting(true);
      
      if (!projectId) {
        throw new Error('Project ID is missing');
      }
      
      const { error } = await supabase
        .from('projects')
        .update({
          title: values.title,
          description: values.description,
          role: values.role,
          location: values.location,
          work_type: values.work_type,
          duration: values.duration,
          budget: values.budget,
          requires_insurance: values.requires_insurance,
          requires_site_visits: values.requires_site_visits,
          requires_equipment: values.requires_equipment,
          start_date: values.start_date ? new Date(values.start_date).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: 'Project updated',
        description: 'The project has been updated successfully.',
      });
      
      navigate(`/project/${projectId}`);
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating project',
        description: error.message || 'Failed to update project',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/project/${projectId}`)}
            disabled={submitting}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Project</h1>
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Update your project details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter project title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your project in detail" 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role Required</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="architect">Architect</SelectItem>
                                  <SelectItem value="structural_engineer">Structural Engineer</SelectItem>
                                  <SelectItem value="quantity_surveyor">Quantity Surveyor</SelectItem>
                                  <SelectItem value="project_manager">Project Manager</SelectItem>
                                  <SelectItem value="interior_designer">Interior Designer</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Location</FormLabel>
                            <Popover 
                              open={locationPopoverOpen} 
                              onOpenChange={setLocationPopoverOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={locationPopoverOpen}
                                    className="w-full justify-between"
                                  >
                                    {field.value || "Select location..."}
                                    <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                  <CommandInput 
                                    placeholder="Search UK/Ireland location..." 
                                    value={locationInputValue}
                                    onValueChange={setLocationInputValue}
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>No location found.</CommandEmpty>
                                    {Object.entries(
                                      filteredLocations.reduce((groups, location) => {
                                        const country = location.country;
                                        if (!groups[country]) {
                                          groups[country] = [];
                                        }
                                        groups[country].push(location);
                                        return groups;
                                      }, {} as Record<string, Location[]>)
                                    ).map(([country, locations]) => (
                                      <CommandGroup key={country} heading={country}>
                                        {locations.map((location) => (
                                          <CommandItem
                                            key={`${location.name}-${location.country}`}
                                            value={location.name}
                                            onSelect={(value) => {
                                              field.onChange(value);
                                              setLocationInputValue("");
                                              setLocationPopoverOpen(false);
                                            }}
                                          >
                                            <span>{location.name}</span>
                                            {location.region && (
                                              <Badge variant="outline" className="ml-2 text-xs">
                                                {location.region}
                                              </Badge>
                                            )}
                                            {field.value === location.name && (
                                              <Check className="ml-auto h-4 w-4" />
                                            )}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="work_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Type</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select work type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="remote">Remote</SelectItem>
                                  <SelectItem value="onsite">Onsite</SelectItem>
                                  <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="less_than_1_week">Less than 1 week</SelectItem>
                                  <SelectItem value="1_to_2_weeks">1-2 weeks</SelectItem>
                                  <SelectItem value="2_to_4_weeks">2-4 weeks</SelectItem>
                                  <SelectItem value="1_to_3_months">1-3 months</SelectItem>
                                  <SelectItem value="3_to_6_months">3-6 months</SelectItem>
                                  <SelectItem value="6_weeks_plus">6+ weeks</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
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
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="less_than_1000">Less than £1,000</SelectItem>
                                  <SelectItem value="1000_to_5000">£1,000 - £5,000</SelectItem>
                                  <SelectItem value="5000_to_10000">£5,000 - £10,000</SelectItem>
                                  <SelectItem value="10000_plus">£10,000+</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4 mt-4">
                      <h3 className="text-sm font-medium">Requirements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="requires_insurance"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Requires Insurance</FormLabel>
                                <FormDescription>
                                  Professional indemnity insurance
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="requires_site_visits"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Site Visits</FormLabel>
                                <FormDescription>
                                  Requires on-site presence
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="requires_equipment"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Equipment</FormLabel>
                                <FormDescription>
                                  Special equipment needed
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate(`/project/${projectId}`)}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </MainLayout>
  );
};

export default EditProject;
