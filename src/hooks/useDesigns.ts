import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface DesignVersion {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  version_number: number;
  is_latest: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  files?: VersionFile[];
}

export interface VersionFile {
  id: string;
  version_id: string;
  file_name: string;
  file_size: number | null;
  file_type: string;
  file_url: string;
  user_id: string;
  created_at: string;
}

export function useDesigns(projectId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [designs, setDesigns] = useState<DesignVersion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDesigns = async () => {
    if (!projectId || !user) return;
    
    setLoading(true);
    try {
      // Fetch design versions with their files
      const { data: designVersions, error } = await supabase
        .from('design_versions')
        .select(`
          *,
          version_files (*)
        `)
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('version_number', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch design data.",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to include files
      const transformedDesigns = designVersions?.map(design => ({
        ...design,
        files: design.version_files || []
      })) || [];

      setDesigns(transformedDesigns);
    } catch (error) {
      console.error('Error fetching designs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch design data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDesignVersion = async (designData: {
    project_id: string;
    name: string;
    description?: string;
    attachments?: File[];
  }) => {
    if (!user) return null;

    try {
      // Get the next version number
      const { data: existingVersions } = await supabase
        .from('design_versions')
        .select('version_number')
        .eq('project_id', designData.project_id)
        .eq('user_id', user.id)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersionNumber = existingVersions?.[0]?.version_number 
        ? existingVersions[0].version_number + 1 
        : 1;

      // Mark all existing versions as not latest
      await supabase
        .from('design_versions')
        .update({ is_latest: false })
        .eq('project_id', designData.project_id)
        .eq('user_id', user.id);

      // Create new design version
      const { data: designVersion, error: designError } = await supabase
        .from('design_versions')
        .insert({
          project_id: designData.project_id,
          name: designData.name,
          description: designData.description || null,
          version_number: nextVersionNumber,
          is_latest: true,
          user_id: user.id
        })
        .select()
        .single();

      if (designError) {
        throw designError;
      }

      // Upload attachments if provided
      if (designData.attachments && designData.attachments.length > 0) {
        for (const file of designData.attachments) {
          const fileName = `${designData.project_id}/designs/${designVersion.id}/${Date.now()}-${file.name}`;
          
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

          // Save file metadata
          await supabase
            .from('version_files')
            .insert({
              version_id: designVersion.id,
              file_name: file.name,
              file_size: file.size,
              file_type: file.type,
              file_url: publicUrl,
              user_id: user.id
            });
        }
      }

      await fetchDesigns(); // Refresh the designs list
      return designVersion;
    } catch (error) {
      console.error('Error creating design version:', error);
      toast({
        title: "Error",
        description: "Failed to create design version.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateDesignVersion = async (
    versionId: string, 
    updates: { name?: string; description?: string }
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('design_versions')
        .update(updates)
        .eq('id', versionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchDesigns(); // Refresh the designs list
      return data;
    } catch (error) {
      console.error('Error updating design version:', error);
      toast({
        title: "Error",
        description: "Failed to update design version.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteDesignVersion = async (versionId: string) => {
    if (!user) return;

    try {
      // Delete associated files first
      await supabase
        .from('version_files')
        .delete()
        .eq('version_id', versionId)
        .eq('user_id', user.id);

      // Delete the design version
      const { error } = await supabase
        .from('design_versions')
        .delete()
        .eq('id', versionId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchDesigns(); // Refresh the designs list
      
      toast({
        title: "Success",
        description: "Design version deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting design version:', error);
      toast({
        title: "Error",
        description: "Failed to delete design version.",
        variant: "destructive",
      });
    }
  };

  const getLatestDesign = () => {
    return designs.find(design => design.is_latest);
  };

  const getPastDesigns = () => {
    return designs.filter(design => !design.is_latest);
  };

  useEffect(() => {
    if (projectId && user) {
      fetchDesigns();
    }
  }, [projectId, user]);

  return {
    designs,
    loading,
    createDesignVersion,
    updateDesignVersion,
    deleteDesignVersion,
    getLatestDesign,
    getPastDesigns,
    refetch: fetchDesigns
  };
}