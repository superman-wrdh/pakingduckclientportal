import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Design {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useProjectDesigns = (projectId?: string) => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDesigns = async () => {
    if (!projectId || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error('Error fetching designs:', error);
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  const createDesign = async (designData: {
    project_id: string;
    name: string;
    description?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('designs')
      .insert({
        ...designData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Refresh the designs list
    await fetchDesigns();
    
    return data;
  };

  const updateDesign = async (designId: string, updates: {
    name?: string;
    description?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', designId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    // Refresh the designs list
    await fetchDesigns();
    
    return data;
  };

  const deleteDesign = async (designId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', designId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    // Refresh the designs list
    await fetchDesigns();
  };

  useEffect(() => {
    fetchDesigns();
  }, [projectId, user]);

  return {
    designs,
    loading,
    createDesign,
    updateDesign,
    deleteDesign,
    refetch: fetchDesigns,
  };
};