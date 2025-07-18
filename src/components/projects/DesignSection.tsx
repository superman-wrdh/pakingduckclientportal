import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, FileText, Trash2 } from "lucide-react";

interface DesignSectionProps {
  design: {
    name: string;
    description: string;
    attachments: File[];
  };
  onUpdate: (design: { name: string; description: string; attachments: File[] }) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function DesignSection({ design, onUpdate, onRemove, canRemove }: DesignSectionProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onUpdate({
      ...design,
      attachments: [...design.attachments, ...files]
    });
  };

  const removeAttachment = (index: number) => {
    onUpdate({
      ...design,
      attachments: design.attachments.filter((_, i) => i !== index)
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Design</Label>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="design-name">Design Name *</Label>
        <Input
          id="design-name"
          value={design.name}
          onChange={(e) => onUpdate({ ...design, name: e.target.value })}
          placeholder="e.g., Main Package Design"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="design-description">Design Description</Label>
        <Textarea
          id="design-description"
          value={design.description}
          onChange={(e) => onUpdate({ ...design, description: e.target.value })}
          placeholder="Describe the design requirements, dimensions, materials, target audience..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Attachments</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-4">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <div className="space-y-1">
              <Label htmlFor={`file-upload-${design.name}`} className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80">
                Click to upload files
              </Label>
              <p className="text-xs text-muted-foreground">
                or drag and drop files here
              </p>
            </div>
            <Input
              id={`file-upload-${design.name}`}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar"
            />
          </div>
        </div>
        
        {design.attachments.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {design.attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center space-x-2 flex-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}