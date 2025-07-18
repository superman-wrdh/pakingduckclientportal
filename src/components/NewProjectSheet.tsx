import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DesignSection } from "./projects/DesignSection";

interface NewProjectSheetProps {
  children?: React.ReactNode;
}

interface Design {
  name: string;
  description: string;
  attachments: File[];
}

export function NewProjectSheet({ children }: NewProjectSheetProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    client: user?.user_metadata?.company || "ING BANK",
    dueDate: undefined as Date | undefined,
  });
  const [designs, setDesigns] = useState<Design[]>([
    { name: "Design 1", description: "", attachments: [] }
  ]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { createProject } = useProjects();

  // Update form data when user metadata changes
  useEffect(() => {
    if (user?.user_metadata?.company) {
      setFormData(prev => ({
        ...prev,
        client: user.user_metadata.company
      }));
    }
  }, [user?.user_metadata?.company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.type || !formData.client) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate that at least one design has a name
    const validDesigns = designs.filter(design => design.name.trim() !== "");
    if (validDesigns.length === 0) {
      toast({
        title: "Missing Design Information",
        description: "Please add at least one design with a name.",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      
      const projectData = {
        name: formData.name,
        type: formData.type,
        client: formData.client,
        status: "project initiation" as const,
        due_date: formData.dueDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        description: `Project contains ${validDesigns.length} design(s)`,
      };

      const newProject = await createProject(projectData);
      
      if (newProject) {
        // Create design versions for each design
        for (let i = 0; i < validDesigns.length; i++) {
          const design = validDesigns[i];
          
          // Create design version
          const { data: designVersion, error: designError } = await supabase
            .from('design_versions')
            .insert({
              project_id: newProject.id,
              name: design.name,
              description: design.description || null,
              version_number: i + 1,
              is_latest: true,
              user_id: user?.id
            })
            .select()
            .single();

          if (designError) {
            console.error('Error creating design version:', designError);
            continue;
          }

          // Upload attachments for this design
          if (design.attachments.length > 0) {
            for (const file of design.attachments) {
              const fileName = `${newProject.id}/designs/${designVersion.id}/${Date.now()}-${file.name}`;
              
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('project-files')
                .upload(fileName, file);

              if (uploadError) {
                console.error('Upload error:', uploadError);
                continue;
              }

              // Get the public URL
              const { data: { publicUrl } } = supabase.storage
                .from('project-files')
                .getPublicUrl(fileName);

              // Save file metadata to version_files table
              const { error: dbError } = await supabase
                .from('version_files')
                .insert({
                  version_id: designVersion.id,
                  file_name: file.name,
                  file_size: file.size,
                  file_type: file.type,
                  file_url: publicUrl,
                  user_id: user?.id
                });

              if (dbError) {
                console.error('Database error:', dbError);
              }
            }
          }
        }
        
        toast({
          title: "Project Created",
          description: `${formData.name} has been created successfully with ${validDesigns.length} design(s).`,
        });

        // Reset form and close sheet
        setFormData({
          name: "",
          type: "",
          client: user?.user_metadata?.company || "ING BANK",
          dueDate: undefined,
        });
        setDesigns([{ name: "Design 1", description: "", attachments: [] }]);
        setOpen(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addDesign = () => {
    setDesigns(prev => [...prev, { name: `Design ${prev.length + 1}`, description: "", attachments: [] }]);
  };

  const removeDesign = (index: number) => {
    setDesigns(prev => prev.filter((_, i) => i !== index));
  };

  const updateDesign = (index: number, design: Design) => {
    setDesigns(prev => prev.map((d, i) => i === index ? design : d));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new packaging design project with multiple designs.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Organic Tea Collection"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Input
              id="client"
              value={formData.client}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Project Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Designs</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDesign}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Design
              </Button>
            </div>
            
            <div className="space-y-4">
              {designs.map((design, index) => (
                <DesignSection
                  key={index}
                  design={design}
                  onUpdate={(updatedDesign) => updateDesign(index, updatedDesign)}
                  onRemove={() => removeDesign(index)}
                  canRemove={designs.length > 1}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => handleInputChange("dueDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={uploading}>
              {uploading ? "Creating..." : "Create Project"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}