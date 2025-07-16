import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface NewProjectSheetProps {
  children?: React.ReactNode;
}

export function NewProjectSheet({ children }: NewProjectSheetProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    client: user?.user_metadata?.company || "ING BANK",
    description: "",
    dueDate: undefined as Date | undefined,
  });
  const { toast } = useToast();
  const { createProject } = useProjects();

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

    try {
      const projectData = {
        name: formData.name,
        type: formData.type,
        client: formData.client,
        status: "project initiation" as const,
        due_date: formData.dueDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      };

      const newProject = await createProject(projectData);
      
      if (newProject) {
        toast({
          title: "Project Created",
          description: `${formData.name} has been created successfully.`,
        });

        // Reset form and close sheet
        setFormData({
          name: "",
          type: "",
          client: user?.user_metadata?.company || "ING BANK",
          description: "",
          dueDate: undefined,
        });
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new packaging design project. Fill in the details below.
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
            <Label htmlFor="client">Client *</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => handleInputChange("client", e.target.value)}
              placeholder="e.g., Acme Corporation"
              required
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description including product information, dimensions, materials, target audience, and specific design requirements..."
              rows={4}
            />
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
            <Button type="submit" className="flex-1">
              Create Project
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}